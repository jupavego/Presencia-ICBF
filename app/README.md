# Presencia · Panel de Etapas y Formatos

Aplicación de front-end del servicio **Presencia para la Convivencia y el
Fortalecimiento de Vínculos Familiares y Comunitarios** (ICBF). Organiza la
prestación del servicio en sus 7 etapas oficiales y digitaliza los formatos
que intervienen en cada una.

Es una app **React + Vite**, con persistencia real en **Supabase**
(Postgres + Auth) — ver "Configuración de Supabase" más abajo.

## Requisitos

- Node.js 18+ (probado con Node 20) y npm.
- Un proyecto de Supabase (gratuito) para la persistencia — ver
  "Configuración de Supabase".

## Cómo correrla

```bash
npm install
cp .env.example .env   # y complete las credenciales de su proyecto de Supabase
npm run dev
```

Abre `http://localhost:5173`. Sin un `.env` con credenciales válidas la
app no arranca — ver "Configuración de Supabase" para crearlas.

Para generar una build de producción (estático, servible desde cualquier
hosting o detrás de un backend):

```bash
npm run build
npm run preview   # sirve el build localmente para probarlo
```

## Estructura del proyecto

```
docs/
  motor-lectura-red.md    Documentación interna del motor de lectura de red del F1
                          (fundamento metodológico, métricas, patrones, límites).
  exportacion-formatos-oficiales.md  Cómo se descarga lo diligenciado sobre la
                          plantilla oficial (.docx/.xlsx) de cada formato.
public/
  plantillas/             Plantillas .docx/.xlsx que consume la exportación
                          (ver docs/exportacion-formatos-oficiales.md).
supabase/
  migrations/0001_init.sql  Esquema de la base de datos (ver "Configuración
                          de Supabase").
src/
  context/
    AuthContext.jsx        Sesión de Supabase (login/logout), sin registro público.
    CasoContext.jsx         Caso activo — la entidad raíz a la que cuelgan
                          sus datos el resto de formatos y herramientas.
    PerfilSesionContext.jsx  Resultados de las 24 herramientas del Módulo de
                          Perfilamiento para el caso activo, persistidos en
                          Supabase.
  data/
    etapas.js             Única fuente de verdad: las 7 etapas, sus funciones
                          y los formatos que intervienen en cada una.
    glosarioMapaPertenencia.js  Textos del glosario del F1 (ámbitos, círculos,
                          tipos de apoyo), usados en la guía, la leyenda y los
                          tooltips del diagrama — una sola fuente para los tres.
  lib/
    supabaseClient.js       Cliente único de Supabase (lee las variables de entorno).
    persistenciaCaso.js      Guarda los `datos` de un formato oficial en Supabase.
    lecturaRed.js          Motor de lectura de red del F1 (ver docs/motor-lectura-red.md).
    exportOficial.js        Motor de exportación a formato oficial (ver
                          docs/exportacion-formatos-oficiales.md).
  components/
    layout/               Cascarón de la aplicación (TopBar, Sidebar, Hero).
    ui/                    Piezas reutilizables de formulario:
                             Field (Text/Select/TextArea), Choice (radios),
                             CheckboxGrid, DataTable (tablas dinámicas),
                             Section, Callout, FormActions, FormatHeader,
                             Tooltip, PatternCard.
    formats/               Un componente por cada formato digitalizado
                             (F1, F3, F4, F5, F6, F7, F8, F10) + registry.js
                             que los asocia con la clave `componentKey` usada
                             en etapas.js.
    StagePanel.jsx          Vista de una etapa: propósito + funciones + tarjetas.
    FormatCard.jsx          Tarjeta de un formato dentro de una etapa.
    FormatViewer.jsx        Superposición modal que renderiza el formato elegido.
  styles/
    tokens.css              Variables de marca (colores, radios, sombra).
    global.css               Todo el CSS de la aplicación y de los formularios.
```

## Documentación interna

- [`docs/motor-lectura-red.md`](docs/motor-lectura-red.md) — cómo y por qué
  el motor de lectura de red del F1 convierte los vínculos registrados en
  fortalezas y oportunidades de mejora: fundamento metodológico, métricas,
  catálogo de patrones, salvaguardas éticas y cómo extenderlo.
- [`docs/exportacion-formatos-oficiales.md`](docs/exportacion-formatos-oficiales.md) —
  cómo cada formulario descarga lo diligenciado sobre la plantilla oficial
  (.docx/.xlsx) sin modificar su diseño, qué formatos ya lo tienen y cómo
  agregarlo a uno nuevo.
- [`docs/revision-instrumentos-psicometricos.md`](docs/revision-instrumentos-psicometricos.md)
  — evaluación técnica (fichas, fórmulas de puntuación, vacíos y
  duplicados) de los instrumentos psicométricos cargados como insumo para
  futuros motores de lectura (WHO-5, McMaster FAD, MSPSS, FACES, FQOL,
  WHOQOL-BREF, Autoeficacia General, entre otros).
- [`docs/catalogo-instrumentos-psicosociales.md`](docs/catalogo-instrumentos-psicosociales.md)
  — matriz técnica completa (autor, ítems, fórmula, evidencia
  psicométrica, licencia, limitaciones) de cada instrumento verificado,
  más el inventario de instrumentos mencionados en el diseño conceptual
  del sistema de caracterización que aún no tienen fuente confirmada.
- [`docs/mapa-teorico-marcos-conceptuales.md`](docs/mapa-teorico-marcos-conceptuales.md)
  — los marcos teóricos que sustentan el sistema de caracterización
  (Circumplejo de Olson, resiliencia familiar de Walsh, CSDH, modelo
  ecológico, autoeficacia, bienestar, calidad de vida, CIF, fortalezas de
  carácter, rasgos de personalidad, autoestima), cada uno con su nivel de
  respaldo documental explícito.
