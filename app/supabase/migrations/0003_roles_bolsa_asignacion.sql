-- Roles reales (beneficiario anónimo / profesional ICBF), bolsa de casos,
-- asignación, Encuentros Comunitarios (F5) como entidad compartida entre
-- casos, y varios diligenciamientos por caso para formatos/herramientas.
-- Correr desde el editor SQL del dashboard de Supabase, una sola vez,
-- DESPUÉS de 0002_familia_compromisos.sql. Ver README.md "Configuración
-- de Supabase".
--
-- Reemplaza el supuesto de 0001_init.sql ("cualquier usuario autenticado
-- ve y edita todos los casos") por control de acceso real: un beneficiario
-- anónimo solo puede tocar su propio caso, vía un código de acceso, a
-- través de funciones `security definer` (nunca acceso directo de tabla);
-- un profesional ICBF solo ve la bolsa común y sus propios casos
-- asignados; un admin ve y gestiona todo.

-- =========================================================================
-- 1. profiles — una fila por cuenta real de staff (nunca para beneficiarios
--    anónimos, que no tienen fila en auth.users).
-- =========================================================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  rol text not null default 'profesional_icbf' check (rol in ('profesional_icbf', 'admin')),
  nombre text,
  centro_zonal text,
  creado_en timestamptz not null default now()
);

alter table profiles enable row level security;

-- Autocompleta profiles al crear una cuenta nueva (las cuentas de staff se
-- siguen creando a mano en Authentication → Users, ver README.md — este
-- trigger solo evita tener que además insertar en profiles a mano cada
-- vez). El rol por defecto es 'profesional_icbf'; subir alguien a 'admin'
-- sigue siendo una edición manual en el dashboard.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, rol) values (new.id, 'profesional_icbf')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: cuentas de staff que ya existían antes de este trigger.
insert into public.profiles (id, rol)
select id, 'profesional_icbf' from auth.users
on conflict (id) do nothing;

-- =========================================================================
-- 2. casos — estado de asignación + código de acceso del beneficiario.
-- =========================================================================

alter table casos
  add column if not exists estado text not null default 'bolsa_comun',
  add column if not exists asignado_a uuid references auth.users(id),
  add column if not exists asignado_en timestamptz,
  add column if not exists codigo_acceso text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'casos_estado_check') then
    alter table casos add constraint casos_estado_check
      check (estado in ('bolsa_comun', 'asignado', 'cerrado', 'eliminado'));
  end if;
end $$;

create unique index if not exists casos_codigo_acceso_key on casos(codigo_acceso);

-- =========================================================================
-- 3. caso_asignaciones — historial de quién trabajó cada caso y cuándo.
-- =========================================================================

create table if not exists caso_asignaciones (
  id uuid primary key default gen_random_uuid(),
  caso_id uuid not null references casos(id) on delete cascade,
  asignado_a uuid not null references auth.users(id),
  asignado_por uuid references auth.users(id),
  asignado_en timestamptz not null default now(),
  liberado_en timestamptz -- null = asignación activa
);

create index if not exists caso_asignaciones_caso_idx on caso_asignaciones(caso_id);
create index if not exists caso_asignaciones_activa_idx on caso_asignaciones(caso_id) where liberado_en is null;

alter table caso_asignaciones enable row level security;

-- =========================================================================
-- 4. encuentros_comunitarios + encuentro_participantes — F5 deja de ser
--    una fila 1:1 con un solo caso. Un encuentro lo registra un
--    profesional una sola vez y lo asisten varios beneficiarios a la vez.
-- =========================================================================

create table if not exists encuentros_comunitarios (
  id uuid primary key default gen_random_uuid(),
  -- nullable: las filas migradas desde formatos_oficiales_datos (ver más
  -- abajo) pueden no tener un creado_por confiable en el caso original;
  -- todo encuentro NUEVO desde la app siempre trae el uid de quien lo
  -- diligencia.
  realizado_por uuid references auth.users(id),
  fecha date,
  -- mismo objeto `datos` que ya arma F5EncuentrosComunitarios.jsx para el
  -- docx (metodología, objetivo, actividades, logros...).
  datos jsonb not null,
  creado_en timestamptz not null default now()
);

create index if not exists encuentros_comunitarios_realizado_por_idx on encuentros_comunitarios(realizado_por);

alter table encuentros_comunitarios enable row level security;

create table if not exists encuentro_participantes (
  encuentro_id uuid not null references encuentros_comunitarios(id) on delete cascade,
  caso_id uuid not null references casos(id) on delete cascade,
  primary key (encuentro_id, caso_id)
);

create index if not exists encuentro_participantes_caso_idx on encuentro_participantes(caso_id);

alter table encuentro_participantes enable row level security;

