# Arquitectura del Módulo de Perfilamiento Multidimensional

**Documento interno de la solución — fase de ideación.** Responde a una
decisión de alcance explícita: este módulo **no modifica los formatos F1-F10
ya digitalizados**; es un módulo adicional, transversal a las 7 etapas,
que ofrece herramientas de perfilamiento segmentadas por **ámbito de vida**
(las 13 esferas del prompt maestro, sección 4), al servicio directo de los
tres objetivos del servicio Presencia. Es una primera bajada arquitectónica
de lo que el prompt maestro llama "Producto 10 — Arquitectura funcional del
sistema", aplicada concretamente a esta app (React + Vite, sin backend
todavía).

Se apoya en los tres documentos previos: [catálogo de instrumentos](catalogo-instrumentos-psicosociales.md),
[mapa teórico](mapa-teorico-marcos-conceptuales.md) y [matriz de variables e
indicadores](matriz-variables-indicadores.md) (Productos 2, 3 y 4).

## 1. Trazabilidad: esferas → objetivos del servicio

El prompt maestro compartido por el equipo describe tres objetivos del
servicio en su sección introductoria. Se transcriben aquí en forma
resumida (paráfrasis, no cita textual) para dejar explícito el cruce con
las esferas ya investigadas:

| Objetivo del servicio | Esferas que más aportan | Instrumentos ya verificados que lo sirven |
|---|---|---|
| **1. Acompañar a familias que atraviesan crisis o dificultades en sus relaciones y dinámicas** | C. Familia, D. Relaciones | McMaster FAD, FACES-20esp, MSPSS, motor de lectura del F1 |
| **2. Potenciar las capacidades de cuidado mutuo de la familia** | C. Familia, E. Crianza y Cuidado, A. Persona | FRAS (resiliencia familiar), FQOL Scale, Alabama Parenting Questionnaire (⚠️ sin traducir), Autoeficacia General |
| **3. Acompañar proyectos de vida y el fortalecimiento de redes de cuidado y convivencia** | F. Redes, M. Proyecto de Vida, B. Intereses y Potencial, G. Bienestar | Motor de lectura del F1, WHO-5, VIA GACS-24/SSS (⚠️ licencia de investigación); M cubierta con [categorías de diseño propio](matriz-variables-indicadores.md#m-proyecto-de-vida) |

Lectura de esta tabla: los objetivos 1 y 2 ya tienen buena cobertura de
instrumentos (esferas A, C, D, F están entre las más completas de la
matriz de Producto 4). El objetivo 3 dependía de la esfera M (Proyecto de
Vida), que originalmente se dejó vacía a la espera de instrumentos
externos en B/H/I. Se resolvió de otra forma: la mayoría de los once
componentes que pide la sección 12 del prompt maestro (intereses,
aptitudes, actitudes, valores, aspiraciones, oportunidades/barreras) no
son constructos que necesiten un instrumento psicométrico validado — son
categorías de autoconocimiento que se exploran con preguntas bien
formuladas, con el mismo principio del motor del F1 (dato → patrón →
hipótesis, nunca puntaje). Esferas M ya tiene banco de preguntas propio de
primer borrador (ver matriz de Producto 4); los tres objetivos quedan con
cobertura de partida.

## 2. Qué es el módulo, en una frase

Un espacio nuevo en la app, independiente del recorrido por las 7 etapas,
donde el equipo de acompañamiento puede **abrir una herramienta de un
ámbito de vida específico** (ej. "Bienestar emocional", "Funcionamiento
familiar", "Red de apoyo"), aplicarla con la familia o persona, y recibir
una lectura del mismo tipo que ya produce el F1: dato → patrón → hipótesis
→ pregunta orientadora — nunca un diagnóstico ni un puntaje clínico.

No reemplaza el F7 (Perfil Socio Familiar) ni ningún otro formato oficial;
lo complementa como caja de herramientas de profundización, disponible en
cualquier momento del acompañamiento.

## 3. Dónde vive en la app actual

Hoy `App.jsx` alterna entre `Home` y `StagePanel` según `activeIndex` sobre
`ETAPAS` (`src/data/etapas.js`), y `Sidebar` lista esas etapas. El nuevo
módulo necesita ser un **tercer modo de navegación**, paralelo a "Inicio" y
a las etapas — no anidado dentro de una etapa, porque el prompt maestro lo
concibe como transversal a todo el servicio:

- `Sidebar`: un ítem nuevo de primer nivel, ej. "Herramientas" o
  "Perfilamiento", separado por el mismo `side-divider` que ya separa
  "Inicio" de las etapas.
- `App.jsx`: un tercer estado de `activeIndex` (ej. `'herramientas'`) que
  renderiza un panel nuevo (`AmbitosPanel`) en vez de `StagePanel`.
- No requiere tocar `etapas.js` ni los formatos F1-F10 existentes: es
  aditivo, no invasivo.

## 4. Estructura de datos: `ambitos.js`

Análogo a `etapas.js` (única fuente de verdad), pero indexado por esfera
en vez de por etapa:

```js
// src/data/ambitos.js
export const AMBITOS = [
  {
    codigo: 'C',
    nombre: 'Familia',
    objetivosServicio: [1, 2],       // referencia a la tabla de la sección 1
    descripcion: '...',
    herramientas: [
      {
        codigo: 'FAD',
        nombre: 'Funcionamiento Familiar (McMaster)',
        estado: 'disponible',        // 'disponible' | 'pendiente'
        componentKey: 'FAD',
        fuente: 'catalogo-instrumentos-psicosociales.md#mcmaster-fad',
      },
      // FRAS, FACES-20esp, FQOL...
    ],
  },
  // A, B, D, E, F, G, H, I, J, K, L, M...
];
```

Misma disciplina que en `etapas.js`: una herramienta sin instrumento
verificado no se inventa — la esfera queda con `herramientas: []` y una
nota, tal como ya lo documenta la matriz de Producto 4 para H, I, K y M.

## 5. El problema que hay que resolver antes de escribir componentes: un motor de lectura genérico

El F1 tiene su propio motor (`lecturaRed.js`) escrito a mano para su
estructura de datos específica (contactos, ámbitos, círculos). Eso
funciona para un instrumento, pero **no escala** a los ~10 instrumentos ya
verificados: casi todos comparten la misma forma (ítems tipo Likert,
agrupados en subescalas, puntaje = suma o promedio, a veces con ítems
invertidos) — ver las fórmulas de puntuación en el catálogo de
instrumentos.

Antes de construir la primera herramienta del módulo conviene extraer un
**motor de lectura genérico** parametrizado por una "definición de
instrumento":

```js
// src/lib/motorInstrumento.js (propuesto)
// Entrada: definición (ítems, subescalas, fórmula, ítems invertidos,
//          rangos de interpretación si existen) + respuestas de la persona.
// Salida: mismo contrato que ya usa PatternCard — nivel, título, evidencia,
//          lectura, preguntas orientadoras — nunca un diagnóstico.
export function leerInstrumento(definicion, respuestas) { /* ... */ }
```

Cada instrumento nuevo se reduce entonces a: (1) una definición de datos
(ítems + subescalas + fórmula, ya documentada en el catálogo) y (2) un
componente de formulario delgado que reutiliza `Field`/`Choice`/
`CheckboxGrid` para capturar respuestas — sin reescribir lógica de lectura
cada vez. Este motor genérico es, en la práctica, el "Producto 6 (reglas
de puntuación) + Producto 7 (reglas de interpretación)" del prompt maestro,
resuelto como una sola pieza reutilizable en vez de una por instrumento.

El motor necesita una segunda variante, **cualitativa**, para las
categorías de diseño propio e híbridas (esferas A, B, C, E, G, H, I, J, K,
L, M — ver el
["formato de pregunta parametrizada"](matriz-variables-indicadores.md#formato-de-pregunta-parametrizada-diseño-propio-e-híbridas)
en la matriz de Producto 4). Es clave que estas preguntas **no se capturan
como texto libre**: cada una usa uno de 5 tipos de respuesta cerrada
(Frecuencia, Presencia, Selección única, Checklist, Numérico), y cada
opción de respuesta ya trae su categoría/indicador asignado en el banco de
preguntas. La entrada del motor cualitativo es entonces tan estructurada
como la de la variante cuantitativa — un objeto `{ pregunta_id: opción
elegida }` — nunca una cadena de texto a interpretar:

**Implementado** en `src/lib/motorInstrumento.js`, junto a la variante
cuantitativa:

```js
// Entrada: definición (preguntas, tipo de respuesta, opciones con su
//          categoría/nivel asociado, reglas de cruce entre categorías) +
//          respuestas cerradas de la persona.
// Salida: mismo contrato que la variante cuantitativa — patrones e
//          hipótesis, nunca un puntaje ni un diagnóstico.
export function leerCategorias(definicion, respuestas) { /* ... */ }
```

Primera herramienta construida con esta variante: Empoderamiento familiar
(esfera C — `data/instrumentos/empoderamientoFamiliar.js`), con 5 reglas
exhaustivas (incluida una regla "mixto" que identifica dinámicamente la
categoría más y menos presente, mismo principio ya usado en los
instrumentos cuantitativos multiescala). Verificado en el navegador sin
errores.

**Implementado**: las notas narrativas opcionales (texto libre que
acompaña a algunas preguntas cerradas, descritas en el diseño original)
ya están cableadas. `definicion.preguntas[i].notaAbierta = true` habilita
un campo de texto libre opcional bajo esa pregunta en
`CategoricoHerramienta.jsx`; se guarda en `respuestas[`${id}_nota`]` y
`leerCategorias` lo expone aparte, en `resultado.notas`, nunca mezclado
con `categorias` — se muestra en un bloque "Notas registradas" bajo el
perfil descriptivo, pero **ninguna regla lo lee ni lo usa para calcular
patrones**: es evidencia cualitativa de apoyo para la conversación, tal
como se diseñó originalmente. Aplicado donde una pregunta cerrada
preguntaba explícitamente "qué/cuál" pero solo registraba Sí/No o una
categoría (Resiliencia individual, Fortalezas por virtud, Exploración
educativa, Exploración cultural, Proyecto de Vida completo — ver
docs/validacion-bancos-preguntas.md).

Esto evita depender de procesamiento de lenguaje natural y mantiene la
promesa del proyecto: el motor no puntúa ni diagnostica, pero sí necesita
datos estructurados para poder generar patrones, hipótesis y, más
adelante, alimentar el motor de
recomendaciones (Producto 9, reglas SI→ENTONCES) — un ejemplo ya
documentado en la matriz: "barrera identificada = Sí **y** oportunidad
identificada = No" activa el patrón "barrera sin contrapeso de
oportunidad".

## 6. Piezas de UI que ya existen y se reutilizan tal cual

`Field`, `Choice`, `CheckboxGrid`, `DataTable`, `Section`, `Callout`,
`FormActions`, `FormatHeader`, `Tooltip` y `PatternCard` — todas en
`src/components/ui/` — ya cubren lo que necesita un formulario tipo Likert
con lectura de patrones al final (es literalmente el patrón que usa el F1
hoy). No se necesita ninguna pieza de UI nueva para la primera fase.

## 7. Fase 1 propuesta (concreta, acotada)

Siguiendo la trazabilidad de la sección 1, la fase 1 debería cubrir el
**objetivo 1 y 2 del servicio**, que son los que ya tienen instrumentos
más sólidos y sin restricciones de licencia bloqueantes:

1. Construir `motorInstrumento.js` (motor genérico, sección 5).
2. Definir `ambitos.js` con las esferas A, C, D, F, G (las de "buena
   cobertura" según el resumen de la matriz de Producto 4).
3. Digitalizar como primeras herramientas — por ser licencia abierta y
   psicometría sólida, sin restricciones pendientes: **WHO-5** (G.
   Bienestar), **FRAS** (C. Familia, resiliencia), **MSPSS** (D/F,
   apoyo social), **Escala de Autoeficacia General** (A. Persona),
   **BFI-2** (A. Persona, rasgos).
4. Dejar fuera de la fase 1, explícitamente: todo lo que tiene licencia
   restringida a investigación (HEXACO, VIA), lo que requiere permiso
   formal (WHOQOL-BREF/OMS), y lo que necesita traducción propia (APQ) —
   se retoman en fase 2 una vez resueltos esos bloqueos.
5. La esfera M (Proyecto de Vida) **sí entra en el alcance temprano**: al
   no depender de licencias ni de instrumentos externos (es banco de
   preguntas propio, motor cualitativo), puede construirse en paralelo a
   la fase 1 en cuanto el equipo psicosocial valide el primer borrador de
   preguntas. Es la pieza que activa directamente el objetivo 3 sin
   esperar a que se resuelvan B (RIASEC), H o I.

## 8. Lo que este módulo todavía no resuelve (dependencias externas)

- **Persistencia**: como ya señala el README (`Próximos pasos de
  arquitectura`), la app no tiene backend. Sin persistencia no hay
  perfil dinámico ni comparación T0/T1/T2 (sección 13 del prompt
  maestro) — las respuestas de cada herramienta se perderían al cerrar
  el formulario, igual que pasa hoy con los formatos F1-F10.
- **Motor de recomendaciones (Producto 9, reglas SI→ENTONCES)**: no se
  aborda en este documento; depende de que existan más lecturas
  implementadas para tener sobre qué recomendar.
- **Integración de perfiles entre esferas** (Producto 8): este documento
  deja cada herramienta leyéndose de forma independiente; consolidar
  varias lecturas en un perfil único de la persona/familia es un paso
  posterior, no bloqueante para la fase 1.

## 9. Resumen de la decisión de alcance

| | Formatos F1-F10 (ya existentes) | Módulo de Perfilamiento (este documento) |
|---|---|---|
| Organización | Por etapa del servicio | Por ámbito/esfera de vida |
| Obligatoriedad | Formatos oficiales de la Guía Operativa | Herramientas de profundización, uso según criterio profesional |
| Objetivo | Documentar el proceso operativo | Servir directamente los 3 objetivos del servicio |
| Estado | 8 de 8 formatos con componente digitalizados | Fase de diseño — ningún componente construido aún |
