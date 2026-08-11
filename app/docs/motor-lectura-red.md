# Motor de Lectura de Red — Mapa de Pertenencia (F1)

**Documento interno de la solución.** Describe el ejercicio que se hizo para
convertir el Mapa de Pertenencia (F1) de un formulario de captura a una
herramienta que además *lee* la red registrada y devuelve fortalezas y
posibles acciones de mejora. No es documentación de usuario final: es el
registro técnico/metodológico para quien mantenga o amplíe el motor.

Código: [`src/lib/lecturaRed.js`](../src/lib/lecturaRed.js) · UI: [`src/components/formats/F1MapaPertenencia.jsx`](../src/components/formats/F1MapaPertenencia.jsx) · glosario: [`src/data/glosarioMapaPertenencia.js`](../src/data/glosarioMapaPertenencia.js)

---

## 1. Origen

El punto de partida fue un prototipo propio del equipo del servicio Presencia
(compartido durante el desarrollo de este panel) que ya proponía la idea
central: leer la red no solo como un dibujo, sino como una fuente de
patrones interpretables. Ese prototipo trabajaba con un modelo de datos más
amplio (metadatos de nodos puente, red potencial ilimitada, etc.) que no
corresponde a lo que el formulario F1 realmente captura hoy. Este motor
retoma su **principio de diseño**, pero se reescribió por completo para
operar sobre los campos reales del formulario y para integrarse con el
resto de componentes reutilizables del proyecto (`DataTable`, `Callout`,
etc.), evitando cargar el formulario con campos que no están sustentados en
el documento fuente del F1.

## 2. Fundamento metodológico

Fuente: `f1.go3_.mt5_.pp_mapa_pertenencia_actual_potencial_v1.docx` (carpeta
`formatos/` del proyecto).

El mapa de pertenencia organiza la red de una persona o familia en:

- **4 ámbitos** de la vida: Familia, Ocupación, Instituciones y
  profesionales, Vida Social.
- **3 círculos de cercanía**, concéntricos: Interior (relaciones íntimas y
  cotidianas), Intermedio (vínculo sin la misma intimidad) y Externo
  (relaciones ocasionales o conocidos).
- **2 lecturas del mismo mapa**: la **actual** (lo que la familia percibe
  hoy) y la **potencial** (lo que quisiera o proyecta).

A esto se sumó un cuarto eje, **tipo de apoyo** (Emocional, Contención,
Práctico, Orientación), tomado de la guía metodológica original del F1 (ya
existía como contenido de referencia antes de este ejercicio), para poder
leer no solo *dónde* está cada vínculo sino *para qué* sirve dentro de la
red.

El glosario con la redacción exacta usada en tooltips y guía está en
`src/data/glosarioMapaPertenencia.js` — es la única fuente de ese texto,
para que la guía plegable, la leyenda y los tooltips del diagrama nunca
queden desincronizados entre sí.

## 3. Principio de diseño: Dato → Patrón → Hipótesis → Pregunta

El motor **no diagnostica**. Seguimos una cadena de cuatro pasos, explícita
en el código y en la interfaz:

1. **Dato**: los vínculos que la familia y el profesional registraron
   (nombre, ámbito, círculo, apoyos).
2. **Patrón**: una condición objetiva y medible sobre esos datos (por
   ejemplo, "solo hay una persona registrada para apoyo emocional").
3. **Hipótesis / lectura**: una frase descriptiva de lo que ese patrón
   *podría* significar — nunca una afirmación clínica o de riesgo.
4. **Pregunta orientadora**: una o dos preguntas para que el profesional
   las lleve a la conversación con la familia, en vez de decidir por ella.

Cada patrón detectado se cierra con una **oportunidad**: qué se podría
explorar o fortalecer a partir de esa lectura. Este encadenamiento es lo
que en la interfaz aparece como las tarjetas de "Lectura del mapa", y es la
razón por la que cada patrón en el código lleva siempre los campos
`evidencia`, `lectura`, `preguntas` y `oportunidad` — omitir alguno rompe la
cadena metodológica, no solo el formato visual.

