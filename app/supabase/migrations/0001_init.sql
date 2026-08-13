-- Persistencia real para Presencia (Supabase / Postgres).
-- Correr desde el editor SQL del dashboard de Supabase, una sola vez, en
-- un proyecto nuevo. Ver README.md "Configuración de Supabase" para el
-- procedimiento completo.
--
-- Diseño: en vez de normalizar cada uno de los 24 instrumentos del Módulo
-- de Perfilamiento y cada uno de los 8 formatos oficiales en sus propias
-- tablas, se guarda el mismo objeto `resultado`/`datos` que el cliente ya
-- construye hoy (ver src/context/PerfilSesionContext.jsx y los
-- handleExportarOficial() de cada formato) como JSONB — mismo principio
-- de "esquema genérico + definición por instrumento" que ya usa
-- src/lib/motorInstrumento.js. `casos` es la única entidad nueva de
-- verdad: la raíz a la que se cuelga todo lo demás, algo que hoy no
-- existe en ningún lugar del cliente.

create extension if not exists "pgcrypto";

create table if not exists casos (
  id uuid primary key default gen_random_uuid(),
  numero_peticion text,
  nombre_participante text,
  municipio text,
  creado_en timestamptz not null default now(),
  creado_por uuid references auth.users
);

create table if not exists perfilamiento_resultados (
  id uuid primary key default gen_random_uuid(),
  caso_id uuid not null references casos(id) on delete cascade,
  -- mismo id que `definicion.id` en src/data/instrumentos/*.js (ej. 'WHO5', 'PROYVIDA')
  instrumento_id text not null,
  -- forma exacta del objeto que produce leerInstrumento/leerInstrumentoMultiescala/leerCategorias:
  -- { completo, puntaje|puntajes|categorias, patrones: [...], notas? }
  resultado jsonb not null,
  actualizado_en timestamptz not null default now(),
  unique (caso_id, instrumento_id)
);

create table if not exists formatos_oficiales_datos (
  id uuid primary key default gen_random_uuid(),
  caso_id uuid not null references casos(id) on delete cascade,
  -- mismo componentKey que registry.js (ej. 'F1', 'F7')
  formato_key text not null,
  -- mismo objeto `datos` que hoy arma cada handleExportarOficial() para el docx/xlsx
  datos jsonb not null,
  actualizado_en timestamptz not null default now(),
  unique (caso_id, formato_key)
);

create index if not exists perfilamiento_resultados_caso_idx on perfilamiento_resultados(caso_id);
create index if not exists formatos_oficiales_datos_caso_idx on formatos_oficiales_datos(caso_id);

alter table casos enable row level security;
alter table perfilamiento_resultados enable row level security;
alter table formatos_oficiales_datos enable row level security;

-- Alcance de esta primera vuelta: cualquier usuario autenticado ve y edita
-- todos los casos (un solo equipo, sin control de acceso por usuario/rol
-- todavía) — mismo supuesto que ya tiene hoy la app, que no tiene ningún
-- concepto de usuario. Restringir por usuario/rol queda para una vuelta
-- posterior si ICBF lo requiere.
create policy "authenticated read/write casos" on casos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated read/write perfilamiento_resultados" on perfilamiento_resultados
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated read/write formatos_oficiales_datos" on formatos_oficiales_datos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
