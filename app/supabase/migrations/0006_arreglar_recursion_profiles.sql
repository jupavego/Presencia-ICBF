-- Arregla un bug real introducido en 0004_beneficiario_autenticado.sql:
-- la política de select de `profiles` quedó consultando la propia tabla
-- `profiles` dentro de su propia política ("staff lee el directorio de
-- staff" -> exists (select 1 from profiles ...) on profiles) — Postgres
-- lo rechaza con "infinite recursion detected in policy for relation
-- profiles" (código 42P17), y eso rompe la carga de perfil para
-- TODOS los usuarios, staff incluido, no solo para beneficiarios.
--
-- Fix estándar de Supabase para este caso: envolver el chequeo en una
-- función security definer — al ejecutarse como el dueño de la tabla,
-- no vuelve a evaluar la RLS de `profiles` sobre sí misma, así que no
-- hay recursión. Correr esto INMEDIATO después de 0004, antes que
-- cualquier otra cosa dependa de leer `profiles`.

create or replace function public.es_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$;

drop policy if exists "staff lee el directorio de staff" on profiles;
create policy "staff lee el directorio de staff" on profiles
  for select using (es_staff());
