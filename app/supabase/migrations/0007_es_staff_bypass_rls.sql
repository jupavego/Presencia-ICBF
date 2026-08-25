-- 0006 creó es_staff() como security definer, esperando que eso bastara
-- para que su consulta interna a `profiles` no volviera a disparar la
-- política de select de `profiles` (y así rompiera el ciclo). En teoría
-- alcanza con security definer si el dueño de la función es dueño de la
-- tabla (patrón que la propia documentación de Supabase recomienda para
-- este caso) — pero en este proyecto, verificado en vivo, la recursión
-- siguió ocurriendo, así que la suposición no se cumplió tal cual.
--
-- Fix más explícito y garantizado por la documentación de Postgres,
-- independiente de quién sea el dueño: `set row_security = off` dentro
-- de la función hace que sus propias consultas ignoren la RLS de las
-- tablas que toca, sin importar el rol que la ejecute.
create or replace function public.es_staff()
returns boolean
language sql
security definer
stable
set search_path = public
set row_security = off
as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$;
