# Validación de Bancos de Preguntas — Guía para el Equipo Psicosocial

**Documento interno de la solución — fase de ideación.** Las 20
herramientas del módulo de Perfilamiento ya están implementadas y
verificadas técnicamente (el código funciona, las reglas disparan
correctamente — ver [reglas-puntuacion-interpretacion.md](reglas-puntuacion-interpretacion.md)).
Lo que falta es una validación de otro tipo, que este documento no
reemplaza: que el **equipo psicosocial** confirme que la redacción, el
orden y la sensibilidad de cada pregunta son apropiados para conversar
con las familias del servicio Presencia. Eso requiere criterio
profesional que no me corresponde suplantar.

Lo que sí hice fue una revisión de calidad de los 13 bancos de preguntas
de diseño propio (esferas A, B, C, E, G, H, I, J, K, L, M) buscando:
redacción poco clara o inductiva, preguntas sensibles sin señalar,
inconsistencias con el diseño original de la matriz, y preguntas
capturadas pero que ningún patrón usa todavía. Los hallazgos ya
corregibles se corrigieron directamente en el código; el resto queda
señalado aquí para que el equipo decida.

## Cómo usar este documento

Cada herramienta tiene: la lista de preguntas tal como están hoy, las
preguntas marcadas **⚠️ sensibles** (requieren cuidado en el momento de
plantearlas, no son un problema de redacción), y una columna de
observación cuando encontré algo que amerita su criterio. Lo que no tiene
observación no significa "ya validado" — significa que no encontré nada
que señalar en la revisión de calidad; sigue pendiente su lectura
profesional.

## Esfera A — Persona

### Autoestima
| # | Pregunta | Tipo |
|---|---|---|
| 1 | En general, ¿qué tan satisfecho/a se siente con la persona que es? | Frecuencia |
| 2 | ¿Qué tanto siente que tiene cualidades de las que puede sentirse orgulloso/a? | Frecuencia |
| 3 | ¿Hay momentos en que siente que no vale tanto como otras personas? | Frecuencia (ítem inverso) |
| 4 | ¿Cómo describiría el respeto que siente por sí mismo/a? | Selección única |

*Sin observaciones de la revisión de calidad.*

### Honestidad-Humildad
| # | Pregunta | Tipo |
|---|---|---|
| 1 | ¿Qué tan importante es para usted ser sincero/a incluso cuando eso lo pone en desventaja? | Frecuencia |
| 2 | ¿Suele evitar aprovecharse de otras personas aunque tenga la oportunidad? | Frecuencia |
| 3 | ¿Le incomoda recibir elogios o reconocimientos exagerados? | Presencia |

*Sin observaciones.*

### Resiliencia individual
| # | Pregunta | Tipo |
|---|---|---|
| 1 | Cuando enfrenta una dificultad grande, ¿qué tanto siente que puede salir adelante con sus propios recursos? | Frecuencia |
| 2 | ¿Ha logrado recuperarse de situaciones difíciles en el pasado? | Presencia |
| 3 | ¿Se considera una persona que se adapta con relativa facilidad a los cambios? | Presencia |