-- Migración no destructiva de las filas F5 existentes: no se borra nada de
-- formatos_oficiales_datos, solo se copian a las tablas nuevas. Si algún
-- cruce quedara imperfecto en un caso raro, no se pierde información, solo
-- faltaría vincular ese registro puntual a mano.
--
-- `datos->>'fecha'` viene en formato DD/MM/AAAA (lo arma formatoFecha() en
-- exportOficial.js para el documento oficial), no AAAA-MM-DD — un cast
-- directo a ::date lo interpreta con el datestyle por defecto (MDY) y
-- revienta apenas el día supera 12. to_date() con la máscara explícita lo
-- resuelve. El `not exists` de participantes hace este bloque seguro de
-- volver a correr sin duplicar si el script se ejecuta más de una vez.
with migrados as (
  insert into encuentros_comunitarios (realizado_por, fecha, datos, creado_en)
  select
    c.creado_por,
    to_date(nullif(fod.datos->>'fecha', ''), 'DD/MM/YYYY'),
    fod.datos,
    fod.actualizado_en
  from formatos_oficiales_datos fod
  join casos c on c.id = fod.caso_id
  where fod.formato_key = 'F5'
    and not exists (select 1 from encuentro_participantes ep where ep.caso_id = fod.caso_id)
  returning id, datos, creado_en
)
insert into encuentro_participantes (encuentro_id, caso_id)
select m.id, fod.caso_id
from formatos_oficiales_datos fod
join migrados m on m.datos = fod.datos and m.creado_en = fod.actualizado_en
where fod.formato_key = 'F5';

-- =========================================================================
-- 5. formatos_metadata — qué formatos oficiales puede diligenciar un
--    beneficiario sin acompañamiento (hoy: solo F1, Mapa de Pertenencia).
-- =========================================================================

create table if not exists formatos_metadata (
  formato_key text primary key,
  autodiligenciable_beneficiario boolean not null default false
);

alter table formatos_metadata enable row level security;

insert into formatos_metadata (formato_key, autodiligenciable_beneficiario)
values ('F1', true)
on conflict (formato_key) do update set autodiligenciable_beneficiario = excluded.autodiligenciable_beneficiario;

drop policy if exists "leer metadata de formatos" on formatos_metadata;
create policy "leer metadata de formatos" on formatos_metadata for select using (true);

-- =========================================================================
-- 6. Historial múltiple: quitar la restricción única que hoy hace que un
--    segundo diligenciamiento sobrescriba el primero. Se busca el nombre
--    real de la restricción en vez de asumirlo, por seguridad.
-- =========================================================================

do $$
declare
  v_name text;
begin
  select constraint_name into v_name
  from information_schema.table_constraints
  where table_name = 'formatos_oficiales_datos' and constraint_type = 'UNIQUE';
  if v_name is not null then
    execute format('alter table formatos_oficiales_datos drop constraint %I', v_name);
  end if;
end $$;

do $$
declare
  v_name text;
begin
  select constraint_name into v_name
  from information_schema.table_constraints
  where table_name = 'perfilamiento_resultados' and constraint_type = 'UNIQUE';
  if v_name is not null then
    execute format('alter table perfilamiento_resultados drop constraint %I', v_name);
  end if;
end $$;

-- =========================================================================
-- 7. Funciones security definer — el único camino de escritura/lectura
--    para un beneficiario anónimo. Nunca se le da acceso directo a las
--    tablas: la RLS de más abajo no le otorga ninguna política a `anon`,
--    todo pasa por aquí, donde se valida el código de acceso primero.
-- =========================================================================

create or replace function crear_caso_beneficiario(
  p_nombre text,
  p_municipio text,
  p_numero_peticion text default null
) returns casos
language plpgsql
security definer
set search_path = public
as $$
declare
  v_codigo text;
  v_caso casos;
  v_intento int := 0;
begin
  loop
    v_codigo := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
    begin
      insert into casos (numero_peticion, nombre_participante, municipio, creado_por, estado, codigo_acceso)
      values (p_numero_peticion, p_nombre, p_municipio, auth.uid(), 'bolsa_comun', v_codigo)
      returning * into v_caso;
      exit;
    exception when unique_violation then
      v_intento := v_intento + 1;
      if v_intento > 5 then
        raise exception 'No se pudo generar un código de acceso único, intente de nuevo';
      end if;
    end;
  end loop;
  return v_caso;
end;
$$;

grant execute on function crear_caso_beneficiario(text, text, text) to anon, authenticated;

create or replace function obtener_caso_por_codigo(p_codigo text)
returns casos
language sql
security definer
set search_path = public
as $$
  select * from casos where codigo_acceso = upper(p_codigo) and estado <> 'eliminado';
$$;

