-- Arregla un detalle cosmético que dejó 0004_beneficiario_autenticado.sql:
-- la política de `profiles` ahora es staff-only, así que cuando un
-- beneficiario (con cuenta o con código de acceso) sube evidencia de un
-- caso que ya tiene profesional asignado, drive-storage/index.ts no puede
-- leer el nombre de ese profesional para nombrar la carpeta — antes caía
-- en "Profesional sin nombre". Esta función expone solo el nombre (nada
-- más de la fila) para ese caso puntual, sin reabrir el resto de
-- `profiles`.
create or replace function obtener_nombre_staff(p_id uuid)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select nombre from profiles where id = p_id;
$$;

grant execute on function obtener_nombre_staff(uuid) to anon, authenticated;
