# Presencia · Panel de Etapas y Formatos

Aplicación de front-end del servicio **Presencia para la Convivencia y el
Fortalecimiento de Vínculos Familiares y Comunitarios** (ICBF). Organiza la
prestación del servicio en sus 7 etapas oficiales y digitaliza los formatos
que intervienen en cada una.

Es una app **React + Vite** estándar: sin backend todavía, sin persistencia
de datos. Ese es el siguiente paso una vez se defina el gestor de base de
datos / CRM.

## Requisitos

- Node.js 18+ (probado con Node 20) y npm.

## Cómo correrla

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

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
src/
  data/
    etapas.js             Única fuente de verdad: las 7 etapas, sus funciones
                          y los formatos que intervienen en cada una.
    glosarioMapaPertenencia.js  Textos del glosario del F1 (ámbitos, círculos,
                          tipos de apoyo), usados en la guía, la leyenda y los
                          tooltips del diagrama — una sola fuente para los tres.
  lib/
    lecturaRed.js          Motor de lectura de red del F1 (ver docs/motor-lectura-red.md).
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

### Cómo agregar un formato nuevo

1. Crear `src/components/formats/FxNombreDelFormato.jsx` usando las piezas de
   `src/components/ui/`.
2. Registrarlo en `src/components/formats/registry.js`.
3. Referenciar su `componentKey` en la etapa correspondiente dentro de
   `src/data/etapas.js` (y poner `estado: 'disponible'`).

No hace falta tocar el layout, el visor ni el panel de etapas: se generan
solos a partir de `etapas.js` y del registro de componentes.

## Formatos pendientes

Los formatos marcados como `pendiente` en `etapas.js` (las actuaciones de
tipo SIO en las etapas 01, 06 y 07) corresponden a trámites dentro del
Sistema de Información Oficial del ICBF, no a un formato/plantilla propio —
por eso no tienen componente. Si el ICBF define un instrumento propio para
esas actuaciones, se digitaliza igual que los demás.

## Próximos pasos de arquitectura (no implementados aún)

Pensando en el futuro backend/CRM, los objetos que ya se perfilan en el
modelo de datos actual son: **Familia** / **Integrante**, **Caso o Petición**
(vinculado al SIO), **Etapa**, **Formato/Instrumento** (código, versión,
estado), **Registro de acompañamiento** (por forma: diálogo, encuentro
comunitario, entorno familiar), **Compromiso/Acuerdo**, **Vínculo de red**
(mapa de pertenencia) y **Profesional/Equipo**.