Todas las lecturas llevan además un aviso fijo (ver
`LecturaDelMapa` en el componente F1): deben validarse conversando con la
familia y con el criterio profesional del Equipo de Acompañamiento. Este
aviso es una decisión de producto deliberada, no un texto legal decorativo.

## 4. Modelo de datos de entrada

Cada fila de la tabla de vínculos (`src/components/formats/F1MapaPertenencia.jsx`)
produce un objeto:

```js
{
  nombre: 'Mamá',
  cuadrante: 'Familia',                 // uno de los 4 ámbitos
  circulo: 'Interior',                  // Interior | Intermedio | Externo
  apoyos: ['Emocional', 'Contención'],  // 0..4 tipos de apoyo
  nota: '',                             // texto libre, no se usa en el motor
}
```

El motor descarta filas sin `nombre` (`contactosValidos` en `lecturaRed.js`)
antes de calcular nada, para que una fila vacía de la tabla no distorsione
las métricas.

## 5. Métricas calculadas

| Métrica | Cómo se calcula | Para qué sirve |
|---|---|---|
| **Diversidad de ámbitos** | # de ámbitos con al menos un vínculo, sobre 4 | Ver si la red se apoya en un solo espacio de vida o en varios |
| **Índice de proximidad** | Suma de (peso del círculo × cantidad), sobre el máximo posible (total × 3); pesos: Interior=3, Intermedio=2, Externo=1 | Qué tan cerca percibe la persona su red, en una escala 0–100 |
| **Concentración por ámbito** | % de vínculos que caen en el ámbito más frecuente; `alta` ≥70%, `media` ≥50%, si no `baja` | Detectar si la red depende casi por completo de un solo espacio |
| **Naturaleza de la red** | % de vínculos en ámbitos `natural` (Familia, Ocupación, Vida Social) vs. `institucional` (Instituciones y profesionales) | Ver el balance entre redes propias y redes institucionales |

Estas cuatro métricas se muestran siempre en el panel "Lectura del mapa"
(cuando hay al menos un vínculo), independientemente de si se detectó algún
patrón.

## 6. Catálogo de patrones

Implementados en `detectarPatrones()` (`src/lib/lecturaRed.js`). El
`nivel` determina el color y la etiqueta de la tarjeta en la interfaz
(`fortaleza` = verde, `oportunidad` = ámbar, `profundizacion` = azul).

| Código | Nivel | Se activa cuando | Lectura |
|---|---|---|---|
| `RED_DIVERSIFICADA` | Fortaleza | ≥3 de los 4 ámbitos tienen al menos un vínculo | La red se apoya en varios espacios de vida, no en uno solo |
| `CONCENTRACION_AMBITO` | Oportunidad | Un ámbito concentra ≥70% de los vínculos | La red depende fuertemente de un único ámbito |
| `BAJA_PROXIMIDAD` | Profundización | ≥3 vínculos en total y ninguno en el círculo Interior | No hay relaciones registradas en el nivel de mayor cercanía |
| `APOYO_CONCENTRADO_<tipo>` | Oportunidad | Exactamente 1 persona brinda ese tipo de apoyo | Ese apoyo depende de un único vínculo; se nombra a la persona |
| `APOYO_DIVERSIFICADO_<tipo>` | Fortaleza | ≥3 personas brindan ese tipo de apoyo | Hay varias personas que pueden sostener ese apoyo |
| `CENTRALIDAD_INSTITUCIONAL` | Profundización | ≥4 vínculos institucionales, o ≥2 en el círculo Interior | La red tiene un peso institucional importante frente a la red natural |
| `NODOS_MULTIFUNCIONALES` | Oportunidad | Al menos una persona tiene ≥2 tipos de apoyo marcados | Algunas personas concentran varias funciones de apoyo a la vez |

Los patrones `APOYO_CONCENTRADO_*` y `APOYO_DIVERSIFICADO_*` se evalúan una
vez por cada uno de los 4 tipos de apoyo, así que en un mismo mapa pueden
aparecer varias tarjetas de este tipo (una por tipo de apoyo que cumpla la
condición).