**Resuelto:** las preguntas 2 y 3 ya tienen su nota narrativa opcional
cableada ("¿de qué situación se recuperó, y qué le ayudó?" / "¿puede dar
un ejemplo reciente?"), además de la respuesta cerrada. El texto libre no
entra en el cálculo del patrón — es evidencia de apoyo que queda
registrada en "Notas registradas" bajo el perfil.

## Esfera B — Intereses y Potencial

### Fortalezas de carácter por virtud
6 preguntas, una por virtud (Sabiduría: checklist de 4 opciones; Coraje y
Trascendencia: Presencia; Humanidad y Justicia: Selección única;
Templanza: Frecuencia).

**Observaciones:**
- **Resuelto (decisión del equipo):** la pregunta de "Justicia" se
  separó en dos — una sobre equidad/justicia y otra sobre trabajo en
  equipo, ambas dentro de la misma virtud (se cuenta reconocida si
  cualquiera de las dos lo está). La herramienta pasó de 6 a 7 preguntas.
- **Resuelto:** las preguntas de Coraje y Trascendencia (tipo Presencia,
  que literalmente preguntan "¿en qué situación?" / "¿qué es eso?" pero
  solo registraban Sí/No/Parcialmente) ya tienen nota narrativa opcional
  cableada para capturar la situación o el contenido concreto.

### Intereses vocacionales (tipológico)
6 preguntas Sí/No, una por tipo de Holland (Realista, Investigador,
Artístico, Social, Emprendedor, Convencional).

*Sin observaciones — redacción neutra, sin sesgo hacia ningún tipo.*

## Esfera C — Familia

### Empoderamiento familiar
4 preguntas ya presentadas en una vuelta anterior de validación conjunta.
*Sin observaciones nuevas.*

## Esfera E — Crianza y Cuidado

### Prácticas de crianza
| # | Pregunta | Tipo |
|---|---|---|
| 1 | ¿Con qué frecuencia comparte actividades agradables con sus hijos/as —jugar, conversar, elogiarlos? | Frecuencia |
| 2 | ¿Sabe generalmente dónde están y con quién están sus hijos/as cuando no está con ellos? | Frecuencia |
| 3 | Cuando su hijo/a se porta mal, ¿qué suele hacer usted? | Selección única |
| 4 | ¿Las normas y consecuencias en el hogar se mantienen igual, o cambian según el momento o quién esté presente? | Selección única |
| 5 | ⚠️ ¿Ha usado el castigo físico —nalgadas, golpes— como forma de disciplina? | Frecuencia |

**Resuelto (decisión del equipo):** la pregunta 5 ya muestra un aviso
explícito antes de presentarse ("Esta última pregunta es delicada —
formúlela con calma, sin juicio, y solo si el contexto de la
conversación lo permite"), además de mantenerse al final del formulario.

## Esfera G — Bienestar

### Calidad de vida por dominios
4 preguntas (Físico, Psicológico, Relaciones sociales, Ambiente), todas
Selección única de 3-4 opciones. *Sin observaciones.*

## Esfera H — Educación

| # | Pregunta | Tipo |
|---|---|---|
| 1 | ¿Hasta qué nivel educativo llegó usted? | Selección única |
| 2 | ¿Le gustaría continuar o retomar estudios? | Presencia |
| 3 | ¿Qué lo/la llevó a dejar de estudiar, si fue el caso? | Checklist |
| 4 | ¿Qué tan importante considera la educación para su proyecto de vida o el de su familia? | Selección única |
| 5 | ¿Qué dificultades ha encontrado —o encuentran sus hijos/as— para estudiar o mantenerse estudiando? | Checklist |

**Observaciones:**
- El primer borrador en la matriz de variables incluía una 6ª pregunta
  ("¿qué apoyo necesitaría para retomar sus estudios?") que no se
  implementó en esta vuelta — quedó simplificado a 5 preguntas. Si el
  equipo la considera necesaria, es fácil agregarla.
- La pregunta 3 (checklist) no alimenta ninguna regla de interacción
  todavía — se captura pero no genera un patrón por sí sola. No es un
  error, es una oportunidad para Producto 8 más adelante.
- **Resuelto:** las preguntas 2 ("¿le gustaría continuar o retomar
  estudios?") y 3 (checklist de motivo de dejar) ya tienen nota narrativa
  opcional cableada.
- **Resuelto (decisión del equipo):** se agregó la 6ª pregunta del
  diseño original ("¿qué apoyo necesitaría para retomar o continuar su
  proceso educativo?", checklist con nota narrativa). La herramienta
  pasó de 5 a 6 preguntas y ya no es una simplificación del diseño.

## Esfera I — Ámbito Ocupacional

| # | Pregunta | Tipo |
|---|---|---|
| 1 | ¿En qué ha trabajado o se ha ocupado a lo largo de su vida? | Checklist |
| 2 | ¿Cómo describiría su situación laboral u ocupacional actual? | Selección única |
| 3 | ¿Qué tan satisfecho/a está con su situación laboral u ocupacional actual? | Selección única |
| 4 | ¿Qué dificultades ha tenido para conseguir o mantener un trabajo o actividad económica? | Checklist |

**Observaciones:**
- Igual que en Educación, la pregunta 1 (trayectoria) no alimenta
  ninguna regla todavía — es dato de caracterización directa, sin patrón
  asociado por ahora. El primer borrador también incluía una pregunta de
  "necesidades de apoyo" que no se implementó en esta vuelta.
- **Resuelto:** la pregunta 1 (checklist de trayectoria) ya tiene nota
  narrativa opcional cableada.
- **Resuelto (decisión del equipo):** se agregó la pregunta de "apoyo
  necesario" del diseño original ("¿qué necesitaría para acceder a una
  oportunidad laboral que le interese?", checklist con nota narrativa).
  La herramienta pasó de 4 a 5 preguntas.

## Esfera J — Socioeconómica

| # | Pregunta | Tipo |
|---|---|---|
| 1 | ¿Cuál es la principal fuente de ingresos del hogar? | Selección única |
| 2 | ¿El ingreso del hogar alcanza para cubrir las necesidades básicas del mes? | Selección única |
| 3 | ¿Cuántas personas dependen económicamente de ese ingreso? | Numérico |
| 4 | ¿La vivienda donde reside es propia, arrendada, prestada u otra condición? | Selección única |
| 5 | ¿Cuenta con acceso a servicios básicos —agua, energía, saneamiento? | Checklist |

**Observaciones:**
- Preguntas sobre ingresos y dependientes económicos pueden sentirse
  invasivas si se formulan de forma muy directa al inicio de una
  conversación — el equipo debería confirmar si conviene alguna
  introducción antes de esta herramienta (ej. explicar para qué se usa
  la información).
- Las preguntas 1 y 4 (fuente de ingreso, tipo de vivienda) no alimentan
  ninguna regla de interacción todavía — quedan como caracterización
  directa.

## Esfera K — Cultural

| # | Pregunta | Tipo |
|---|---|---|
| 1 | ¿Con qué grupo(s) cultural, étnico o territorial se identifica usted o su familia? | Checklist |
| 2 | ¿Qué costumbres, tradiciones o prácticas culturales son importantes para su familia? | Presencia |
| 3 | ¿Participa en espacios o actividades culturales o comunitarias? | Frecuencia |
| 4 | ⚠️ ¿Ha sentido alguna vez que su identidad cultural ha sido motivo de dificultad o discriminación? | Presencia |
| 5 | ¿Qué elementos de su cultura o tradición familiar le gustaría transmitir o fortalecer? | Presencia |

**Resuelto (decisión del equipo):** la pregunta 4 ahora muestra el mismo
aviso explícito que castigo_fisico en Crianza, antes de presentarse.

**Resuelto:** las preguntas 1 (checklist de identidad, opción "Otro"), 2
y 5 ("¿qué costumbres...?" / "¿qué elementos...?", que preguntaban "qué"
pero solo registraban Sí/No) ya tienen nota narrativa opcional cableada.
Deliberadamente no se agregó a la pregunta 4 (discriminación) por la
misma razón que a castigo_fisico en Crianza: es más apropiado que ese
detalle se explore de forma verbal y con cuidado, no como campo de texto
a diligenciar.

## Esfera L — Territorial y Comunitaria

5 preguntas (seguridad, oferta institucional, vínculo comunitario,
necesidades del territorio, participación). *Sin observaciones — ninguna
es sensible en el sentido de las anteriores, aunque "seguridad" en
contextos de conflicto o violencia podría requerir el mismo cuidado que
las marcadas ⚠️. Vale la pena que el equipo lo confirme.*

## Esfera M — Proyecto de Vida (16 preguntas, 6 categorías)

Intereses (3), Aptitudes y habilidades (3), Actitudes (2), Valores (2),
Aspiraciones (3), Oportunidades y barreras (3).

**Resuelto:** las 12 preguntas de tipo Presencia y el checklist de
valores ahora tienen su nota narrativa opcional cableada (ej. "¿Identifica
obstáculos para lograrlo?" Sí/No + "¿cuáles obstáculos?"). El texto libre
no entra en el cálculo del patrón — queda como evidencia cualitativa de
apoyo, visible en "Notas registradas" bajo el perfil descriptivo. Sigue
siendo la herramienta más narrativa de las 13, así que vale la pena que
el equipo revise si la redacción de cada campo de nota (ej. "¿Cuál es esa
meta?", "¿Qué intentó?") ayuda o si prefieren otra formulación.

## Próximos pasos sugeridos

1. Revisión del equipo psicosocial, herramienta por herramienta, usando
   este documento como guía — no hace falta revisar el código, solo las
   tablas de preguntas de cada sección.
2. ~~Decidir sobre las preguntas "no implementadas en esta vuelta"~~ —
   **resuelto**: se agregaron ambas (apoyo educativo en H, necesidades de
   apoyo en I).
3. ~~Confirmar el orden y la introducción de las preguntas sensibles~~ —
   **resuelto**: castigo físico (Crianza) y discriminación (Cultural) ya
   muestran un aviso explícito antes de presentarse. Queda pendiente
   evaluar si Seguridad en Territorial necesita el mismo trato — no se
   modificó en esta vuelta.
4. Revisar la redacción de los nuevos campos de nota narrativa opcional
   (ver sección "Notas narrativas opcionales" abajo) — el equipo confirmó
   que la redacción actual ("¿cuáles?", "¿qué es eso?") se siente natural,
   no se cambió.

## Notas narrativas opcionales (nuevo)

A partir de esta revisión, las preguntas cerradas que literalmente
preguntan "qué" o "cuál" pero solo registraban una opción cerrada (Sí/No,
o una categoría de checklist) ahora tienen un campo de texto libre
opcional debajo, para capturar el contenido concreto sin que ese texto
entre en el cálculo del patrón — queda como evidencia de apoyo, visible
en un bloque "Notas registradas" bajo el perfil descriptivo de cada
herramienta. Aplicado en: Resiliencia individual (2 preguntas),
Fortalezas por virtud (Coraje, Trascendencia), Exploración educativa
(3 preguntas, incluida la nueva de apoyo necesario), Exploración cultural
(3 preguntas), Exploración ocupacional (2 preguntas, incluida la nueva de
apoyo necesario) y Proyecto de Vida (13 preguntas — prácticamente toda la
herramienta). Deliberadamente **no** se agregó a preguntas
sensibles (castigo físico, discriminación) para no incentivar registrar
por escrito detalles que es mejor explorar de forma verbal.
