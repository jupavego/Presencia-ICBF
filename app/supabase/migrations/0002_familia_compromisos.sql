-- Familia/Integrantes y Compromisos como entidades compartidas por caso.
-- Correr desde el editor SQL del dashboard de Supabase, una sola vez,
-- DESPUÉS de 0001_init.sql. Ver README.md "Configuración de Supabase".
--
-- Antes de esto, F7PerfilSocioFamiliar.jsx guardaba sus "integrantes" y
-- F6AcompanamientoEntornoFamiliar.jsx guardaba sus "compromisos" cada uno
-- dentro de su propia fila de `formatos_oficiales_datos` — dos formatos
-- no podían compartir ni consultar esa información entre sí. Estas dos
-- tablas nuevas los sacan de ahí a su propia fuente de datos, una por
-- caso, con el mismo patrón "arreglo JSONB completo, upsert por caso_id"
-- que ya usa `formatos_oficiales_datos` — no se pasa a filas individuales
-- por integrante/compromiso con llaves foráneas (ver comentario de
-- 0001_init.sql sobre el principio de "esquema genérico" ya elegido).

create table if not exists familia_integrantes (
  id uuid primary key default gen_random_uuid(),
  caso_id uuid not null references casos(id) on delete cascade unique,
  -- [{ id, nombre, edad, lugarNacimiento, estadoCivil, nivelEscolar,
  --    rolFamilia, afiliacionSalud, ocupacion, dedicacion }]
  -- mismas claves que ya arma nuevoIntegrante() en F7PerfilSocioFamiliar.jsx,
  -- + un `id` propio por integrante (generado en el cliente).
  integrantes jsonb not null default '[]'::jsonb,
  actualizado_en timestamptz not null default now()
);

create table if not exists compromisos (
  id uuid primary key default gen_random_uuid(),
  caso_id uuid not null references casos(id) on delete cascade unique,
  -- [{ id, descripcion, responsable, fecha, estado, origen }]
  -- mismas claves que ya arma nuevoCompromiso() en
  -- F6AcompanamientoEntornoFamiliar.jsx, + `id` propio y `origen`
  -- (ej. 'F6') para saber desde qué formato se creó cada uno.
  items jsonb not null default '[]'::jsonb,
  actualizado_en timestamptz not null default now()
);

create index if not exists familia_integrantes_caso_idx on familia_integrantes(caso_id);
create index if not exists compromisos_caso_idx on compromisos(caso_id);

alter table familia_integrantes enable row level security;
alter table compromisos enable row level security;

-- Mismo alcance que las demás tablas: cualquier usuario autenticado
-- ve/edita todo (sin control de acceso por rol todavía).
create policy "authenticated read/write familia_integrantes" on familia_integrantes
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated read/write compromisos" on compromisos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