grant execute on function obtener_caso_por_codigo(text) to anon, authenticated;

create or replace function guardar_formato_beneficiario(
  p_codigo text,
  p_formato_key text,
  p_datos jsonb
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caso_id uuid;
  v_permitido boolean;
begin
  select id into v_caso_id from casos where codigo_acceso = upper(p_codigo) and estado <> 'eliminado';
  if v_caso_id is null then
    raise exception 'Código de acceso inválido';
  end if;

  select coalesce(autodiligenciable_beneficiario, false) into v_permitido
  from formatos_metadata where formato_key = p_formato_key;

  if not coalesce(v_permitido, false) then
    raise exception 'Este formato no se puede diligenciar sin acompañamiento';
  end if;

  insert into formatos_oficiales_datos (caso_id, formato_key, datos)
  values (v_caso_id, p_formato_key, p_datos);
end;
$$;

grant execute on function guardar_formato_beneficiario(text, text, jsonb) to anon, authenticated;

create or replace function guardar_perfilamiento_beneficiario(
  p_codigo text,
  p_instrumento_id text,
  p_resultado jsonb
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caso_id uuid;
begin
  select id into v_caso_id from casos where codigo_acceso = upper(p_codigo) and estado <> 'eliminado';
  if v_caso_id is null then
    raise exception 'Código de acceso inválido';
  end if;

  insert into perfilamiento_resultados (caso_id, instrumento_id, resultado)
  values (v_caso_id, p_instrumento_id, p_resultado);
end;
$$;

grant execute on function guardar_perfilamiento_beneficiario(text, text, jsonb) to anon, authenticated;

-- Lectura para el beneficiario: sin esto, PerfilSesionContext.jsx no
-- tendría forma de hidratar los resultados ya guardados al volver sin
-- sesión (la RLS de perfilamiento_resultados no le da ningún select
-- directo a `anon`). `order by actualizado_en asc` para que, con varias
-- filas por instrumento (historial), la última en el resultado sea la más
-- reciente — mismo criterio que ya usa el cliente al hidratar.
create or replace function obtener_perfilamiento_por_codigo(p_codigo text)
returns setof perfilamiento_resultados
language sql
security definer
set search_path = public
as $$
  select pr.* from perfilamiento_resultados pr
  join casos c on c.id = pr.caso_id
  where c.codigo_acceso = upper(p_codigo) and c.estado <> 'eliminado'
  order by pr.actualizado_en asc;
$$;

grant execute on function obtener_perfilamiento_por_codigo(text) to anon, authenticated;

-- =========================================================================
-- 8. RLS — reemplaza la política única "authenticated = todo" de cada
--    tabla por control de acceso real.
-- =========================================================================

drop policy if exists "authenticated read/write casos" on casos;
drop policy if exists "authenticated read/write perfilamiento_resultados" on perfilamiento_resultados;
drop policy if exists "authenticated read/write formatos_oficiales_datos" on formatos_oficiales_datos;
drop policy if exists "authenticated read/write familia_integrantes" on familia_integrantes;
drop policy if exists "authenticated read/write compromisos" on compromisos;

-- Vuelve a correr limpio si el script ya se ejecutó parcialmente antes.
drop policy if exists "leer todos los perfiles" on profiles;
drop policy if exists "ver casos: bolsa comun, propios o admin" on casos;
drop policy if exists "actualizar casos: reclamar, gestionar lo propio, o admin" on casos;
drop policy if exists "eliminar casos (solo admin)" on casos;
drop policy if exists "staff gestiona formatos de sus casos asignados" on formatos_oficiales_datos;
drop policy if exists "staff gestiona perfilamiento de sus casos asignados" on perfilamiento_resultados;
drop policy if exists "staff gestiona familia de sus casos asignados" on familia_integrantes;
drop policy if exists "staff gestiona compromisos de sus casos asignados" on compromisos;
drop policy if exists "profesional gestiona sus encuentros comunitarios" on encuentros_comunitarios;
drop policy if exists "profesional gestiona participantes de sus encuentros" on encuentro_participantes;
drop policy if exists "ver mis asignaciones o admin" on caso_asignaciones;
drop policy if exists "crear asignaciones (staff)" on caso_asignaciones;
drop policy if exists "liberar mis asignaciones o admin" on caso_asignaciones;

-- --- profiles ---
create policy "leer todos los perfiles" on profiles
  for select using (auth.role() = 'authenticated');
-- Sin política de insert/update/delete para el cliente: el rol se sigue
-- gestionando a mano en el dashboard, igual que hoy se crean las cuentas.

-- --- casos ---
-- select: bolsa común (para elegir qué reclamar), lo propio asignado, o
-- todo si es admin — SOLO para `authenticated`. anon nunca tiene una
-- política aquí — solo entra por las funciones de la sección 7. El guard
-- `auth.role() = 'authenticated'` es imprescindible: sin él, la condición
-- `estado = 'bolsa_comun'` es una comparación de columna contra una
-- constante, no contra auth.uid(), así que aplicaría igual a anon que a
-- cualquier otro rol y expondría los datos de toda la bolsa común
-- (nombres, municipios) a cualquier visitante sin sesión. Confirmado en
-- pruebas reales antes de este ajuste — no es una precaución teórica.
create policy "ver casos: bolsa comun, propios o admin" on casos
  for select using (
    auth.role() = 'authenticated'
    and (
      estado = 'bolsa_comun'
      or asignado_a = auth.uid()
      or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin')
    )
  );

-- Sin política de insert: la creación de un caso pasa exclusivamente por
-- crear_caso_beneficiario() (security definer), tanto para beneficiario
-- como para staff creando en nombre de alguien.

create policy "actualizar casos: reclamar, gestionar lo propio, o admin" on casos
  for update using (
    auth.role() = 'authenticated'
    and (
      estado = 'bolsa_comun'
      or asignado_a = auth.uid()
      or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin')
    )
  )
  with check (
    auth.role() = 'authenticated'
    and (
      (
        estado <> 'eliminado'
        and (
          asignado_a = auth.uid()
          or estado = 'bolsa_comun'
          or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin')
        )
      )
      or (
        estado = 'eliminado'
        and exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin')
      )
    )
  );

create policy "eliminar casos (solo admin)" on casos
  for delete using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin')
  );

-- --- formatos_oficiales_datos / perfilamiento_resultados ---
-- Staff: solo el caso que tiene asignado, o admin. anon: cero acceso
-- directo — pasa por guardar_formato_beneficiario / guardar_perfilamiento_beneficiario.
create policy "staff gestiona formatos de sus casos asignados" on formatos_oficiales_datos
  for all using (
    exists (
      select 1 from casos c
      where c.id = formatos_oficiales_datos.caso_id
        and (c.asignado_a = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin'))
    )
  )
  with check (
    exists (
      select 1 from casos c
      where c.id = formatos_oficiales_datos.caso_id
        and (c.asignado_a = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin'))
    )
  );

create policy "staff gestiona perfilamiento de sus casos asignados" on perfilamiento_resultados
  for all using (
    exists (
      select 1 from casos c
      where c.id = perfilamiento_resultados.caso_id
        and (c.asignado_a = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin'))
    )
  )
  with check (
    exists (
      select 1 from casos c
      where c.id = perfilamiento_resultados.caso_id
        and (c.asignado_a = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin'))
    )
  );

-- --- familia_integrantes / compromisos --- mismo criterio.
create policy "staff gestiona familia de sus casos asignados" on familia_integrantes
  for all using (
    exists (
      select 1 from casos c
      where c.id = familia_integrantes.caso_id
        and (c.asignado_a = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin'))
    )
  )
  with check (
    exists (
      select 1 from casos c
      where c.id = familia_integrantes.caso_id
        and (c.asignado_a = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin'))
    )
  );

create policy "staff gestiona compromisos de sus casos asignados" on compromisos
  for all using (
    exists (
      select 1 from casos c
      where c.id = compromisos.caso_id
        and (c.asignado_a = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin'))
    )
  )
  with check (
    exists (
      select 1 from casos c
      where c.id = compromisos.caso_id
        and (c.asignado_a = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin'))
    )
  );

-- --- encuentros_comunitarios / encuentro_participantes ---
create policy "profesional gestiona sus encuentros comunitarios" on encuentros_comunitarios
  for all using (
    realizado_por = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin')
  )
  with check (
    realizado_por = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin')
  );

create policy "profesional gestiona participantes de sus encuentros" on encuentro_participantes
  for all using (
    exists (
      select 1 from encuentros_comunitarios e
      where e.id = encuentro_participantes.encuentro_id
        and (e.realizado_por = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin'))
    )
  )
  with check (
    exists (
      select 1 from encuentros_comunitarios e
      where e.id = encuentro_participantes.encuentro_id
        and (e.realizado_por = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin'))
    )
    and exists (
      select 1 from casos c
      where c.id = encuentro_participantes.caso_id
        and (c.asignado_a = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin'))
    )
  );

-- --- caso_asignaciones ---
create policy "ver mis asignaciones o admin" on caso_asignaciones
  for select using (
    asignado_a = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin')
  );

create policy "crear asignaciones (staff)" on caso_asignaciones
  for insert with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.rol in ('profesional_icbf', 'admin'))
  );

create policy "liberar mis asignaciones o admin" on caso_asignaciones
  for update using (
    asignado_a = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin')
  );