Los umbrales (70%, ≥3 vínculos, ≥2 apoyos, etc.) son parámetros de diseño,
no cifras normativas del ICBF — están fijados directamente en el código y
son el primer lugar a ajustar si, al usar la herramienta en campo, el
equipo considera que un patrón se activa con demasiada o muy poca
frecuencia.

## 7. Perfil general de la red

`clasificarPerfil()` resume el mapa en una sola frase, mostrada arriba de
las tarjetas de patrones:

- **Sin vínculos** → "Información insuficiente".
- **Proximidad ≥65 y diversidad ≥3 ámbitos** → "Red con fortalezas
  identificables".
- **Proximidad <35 y diversidad ≤2 ámbitos** → "Red para profundizar".
- Cualquier otra combinación → "Red en configuración diversa" (lectura
  neutra: se pide interpretar en conversación, sin forzar una etiqueta
  positiva o negativa cuando los indicadores no son concluyentes).

## 8. Comparación Actual vs. Potencial

`compararActualPotencial()` toma los dos mapas y, ámbito por ámbito,
calcula la diferencia entre lo que hay en el mapa potencial y lo que hay en
el actual. Solo se muestran los ámbitos con diferencia distinta de cero
(`brechas`), y se añade una lectura sobre el crecimiento neto en número de
vínculos entre ambos mapas. Esta sección de la interfaz solo aparece cuando
hay al menos un vínculo válido en cualquiera de los dos mapas
(`hayDatos`).

## 9. Salvaguardas y límites (decisiones deliberadas)

- El motor **no usa la palabra "diagnóstico"** en ningún texto generado.
- Todas las lecturas están redactadas en condicional u orientador
  ("podría", "conviene explorar"), nunca en afirmativo tajante.
- El aviso ético se repite en cada apertura del panel de lectura, no solo
  la primera vez.
- El motor es puramente descriptivo de lo registrado: si el profesional no
  carga datos, no hay patrones — el motor nunca "rellena" con supuestos.
- Los umbrales son conservadores a propósito (por ejemplo, "concentración
  alta" requiere 70%, no una simple mayoría) para evitar activar
  observaciones sobre configuraciones que son razonablemente comunes.

## 10. Cómo extender el motor

Para agregar un nuevo patrón:

1. Añadir la función o el bloque de detección dentro de
   `detectarPatrones()` en `src/lib/lecturaRed.js`.
2. Devolver un objeto con `codigo`, `nivel` (`fortaleza` | `oportunidad` |
   `profundizacion`), `titulo`, `evidencia` (array), `lectura`, `preguntas`
   (array) y `oportunidad`. `PatternCard` (`src/components/ui/PatternCard.jsx`)
   ya sabe renderizar cualquier objeto con esa forma, sin cambios
   adicionales en la interfaz.
3. Si el patrón depende de un campo que el formulario no captura todavía
   (por ejemplo, "nodos puente" del prototipo original, que requería saber
   qué ámbitos conecta cada persona), primero hay que decidir si ese campo
   se agrega al formulario F1 — el motor no debe inventar datos que la
   familia no proporcionó.

## 11. Qué se dejó fuera del prototipo original, y por qué

El prototipo compartido por el equipo incluía conceptos que no se llevaron
a esta versión, para no forzar el modelo de datos del formulario:

- **Nodos puente** (personas que conectarían varios ámbitos): requeriría
  capturar, por vínculo, a qué otros ámbitos se asocia — no está en el F1
  actual.
- **Metadatos libres por nodo** (`metadata` arbitraria): se optó por un
  modelo de datos cerrado y tipado (ámbito/círculo/apoyos de listas fijas)
  para que el motor sea predecible y fácil de mantener.
- **Comparación histórica entre versiones del mapa** (más allá de
  actual/potencial): no hay todavía persistencia de datos en la
  aplicación (ver `README.md`, sección de próximos pasos), así que no hay
  aún "versiones" que comparar en el tiempo.

Si en el futuro el formulario F1 crece para capturar esos campos, el motor
puede extenderse siguiendo el mismo patrón de la sección 10.