- [`docs/matriz-variables-indicadores.md`](docs/matriz-variables-indicadores.md)
  — cruce de las 13 esferas del sistema de caracterización con los
  instrumentos verificados (dimensión → constructo → variable →
  indicador), con las esferas sin cobertura marcadas explícitamente en vez
  de rellenarlas con contenido inventado.
- [`docs/arquitectura-modulo-perfilamiento.md`](docs/arquitectura-modulo-perfilamiento.md)
  — diseño del módulo adicional de perfilamiento multidimensional
  (independiente de los formatos F1-F10): trazabilidad esferas → objetivos
  del servicio, ubicación en la app, estructura de datos propuesta
  (`ambitos.js`), motor de lectura genérico y fase 1 de construcción
  acotada.
- [`docs/reglas-puntuacion-interpretacion.md`](docs/reglas-puntuacion-interpretacion.md)
  — reglas de puntuación (Producto 6) e interpretación (Producto 7) por
  herramienta: cómo interactúan entre sí las preguntas de un mismo
  instrumento para generar un perfil descriptivo (nunca un diagnóstico),
  con ejemplos completos de instrumento cuantitativo (McMaster FAD) y
  categórico (Empoderamiento familiar).

### Cómo agregar un formato nuevo

1. Crear `src/components/formats/FxNombreDelFormato.jsx` usando las piezas de
   `src/components/ui/`.
2. Registrarlo en `src/components/formats/registry.js`.
3. Referenciar su `componentKey` en la etapa correspondiente dentro de
   `src/data/etapas.js` (y poner `estado: 'disponible'`).
4. Para que sus datos persistan: `const { casoActivoId } = useCaso()` y,
   junto a la exportación a Word/Excel, `await
   guardarDatosFormatoOficial(casoActivoId, 'Fx', datos)` (ver
   `src/lib/persistenciaCaso.js` y cualquiera de los formatos F3-F10 ya
   conectados como ejemplo).

No hace falta tocar el layout, el visor ni el panel de etapas: se generan
solos a partir de `etapas.js` y del registro de componentes.

## Formatos pendientes

Los formatos marcados como `pendiente` en `etapas.js` (las actuaciones de
tipo SIO en las etapas 05 y 06) corresponden a trámites dentro del
Sistema de Información Oficial del ICBF, no a un formato/plantilla propio —
por eso no tienen componente. La etapa 01 ya no está en este grupo: su
petición de vinculación al servicio (`PET`) es un formato propio de la
plataforma, ya digitalizado. Si el ICBF define un instrumento propio para
las actuaciones SIO restantes, se digitalizan igual que los demás.

## Configuración de Supabase

La app requiere un proyecto de Supabase para funcionar — sin credenciales
válidas en `.env`, ni siquiera arranca (falla explícitamente en vez de
apuntar por accidente a un proyecto equivocado, ver
`src/lib/supabaseClient.js`).

1. Cree un proyecto gratuito en [supabase.com](https://supabase.com).
2. Abra el **editor SQL** del proyecto y corra el contenido de
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   una sola vez — crea las tablas `casos`, `perfilamiento_resultados` y
   `formatos_oficiales_datos`, con Row Level Security habilitada.
3. Cree al menos un usuario desde **Authentication → Users** en el
   dashboard. No hay registro público en esta primera versión — las
   cuentas de los profesionales se crean manualmente, para no dejar la
   API abierta sobre datos sensibles de familias del ICBF.
4. Copie **Project Settings → API → Project URL** y **anon public key**
   a `app/.env` (ver `.env.example`). Este archivo nunca se comitea.
5. Opcional: conecte el repositorio a Vercel o Netlify para desplegar el
   build estático (`npm run build`) — recuerde configurar las mismas
   variables de entorno (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
   en el panel de esa plataforma.

**Alcance de esta primera versión (léalo antes de cargar datos reales):**
cualquier usuario autenticado puede ver y editar todos los casos — no hay
control de acceso por profesional o por rol todavía. Tampoco se hizo una
auditoría de seguridad ni una revisión de cumplimiento de la Ley 1581
(Habeas Data); antes de usar la app con información real de familias, esa
revisión debe hacerla el equipo legal/de cumplimiento del ICBF, no algo
que quede resuelto solo con este cambio de código.

### Qué se persiste

- **`casos`** — la entidad raíz: nace al registrar una Petición de
  Vinculación (etapa 01). El resto de formatos y herramientas cuelgan sus
  datos de este id.
- **`perfilamiento_resultados`** — el resultado de cada una de las 24
  herramientas del Módulo de Perfilamiento para el caso activo (ver
  `PerfilSesionContext.jsx`).
- **`formatos_oficiales_datos`** — los datos que cada formato oficial
  (F1, F3-F8, F10) ya arma para su descarga en Word/Excel, guardados
  también en el servidor al exportar.

## Próximos pasos de arquitectura

Ya resuelto en esta vuelta: persistencia real (Supabase), autenticación
básica y la entidad **Caso**, que antes no existía en ningún lugar del
cliente.

Pendiente para vueltas posteriores: modelar **Familia**/**Integrante**
como entidades propias (hoy viven dentro del JSONB de cada formato, sin
normalizar), **Compromiso/Acuerdo** como tabla propia (hoy es texto
libre dentro de F6/F7), **Profesional/Equipo** con roles y control de
acceso por caso, y el motor de recomendaciones cruzadas entre esferas
(Producto 9, ver `docs/arquitectura-modulo-perfilamiento.md`).
