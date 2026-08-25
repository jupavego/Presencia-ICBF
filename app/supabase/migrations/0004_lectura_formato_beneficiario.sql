-- Lectura del último formato oficial diligenciado, para el beneficiario
-- anónimo (código de acceso) — hoy solo lo necesita F1 (el único formato
-- autodiligenciable sin acompañamiento, ver formatos_metadata), para poder
-- reabrir el Mapa de Pertenencia con lo que ya guardó, en vez de empezar en
-- blanco cada vez. Correr una sola vez en el editor SQL del dashboard de
-- Supabase, DESPUÉS de 0003_roles_bolsa_asignacion.sql.
--
-- Mismo patrón que obtener_perfilamiento_por_codigo (0003...sql): valida el
-- código antes de leer, nunca acceso directo de tabla para `anon` — la RLS
-- de formatos_oficiales_datos no le da ninguna política a anon.
create or replace function obtener_ultimo_formato_por_codigo(p_codigo text, p_formato_key text)
returns formatos_oficiales_datos
language sql
security definer
set search_path = public
as $$
  select fod.* from formatos_oficiales_datos fod
  join casos c on c.id = fod.caso_id
  where c.codigo_acceso = upper(p_codigo)
    and c.estado <> 'eliminado'
    and fod.formato_key = p_formato_key
  order by fod.actualizado_en desc
  limit 1;
$$;

grant execute on function obtener_ultimo_formato_por_codigo(text, text) to anon, authenticated;
