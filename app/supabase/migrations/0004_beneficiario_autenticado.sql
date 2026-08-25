-- Habilita cuentas reales (autenticadas) para beneficiarios, sin volverlos
-- staff. Correr desde el editor SQL del dashboard de Supabase, una sola
-- vez, DESPUÉS de 0003_roles_bolsa_asignacion.sql.
--
-- Por qué hace falta esto y no basta con prender supabase.auth.signUp():
-- el diseño de 0003 asume en varios lugares que "authenticated = staff"
-- (el trigger que autocompleta profiles, la política de select de
-- profiles, y el guard de las políticas de casos que protege la bolsa
-- común). Un beneficiario con cuenta real rompe esa suposición si no se
-- ajustan esos puntos primero — ver el plan de implementación para el
-- detalle de cada uno.

-- =========================================================================
-- 1. handle_new_user(): no crear fila en profiles para cuentas de
--    beneficiario (marcadas por el cliente vía
--    supabase.auth.signUp({ options: { data: { tipo_cuenta: 'beneficiario' } } })).
--    Cuentas creadas a mano en el dashboard (sin esa metadata, que es como
--    se crean hoy las de staff) siguen autocompletándose en profiles
--    exactamente igual que antes.
-- =========================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(new.raw_user_meta_data->>'tipo_cuenta', '') <> 'beneficiario' then
    insert into public.profiles (id, rol) values (new.id, 'profesional_icbf')
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

-- =========================================================================
-- 2. profiles: antes cualquier `authenticated` leía el directorio completo
--    de staff (nombres, roles, centro zonal) — eso incluiría ahora a
--    beneficiarios con cuenta. Se restringe a "el que pregunta es staff".
-- =========================================================================
drop policy if exists "leer todos los perfiles" on profiles;
create policy "staff lee el directorio de staff" on profiles
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid())
  );

-- =========================================================================
-- 3. casos — select: separar "es staff" (tiene fila en profiles) de
--    "está autenticado", y sumar acceso a lo propio (creado_por) para un
--    beneficiario con cuenta. Sin este cambio, un beneficiario autenticado
--    vería (por el guard roto `auth.role() = 'authenticated'`) toda la
--    bolsa común, no solo su caso — el mismo problema que el comentario
--    original de 0003 ya advertía para `anon`.
-- =========================================================================
drop policy if exists "ver casos: bolsa comun, propios o admin" on casos;
create policy "ver casos: bolsa comun, propios, admin, o creados por mi" on casos
  for select using (
    creado_por = auth.uid()
    or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin')
    or (
      exists (select 1 from profiles p where p.id = auth.uid())
      and (estado = 'bolsa_comun' or asignado_a = auth.uid())
    )
  );

-- =========================================================================
-- 4. casos — update: mismo arreglo de guard (authenticated → staff), SIN
--    sumar acceso de beneficiario. Deliberado: hoy nadie sin cuenta
--    actualiza `casos` directamente (todo pasa por las funciones security
--    definer de 0003), así que no hay ninguna razón para abrir esa puerta
--    ahora solo porque el beneficiario tiene sesión.
-- =========================================================================
drop policy if exists "actualizar casos: reclamar, gestionar lo propio, o admin" on casos;
create policy "actualizar casos: reclamar, gestionar lo propio, o admin" on casos
  for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin')
    or (
      exists (select 1 from profiles p where p.id = auth.uid())
      and (estado = 'bolsa_comun' or asignado_a = auth.uid())
    )
  )
  with check (
    (
      estado <> 'eliminado'
      and (
        exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin')
        or (
          exists (select 1 from profiles p where p.id = auth.uid())
          and (asignado_a = auth.uid() or estado = 'bolsa_comun')
        )
      )
    )
    or (
      estado = 'eliminado'
      and exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin')
    )
  );

-- =========================================================================
-- 5. formatos_oficiales_datos: suma acceso a lo propio para un
--    beneficiario con cuenta, PERO solo para los formatos marcados
--    autodiligenciable_beneficiario en formatos_metadata (hoy: solo F1) —
--    exactamente la misma restricción que ya aplica
--    guardar_formato_beneficiario() en 0003. Sin el EXISTS, un
--    beneficiario con cuenta podría escribir directo formatos que hoy
--    solo diligencia staff (F3, F6, F7...), más de lo que ya tiene como
--    invitado.
-- =========================================================================
drop policy if exists "staff gestiona formatos de sus casos asignados" on formatos_oficiales_datos;
create policy "staff o beneficiario gestiona formatos de su caso" on formatos_oficiales_datos
  for all using (
    exists (
      select 1 from casos c
      where c.id = formatos_oficiales_datos.caso_id
        and (
          c.asignado_a = auth.uid()
          or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin')
          or (
            c.creado_por = auth.uid()
            and exists (
              select 1 from formatos_metadata fm
              where fm.formato_key = formatos_oficiales_datos.formato_key
                and fm.autodiligenciable_beneficiario = true
            )
          )
        )
    )
  )
  with check (
    exists (
      select 1 from casos c
      where c.id = formatos_oficiales_datos.caso_id
        and (
          c.asignado_a = auth.uid()
          or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin')
          or (
            c.creado_por = auth.uid()
            and exists (
              select 1 from formatos_metadata fm
              where fm.formato_key = formatos_oficiales_datos.formato_key
                and fm.autodiligenciable_beneficiario = true
            )
          )
        )
    )
  );

-- =========================================================================
-- 6. perfilamiento_resultados: suma acceso a lo propio, sin restricción
--    adicional por instrumento — guardar_perfilamiento_beneficiario() en
--    0003 tampoco restringe por instrumento_id, así que esto no otorga
--    nada nuevo respecto a lo que un beneficiario ya puede hacer hoy vía
--    RPC, solo lo vuelve alcanzable también por RLS directa (necesario
--    para que PerfilSesionContext.jsx, que ya bifurca
--    `session ? consulta directa : RPC con código`, funcione sin tocarlo).
-- =========================================================================
drop policy if exists "staff gestiona perfilamiento de sus casos asignados" on perfilamiento_resultados;
create policy "staff o beneficiario gestiona perfilamiento de su caso" on perfilamiento_resultados
  for all using (
    exists (
      select 1 from casos c
      where c.id = perfilamiento_resultados.caso_id
        and (
          c.asignado_a = auth.uid()
          or c.creado_por = auth.uid()
          or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin')
        )
    )
  )
  with check (
    exists (
      select 1 from casos c
      where c.id = perfilamiento_resultados.caso_id
        and (
          c.asignado_a = auth.uid()
          or c.creado_por = auth.uid()
          or exists (select 1 from profiles p where p.id = auth.uid() and p.rol = 'admin')
        )
    )
  );

-- No se tocan familia_integrantes ni compromisos: hoy no existe ninguna
-- función security definer que le dé a un beneficiario acceso a esas dos
-- tablas (F2/F6 son formatos de staff), así que no hay precedente que
-- replicar y no se les abre acceso nuevo aquí.
