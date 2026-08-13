# Matriz de Variables e Indicadores

**Documento interno de la solución — fase de ideación.** Es el "Producto 4"
de la hoja de ruta del sistema de caracterización y orientación psicosocial
multidimensional: cruza las 13 esferas del prompt maestro (sección 4) con
los instrumentos y teorías ya verificados ([catálogo](catalogo-instrumentos-psicosociales.md)
y [mapa teórico](mapa-teorico-marcos-conceptuales.md)), bajando un nivel más
en la cadena Esfera → Dimensión → Constructo → Variable → Indicador. El
banco de preguntas real (Producto 5) es el siguiente paso, no este
documento.

**Regla seguida en este documento**: cada fila solo existe si se apoya en
(a) un instrumento o marco ya verificado, o (b) una categoría de
exploración de **diseño propio del equipo**, explícitamente marcada como
tal (🆕) y sin pretensión de validez psicométrica — un banco de preguntas
abiertas/guiadas que alimenta el motor de lectura cualitativo (dato →
patrón → hipótesis), no un puntaje. Lo que nunca se hace es inventar
evidencia científica o presentar una categoría propia como si fuera un
instrumento validado. Este segundo camino se usa cuando el ámbito de vida
es real y relevante para el público objetivo del servicio (ver
`servicioInfo.js`) pero no existe, o no es viable conseguir, un
instrumento externo adecuado — el objetivo es cubrir todos los ámbitos de
vida de las familias que acompaña el servicio, no limitarse a replicar
instrumentos de terceros.

**Variante híbrida (instrumentos con licencia restringida o bloqueada):**
cuando sí existe un instrumento verificado pero su licencia no permite el
uso operativo del proyecto (investigación exclusiva, permiso institucional
pendiente, comercial, o acceso bloqueado por muro de pago), se conserva el
**constructo y su estructura de dimensiones** — eso es conocimiento
académico público, no propiedad del instrumento — y se **redactan
preguntas propias** que exploran ese mismo constructo, sin traducir ni
adaptar el texto protegido de los ítems originales. Se marca como 🔀
**Híbrido** para distinguirlo de una esfera que nunca tuvo instrumento de
referencia. Excepción explícita: el MBTI no se hibrida — su problema no es
de licencia sino de validez psicométrica débil (ver
[mapa teórico](mapa-teorico-marcos-conceptuales.md)), y una versión propia
solo reproduciría un modelo ya cuestionado con otras palabras.

El mismo criterio híbrido aplica cuando la duda no es estrictamente legal
sino de **suficiencia de la fuente**: si la única validación disponible es
de una región distinta a la del proyecto, o si no se pudo confirmar el
texto literal exacto de los ítems en el documento revisado, tampoco se
digitaliza tal cual — se conserva el constructo y se redactan ítems
propios, en vez de asumir que una validación de otro país o un texto no
verificado con certeza son intercambiables con el instrumento real.

**Formato de pregunta parametrizada (diseño propio e híbridas):** una
pregunta abierta sin estructura no se puede alimentar a un motor de
reglas — solo sirve para la conversación. Por eso, a partir de esta
versión, **cada pregunta de diseño propio o híbrida se redacta con
respuesta cerrada**, no con texto libre como única fuente de dato, usando
uno de 4 tipos fijos:

| Tipo de respuesta | Opciones | Uso típico |
|---|---|---|
| Frecuencia | Nunca · A veces · Frecuentemente · Siempre | prácticas, hábitos, comportamientos |
| Presencia | Sí · Parcialmente · No | ¿existe X? (meta, barrera, vínculo, identidad) |
| Selección única | 3-6 opciones fijas, definidas por pregunta | caracterización directa (nivel educativo, tipo de vivienda) |
| Checklist | selección múltiple de una lista fija | fortalezas, tipos de interés, valores |
| Numérico | número entero, sin escala | conteos de caracterización directa (personas en el hogar, dependientes económicos) — no se categoriza, se usa tal cual |

Cada opción de respuesta se mapea a una **categoría/indicador descriptivo**
— nunca un puntaje clínico ni una norma poblacional — que es lo que
efectivamente alimenta el motor de lectura cualitativo (dato → patrón →
hipótesis) y, más adelante, las reglas SI→ENTONCES del motor de
recomendaciones (Producto 9). Cada pregunta puede llevar además una **nota
narrativa opcional** de texto libre, pero esa nota es solo insumo
cualitativo para la conversación con el profesional — nunca se usa en la
categorización automática, para no depender de procesamiento de lenguaje
natural. Los bancos de preguntas de las secciones siguientes ya vienen en
este formato.

## A. Persona

| Dimensión | Constructo | Variable | Indicador | Instrumento fuente | Estado |
|---|---|---|---|---|---|
| Autoeficacia | Autoeficacia general (Bandura) | Confianza percibida para manejar situaciones estresantes | Puntaje suma, rango 10-100 | Escala de Autoeficacia General | ✅ Listo (sin cortes clínicos) |
| Autoestima | Autoestima global (Rosenberg) | Valía personal percibida | Puntaje suma, escala de 4 puntos por ítem | Rosenberg Self-Esteem Scale | 🔒 Bloqueado — la única validación en la carpeta es argentina (no colombiana) y no se confirmó el texto literal exacto de los 10 ítems en las páginas revisadas (ver fila híbrida) |
| Autoestima (mismo constructo) | Autoestima global, unidimensional | Valía personal percibida | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🔀 Híbrido: constructo de Rosenberg (1965), preguntas propias | No es un problema de licencia — la escala de Rosenberg es de amplia circulación académica — sino de suficiencia de la fuente disponible; si se consigue una validación colombiana confirmada más adelante, puede reemplazar a este híbrido |
| Rasgos de personalidad | Modelo de los Cinco Grandes | Nivel en Extraversión, Cordialidad, Responsabilidad, Emocionalidad negativa, Apertura | Promedio por dominio y por faceta (15 facetas) | BFI-2 | ✅ Listo, licencia abierta |
| Rasgos de personalidad (extendido) | Modelo HEXACO (6 factores) | Nivel en los 5 anteriores + Honestidad-Humildad | Puntaje por dimensión (fórmula no confirmada en el archivo) | HEXACO-PI-R-60 | 🔒 Bloqueado — licencia solo investigación académica; ítems no se usan (ver fila híbrida) |
| Rasgos de personalidad — valores | Honestidad-Humildad (única aportación de HEXACO que el BFI-2 no cubre) | Sinceridad, equidad, evitación de la avaricia, modestia | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🔀 Híbrido: constructo de Ashton & Lee, preguntas propias | Sustituye a HEXACO-PI-R-60 completo — las otras 5 dimensiones ya las cubre el BFI-2, no se duplican |
| Resiliencia individual | Capacidad de adaptación personal ante la adversidad (distinta de la resiliencia familiar, esfera C) | Percepción de la propia capacidad de recuperación | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🔀 Híbrido: constructo inspirado en CD-RISC (Connor-Davidson), preguntas propias | CD-RISC es comercial (licencia paga); no se usó ningún ítem del instrumento original |
| Afrontamiento | Estrategias de afrontamiento (Carver) | Frecuencia de uso de 14 estrategias | Suma de 2 ítems por subescala | COPE-28 | 🔴 Psicometría débil confirmada por sus propios autores — usar con cautela o descartar |
| Bienestar afectivo | Bienestar subjetivo | Estado anímico de las últimas 2 semanas | Puntaje 0-100 | WHO-5 | ✅ Listo |

**Banco de preguntas propuesto (híbrido, diseño propio):**

| Categoría | Pregunta | Tipo de respuesta | Categoría/indicador resultante |
|---|---|---|---|
| Autoestima | ¿Qué tan satisfecho/a se siente con la persona que es? | Frecuencia | Frecuentemente/Siempre → autovaloración positiva presente · Nunca/A veces → área a fortalecer |
| Autoestima | ¿Qué tanto siente que tiene cualidades de las que puede sentirse orgulloso/a? | Frecuencia | Frecuentemente/Siempre → cualidades propias reconocidas · Nunca/A veces → a explorar |
| Autoestima | ¿Hay momentos en que siente que no vale tanto como otras personas? | Frecuencia (ítem inverso) | Nunca/A veces → sin señal de alerta · Frecuentemente/Siempre → área a explorar con cuidado |
| Autoestima | ¿Cómo describiría el respeto que siente por sí mismo/a? | Selección única: Bajo · Medio · Alto | Cada opción es la categoría directa |
| Honestidad-Humildad | ¿Qué tan importante es para usted ser sincero/a incluso cuando eso lo pone en desventaja? | Frecuencia | Frecuentemente/Siempre → valor presente · Nunca/A veces → a explorar |
| Honestidad-Humildad | ¿Suele evitar aprovecharse de otras personas aunque tenga la oportunidad? | Frecuencia | Frecuentemente/Siempre → rasgo presente · Nunca/A veces → a explorar |
| Honestidad-Humildad | ¿Le incomoda recibir elogios o reconocimientos exagerados? | Presencia | Sí → modestia presente · No → a explorar · Parcialmente → mixto |
| Resiliencia individual | Cuando enfrenta una dificultad grande, ¿qué tanto siente que puede salir adelante con sus propios recursos? | Frecuencia | Frecuentemente/Siempre → recurso interno percibido · Nunca/A veces → a fortalecer |
| Resiliencia individual | ¿Ha logrado recuperarse de situaciones difíciles en el pasado? | Presencia (+ nota narrativa opcional: "¿qué le ayudó?") | Sí → experiencia de recuperación previa · No/Parcialmente → a explorar |
| Resiliencia individual | ¿Se considera una persona que se adapta con relativa facilidad a los cambios? | Presencia | Sí → adaptabilidad percibida presente · No/Parcialmente → a explorar |

## B. Intereses y Potencial

| Dimensión | Constructo | Variable | Indicador | Instrumento fuente | Estado |
|---|---|---|---|---|---|
| Fortalezas de carácter | Taxonomía de Peterson & Seligman (24 fortalezas) | Naturalidad/esfuerzo con que se manifiesta cada fortaleza | Escala de acuerdo de 7 puntos por fortaleza | VIA GACS-24 | 🔒 Bloqueado — licencia solo investigación grupal; ítems no se usan (ver fila híbrida) |
| Fortalezas esenciales (signature) | Idem | Fortalezas más esenciales a la identidad propia | Selección tipo checklist | VIA SSS | 🔒 Bloqueado — mismo motivo |
| Fortalezas de carácter (por virtud) | Taxonomía de Peterson & Seligman — 6 virtudes: Sabiduría, Coraje, Humanidad, Justicia, Templanza, Trascendencia | Fortalezas que la persona reconoce en sí misma, por virtud | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🔀 Híbrido: taxonomía académica pública, preguntas propias | Sustituye a VIA GACS-24/SSS — la taxonomía de 24 fortalezas es de dominio académico, el instrumento de medición es lo restringido |
| Intereses vocacionales (tipológico) | Modelo RIASEC (Holland): Realista, Investigador, Artístico, Social, Emprendedor, Convencional | Afinidad descriptiva con cada uno de los 6 tipos | Presencia (Sí/No) por tipo, sin puntaje comparativo ni código de 3 letras | 🔀 Híbrido: estructura de Holland (pública), preguntas propias | El Self-Directed Search oficial es comercial (PAR Inc.); esta versión no reproduce sus ítems |
| Intereses y preferencias vitales | Exploración cualitativa de intereses (no tipológica) | Actividades, temas o áreas que la persona identifica como significativas | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🆕 Diseño propio del equipo — ver categorías nuevas en esfera M | ✅ Complementa a la versión tipológica de arriba con una mirada más abierta |
| Aptitudes cognitivas (formal) | — | — | — | — | 🔴 Sin instrumento propio validado, pendiente |
| Aptitudes y habilidades percibidas | Autopercepción de capacidades | Habilidades que la persona identifica en sí misma o que su entorno le reconoce | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🆕 Diseño propio del equipo — ver esfera M | ✅ Cubre la exploración inicial; no reemplaza una prueba de aptitudes formal si en algún momento se requiere |

**Banco de preguntas propuesto (híbrido, diseño propio):**

| Categoría | Pregunta | Tipo de respuesta | Categoría/indicador resultante |
|---|---|---|---|
| Fortalezas — Sabiduría | ¿Cuál reconoce más en usted: curiosidad, amor por el aprendizaje, creatividad o perspectiva? | Checklist (selección múltiple de las 4) | Cada fortaleza marcada = categoría "fortaleza reconocida: [nombre]" |
| Fortalezas — Coraje | ¿En qué situación reciente mostró valentía, perseverancia u honestidad? | Presencia (+ nota narrativa opcional con el ejemplo) | Sí → fortaleza de Coraje reconocida · No → sin evidencia reciente |
| Fortalezas — Humanidad | ¿Cómo expresa el cuidado o cariño hacia otras personas? | Selección única: Con acciones concretas · Con palabras/afecto · Ambas · No sabría decir | Cada opción es la categoría directa |
| Fortalezas — Justicia | ¿Qué papel juegan la justicia o el trabajo en equipo en su vida? | Selección única: Central · Presente · Poco presente | Cada opción es la categoría directa |
| Fortalezas — Templanza | ¿Cómo maneja los impulsos o mantiene el equilibrio en momentos difíciles? | Frecuencia ("¿logra mantener el equilibrio?") | Frecuentemente/Siempre → fortaleza presente · Nunca/A veces → a fortalecer |
| Fortalezas — Trascendencia | ¿Tiene algo que le da sentido o esperanza en momentos difíciles? | Presencia (+ nota narrativa opcional) | Sí → fuente de sentido identificada · No → a explorar |
| Intereses — Realista | ¿Disfruta trabajar con las manos, herramientas o al aire libre? | Presencia | Sí → afinidad Realista presente |
| Intereses — Investigador | ¿Le gusta observar, analizar o resolver problemas complejos? | Presencia | Sí → afinidad Investigador presente |
| Intereses — Artístico | ¿Disfruta crear, expresarse o inventar cosas nuevas? | Presencia | Sí → afinidad Artístico presente |
| Intereses — Social | ¿Prefiere actividades donde ayuda, enseña o cuida a otras personas? | Presencia | Sí → afinidad Social presente |
| Intereses — Emprendedor | ¿Le atrae liderar, persuadir o iniciar proyectos? | Presencia | Sí → afinidad Emprendedor presente |
| Intereses — Convencional | ¿Se siente cómodo/a con tareas organizadas o con reglas claras? | Presencia | Sí → afinidad Convencional presente |

Las 6 preguntas de intereses son independientes entre sí (no forzadas a
sumar 100%): el indicador resultante es el conjunto de tipos con "Sí"
marcado, no un código de 3 letras comparativo como el del SDS oficial.

## C. Familia

| Dimensión | Constructo | Variable | Indicador | Instrumento fuente | Estado |
|---|---|---|---|---|---|
| Resolución de Problemas, Comunicación, Roles, Respuesta Afectiva, Involucramiento Afectivo, Control de Conducta, Funcionamiento General | Funcionamiento familiar (modelo McMaster) | Desempeño familiar en cada una de las 7 subescalas | Promedio por subescala | McMaster FAD | ⚠️ Sin puntos de corte ni validación hispana |
| Cohesión, Adaptabilidad | Modelo Circumplejo (Olson), operacionalizado con FACES-II | Cercanía emocional y capacidad de cambio ante el estrés | Media por subescala, con ítems inversos | FACES-20esp | ✅ Decisión tomada: se usa este, no FACES-IV — es el único de los dos con ítems completos, cesión de materiales de Olson y evidencia psicométrica documentada (α .87-.89) |
| Comunicación/resolución, Recursos sociales/económicos, Actitud positiva, Conexión familiar, Espiritualidad, Sentido de la adversidad | Resiliencia familiar (Walsh) | Capacidad de adaptación familiar ante la crisis | Suma por dimensión; total 54-216 | FRAS | 🔒 Bloqueado — el paper de adaptación colombiana no reproduce los 54 ítems completos, solo cargas factoriales (no es problema de licencia, ver fila híbrida) |
| Comunicación/resolución, Recursos sociales/económicos, Actitud positiva, Conexión familiar, Espiritualidad, Sentido de la adversidad (mismas 6 dimensiones) | Idem, en preguntas propias | Presencia de cada recurso de resiliencia | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🔀 Híbrido: modelo de Walsh (dominio académico), preguntas propias | Sustituye al FRAS real — la validación regional en Antioquia que hacía tan fuerte al FRAS aplica al instrumento cuyos ítems no tenemos, no a este híbrido |
| Interacción Familiar, Crianza, Bienestar Emocional, Bienestar Físico/Material, Apoyo por discapacidad | Calidad de vida familiar (Beach Center) | Satisfacción con cada dominio de la vida familiar | Escala de satisfacción 1-5 | FQOL Scale | ✅ Uso educativo autorizado explícitamente |
| Empoderamiento familiar | Percepción de la familia sobre su propia capacidad de gestión y decisión | Confianza para resolver problemas, saber a quién acudir, participar en decisiones | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🔀 Híbrido: constructo inspirado en Family Empowerment Scale, preguntas propias | El instrumento original tiene copyright del Regional Research Institute sin términos de uso libre confirmados; coincide directamente con el objetivo 2 del servicio y con el lenguaje de "empoderamiento" ya usado en `servicioInfo.js` |

**Banco de preguntas propuesto (híbrido, diseño propio) — Empoderamiento
familiar:**

| Pregunta | Tipo de respuesta | Categoría/indicador resultante |
|---|---|---|
| ¿Qué tan capaz se siente su familia de resolver los problemas que se le presentan? | Selección única: Poco capaz · Medianamente capaz · Muy capaz | Cada opción es la categoría directa |
| Cuando su familia necesita algo, ¿sabe a quién acudir o qué pasos seguir? | Presencia | Sí → ruta de gestión identificada · No/Parcialmente → a fortalecer |
| ¿Su familia participa en las decisiones que la afectan, en el hogar o fuera de él? | Frecuencia | Frecuentemente/Siempre → participación presente · Nunca/A veces → a fortalecer |
| ¿Qué tanto siente que su familia puede influir en su propia situación, más allá de depender de otros? | Frecuencia | Frecuentemente/Siempre → agencia percibida presente · Nunca/A veces → a fortalecer |

**Decisión explícita — APGAR Familiar no se hibrida:** el modelo de
Smilkstein (adaptación, compañerismo, crecimiento, afecto, resolución) ya
está cubierto por la combinación de McMaster FAD, FACES-20esp y FRAS, que
juntos exploran esas mismas dimensiones con mejor evidencia psicométrica.
Construir un híbrido adicional sería redundante, no un vacío real — se
deja fuera por esa razón, no por falta de fuente.

## D. Relaciones

| Dimensión | Constructo | Variable | Indicador | Instrumento fuente | Estado |
|---|---|---|---|---|---|
| Familia, Amigos, Otro significativo | Apoyo social percibido (Zimet) | Percepción de disponibilidad de apoyo por fuente | Media por subescala, escala 1-7 | MSPSS | ✅ Listo (sin validación hispana confirmada) |
| Diversidad, proximidad, tipo de apoyo de la red de vínculos | Modelo ecológico aplicado a redes personales | Composición y calidad de la red de pertenencia | Métricas de diversidad/proximidad ya calculadas por el motor de lectura | Motor de lectura del F1 (Mapa de Pertenencia) — ya construido en este proyecto | ✅ Ya implementado — ver [`motor-lectura-red.md`](motor-lectura-red.md) |

## E. Crianza y Cuidado

| Dimensión | Constructo | Variable | Indicador | Instrumento fuente | Estado |
|---|---|---|---|---|---|
| Involucramiento positivo, Supervisión/monitoreo, Disciplina positiva, Consistencia, Castigo físico | Prácticas parentales relacionadas con conducta disruptiva | Frecuencia de cada práctica de crianza | Suma por dimensión (42 ítems) | Alabama Parenting Questionnaire | 🔒 Bloqueado — la licencia exige no modificar la redacción original, así que ni siquiera es viable traducirlo sin autorización (ver fila híbrida) |
| Prácticas de crianza (mismas 5 dimensiones) | Idem, en preguntas propias en español | Frecuencia percibida de cada práctica de crianza | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🔀 Híbrido: dimensiones del APQ (Frick, dominio académico), preguntas propias en español | Resuelve a la vez el bloqueo de licencia y la falta de traducción — no es una traducción del APQ, son preguntas nuevas sobre las mismas 5 dimensiones |

**Banco de preguntas propuesto (híbrido, diseño propio):**

| Dimensión | Pregunta | Tipo de respuesta | Categoría/indicador resultante |
|---|---|---|---|
| Involucramiento positivo | ¿Con qué frecuencia comparte actividades agradables con sus hijos/as —jugar, conversar, elogiarlos? | Frecuencia | Frecuentemente/Siempre → involucramiento presente · Nunca/A veces → a fortalecer |
| Supervisión/monitoreo | ¿Sabe generalmente dónde están y con quién están sus hijos/as cuando no está con ellos? | Frecuencia | Frecuentemente/Siempre → supervisión presente · Nunca/A veces → a fortalecer |
| Disciplina positiva | Cuando su hijo/a se porta mal, ¿qué suele hacer usted? | Selección única: Conversar/explicar · Quitar un privilegio · Ignorar · Gritar o regañar fuerte · Castigo físico | Cada opción es la categoría directa; alimenta también la fila de Castigo físico si aplica |
| Consistencia | ¿Las normas y consecuencias en el hogar se mantienen igual, o cambian según el momento o quién esté presente? | Selección única: Se mantienen igual · Cambian a veces · Cambian frecuentemente | Cada opción es la categoría directa |
| Castigo físico | ¿Ha usado el castigo físico —nalgadas, golpes— como forma de disciplina? | Frecuencia (pregunta sensible: formular con cuidado, sin juicio, y solo si el contexto de la entrevista lo permite) | Nunca → sin uso reportado · A veces/Frecuentemente/Siempre → señal a abordar con el equipo psicosocial, no solo registrar |

## F. Redes

| Dimensión | Constructo | Variable | Indicador | Instrumento fuente | Estado |
|---|---|---|---|---|---|
| Familia, Amigos, Otro significativo | Apoyo social percibido | (mismo que esfera D — el apoyo social es a la vez relacional y de red) | Media por subescala | MSPSS | ✅ Compartido con esfera D |
| Ámbitos, círculos de cercanía, tipo de apoyo | Ecomapa / mapa de pertenencia | Diversidad, concentración y naturaleza de la red (natural vs. institucional) | Métricas del motor F1 (diversidad de ámbitos, índice de proximidad, concentración, naturaleza de la red) | Motor de lectura del F1 | ✅ Ya implementado |

## G. Bienestar

| Dimensión | Constructo | Variable | Indicador | Instrumento fuente | Estado |
|---|---|---|---|---|---|
| Bienestar afectivo | Bienestar subjetivo | Estado anímico reciente | Puntaje 0-100 | WHO-5 | ✅ Compartido con esfera A — candidato al "Perfil General" inicial |
| Físico, Psicológico, Relaciones Sociales, Ambiente | Calidad de vida (modelo genérico, no exclusivo de la OMS) | Satisfacción por dominio de vida | Puntaje 0-100 por dominio | WHOQOL-BREF | 🔒 Bloqueado — "bajo ninguna circunstancia debe usarse sin permiso" según el propio manual (ver fila híbrida) |
| Físico, Psicológico, Relaciones Sociales, Entorno (mismos 4 dominios) | Idem, en preguntas propias | Satisfacción percibida por dominio | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🔀 Híbrido: estructura de dominios de calidad de vida (uso genérico en salud pública), preguntas propias | Sustituye a WHOQOL-BREF mientras no se gestione el permiso de la OMS; si se obtiene el permiso más adelante, puede reemplazarse por el instrumento oficial sin perder la estructura ya construida |

**Banco de preguntas propuesto (híbrido, diseño propio):**

| Dominio | Pregunta | Tipo de respuesta | Categoría/indicador resultante |
|---|---|---|---|
| Físico | ¿Cómo calificaría su salud física en general en las últimas semanas? | Selección única: Mala · Regular · Buena · Muy buena | Cada opción es la categoría directa |
| Psicológico | ¿Qué tan satisfecho/a se siente con su estado de ánimo y su capacidad de disfrutar la vida? | Selección única: Poco satisfecho/a · Medianamente satisfecho/a · Muy satisfecho/a | Cada opción es la categoría directa |
| Relaciones sociales | ¿Qué tan satisfecho/a está con sus relaciones personales? | Selección única: Poco satisfecho/a · Medianamente satisfecho/a · Muy satisfecho/a | Cada opción es la categoría directa |
| Ambiente | ¿Qué tan satisfecho/a está con las condiciones de su entorno —vivienda, seguridad, acceso a servicios? | Selección única: Poco satisfecho/a · Medianamente satisfecho/a · Muy satisfecho/a | Cada opción es la categoría directa |

## H. Educación

| Dimensión | Constructo | Variable | Indicador | Instrumento fuente | Estado |
|---|---|---|---|---|---|
| Trayectoria educativa | Historial escolar | Nivel alcanzado, continuidad o interrupciones y sus razones | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🆕 Diseño propio del equipo | Ver banco de preguntas abajo |
| Motivación y sentido | Valor percibido de la educación | Importancia que la persona/familia atribuye a estudiar o continuar estudiando | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🆕 Diseño propio del equipo | Ídem |
| Barreras de acceso/permanencia | Obstáculos educativos | Dificultades económicas, geográficas, familiares o institucionales para estudiar | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🆕 Diseño propio del equipo | Ídem |

*Nota: se descartó deliberadamente incluir un modelo formal de "estilos de
aprendizaje" — es una de las categorías con evidencia psicométrica más
débil dentro de la psicología educativa, señalado también en el mapa
teórico. Se prioriza trayectoria + motivación + barreras, que sí son
observables sin necesidad de un instrumento validado.*

**Banco de preguntas propuesto (diseño propio):**

| Dimensión | Pregunta | Tipo de respuesta | Categoría/indicador resultante |
|---|---|---|---|
| Trayectoria | ¿Hasta qué nivel educativo llegó usted? | Selección única: Ninguno · Primaria · Secundaria · Técnico/Tecnológico · Universitario · Posgrado | Cada opción es la categoría directa |
| Trayectoria | ¿Le gustaría continuar o retomar estudios? | Presencia | Sí → interés en retomar presente · No → sin interés actual |
| Trayectoria | ¿Qué lo/la llevó a dejar de estudiar, si fue el caso? | Checklist: Económico · Familiar/cuidado · Laboral · Académico · Geográfico/acceso · Otro (+ nota narrativa) | Cada opción marcada = categoría "barrera de continuidad: [tipo]" |
| Motivación | ¿Qué tan importante considera la educación para su proyecto de vida o el de su familia? | Selección única: Poco importante · Importante · Muy importante | Cada opción es la categoría directa |
| Barreras | ¿Qué dificultades ha encontrado —o encuentran sus hijos/as— para estudiar o mantenerse estudiando? | Checklist: Económica · Geográfica/transporte · Cuidado de otros · Institucional · Ninguna | Cada opción marcada = categoría "barrera activa: [tipo]" |
| Barreras | ¿Qué apoyo necesitaría para retomar o continuar su proceso educativo? | Checklist: Económico · Cupo/acceso · Cuidado de otros · Información · Otro (+ nota narrativa) | Cada opción marcada = categoría "necesidad de apoyo: [tipo]" |

## I. Ámbito Ocupacional

| Dimensión | Constructo | Variable | Indicador | Instrumento fuente | Estado |
|---|---|---|---|---|---|
| Trayectoria ocupacional | Historial laboral/ocupacional | Actividades económicas u ocupaciones desempeñadas | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🆕 Diseño propio del equipo | Ver banco de preguntas abajo |
| Situación actual | Estabilidad y satisfacción ocupacional | Condición laboral actual y percepción sobre ella | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🆕 Diseño propio del equipo | Ídem |
| Barreras de acceso | Obstáculos para conseguir o mantener ocupación | Dificultades identificadas (formación, documentación, redes, recursos) | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🆕 Diseño propio del equipo | Ídem |
| Intereses ocupacionales | (comparte categoría con esfera B) | Actividad u oficio que la persona desearía desempeñar | Ver esfera B — Intereses y preferencias vitales | 🆕 Diseño propio del equipo (reutilizado) | ✅ Ya cubierto por B, no se repite banco de preguntas |

*El modelo tipológico formal (RIASEC/Holland) sigue sin instrumento propio
por ser comercial — no bloquea esta esfera porque la exploración de
intereses/trayectoria/barreras no depende de él.*

**Banco de preguntas propuesto (diseño propio):**

| Dimensión | Pregunta | Tipo de respuesta | Categoría/indicador resultante |
|---|---|---|---|
| Trayectoria | ¿En qué ha trabajado o se ha ocupado a lo largo de su vida? | Checklist: Empleo formal · Trabajo informal/independiente · Labores del hogar/cuidado · Sin experiencia laboral · Otro (+ nota narrativa) | Cada opción marcada = categoría "experiencia: [tipo]" |
| Situación actual | ¿Cómo describiría su situación laboral u ocupacional actual? | Selección única: Sin ocupación · Buscando · Ocupación inestable · Ocupación estable | Cada opción es la categoría directa |
| Situación actual | ¿Qué tan satisfecho/a está con su situación laboral u ocupacional actual? | Selección única: Poco satisfecho/a · Medianamente satisfecho/a · Muy satisfecho/a | Cada opción es la categoría directa |
| Barreras | ¿Qué dificultades ha tenido para conseguir o mantener un trabajo o actividad económica? | Checklist: Formación/estudios · Documentación · Cuidado de otros · Transporte/geográfica · Discriminación/edad · Ninguna | Cada opción marcada = categoría "barrera activa: [tipo]" |
| Barreras | ¿Qué necesitaría para acceder a una oportunidad que le interese? | Checklist: Formación · Documentos · Redes/contactos · Recursos económicos · Cuidado de otros · Otro (+ nota narrativa) | Cada opción marcada = categoría "necesidad de apoyo: [tipo]" |

## J. Socioeconómica

| Dimensión | Constructo | Variable | Indicador | Instrumento fuente | Estado |
|---|---|---|---|---|---|
| Ingreso, Educación, Ocupación, Clase social, Género, Etnia | Determinantes estructurales (marco CSDH) | Posición socioeconómica del hogar | No aplica puntaje único — son variables de caracterización directa (nivel de ingreso, años de educación, tipo de ocupación, etc.) | Marco CSDH (Solar & Irwin) | ⚠️ Es un marco conceptual, no un instrumento — hay que diseñar las preguntas específicas, no están hechas |
| Vivienda, condiciones materiales | Circunstancias materiales (determinante intermediario) | Calidad de vivienda, acceso a servicios básicos | Idem — variables de caracterización directa | Marco CSDH | 🆕 Diseño propio del equipo — ver banco de preguntas abajo |

**Banco de preguntas propuesto (diseño propio, sobre el marco CSDH):**

| Dimensión | Pregunta | Tipo de respuesta | Categoría/indicador resultante |
|---|---|---|---|
| Ingreso | ¿Cuál es la principal fuente de ingresos del hogar? | Selección única: Empleo formal · Trabajo informal · Ayuda familiar · Subsidio/ayuda estatal · Sin ingreso fijo | Cada opción es la categoría directa |
| Ingreso | ¿El ingreso del hogar alcanza para cubrir las necesidades básicas del mes? | Selección única: No alcanza · Alcanza justo · Alcanza con holgura | Cada opción es la categoría directa |
| Ingreso | ¿Cuántas personas dependen económicamente de ese ingreso? | Numérico (número entero) | Se usa directo como dato de caracterización, no se categoriza |
| Vivienda | ¿La vivienda donde reside es propia, arrendada, prestada u otra condición? | Selección única: Propia · Arrendada · Prestada/Familiar · Otra | Cada opción es la categoría directa |
| Vivienda | ¿Cuenta con acceso a servicios básicos —agua, energía, saneamiento? | Checklist: Agua · Energía · Saneamiento · Ninguno | Ausencia de alguno = categoría "servicio básico faltante: [tipo]" |
| Vivienda | ¿Cuántas personas habitan la vivienda? | Numérico (número entero) | Se usa directo como dato de caracterización, no se categoriza |

## K. Cultural

| Dimensión | Constructo | Variable | Indicador | Instrumento fuente | Estado |
|---|---|---|---|---|---|
| Identidad y pertenencia cultural | Autorreconocimiento cultural/étnico/territorial | Grupo(s) con los que la persona o familia se identifica | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🆕 Diseño propio del equipo | Ver banco de preguntas abajo |
| Prácticas y tradiciones | Prácticas culturales significativas | Costumbres, tradiciones o prácticas que la familia sostiene o transmite | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🆕 Diseño propio del equipo | Ídem |
| Participación cultural/comunitaria | Espacios de expresión cultural | Participación en actividades o espacios culturales o comunitarios | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🆕 Diseño propio del equipo | Ídem |
| Enfoque diferencial | Experiencias de discriminación o barrera cultural | Situaciones en las que la identidad cultural fue motivo de dificultad | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🆕 Diseño propio del equipo | Ídem |

**Banco de preguntas propuesto (diseño propio):**

| Dimensión | Pregunta | Tipo de respuesta | Categoría/indicador resultante |
|---|---|---|---|
| Identidad | ¿Con qué grupo(s) cultural, étnico o territorial se identifica usted o su familia? | Checklist: Indígena · Afrocolombiano/Negro/Palenquero/Raizal · Rrom/Gitano · Mestizo · Campesino · Otro/Ninguno en particular (+ nota narrativa) | Cada opción marcada = categoría "identidad: [grupo]" |
| Prácticas | ¿Qué costumbres, tradiciones o prácticas culturales son importantes para su familia? | Presencia (+ nota narrativa con el detalle) | Sí → prácticas culturales activas identificadas · No → sin prácticas identificadas |
| Participación | ¿Participa en espacios o actividades culturales o comunitarias? | Frecuencia | Frecuentemente/Siempre → participación activa · Nunca/A veces → baja participación |
| Enfoque diferencial | ¿Ha sentido alguna vez que su identidad cultural ha sido motivo de dificultad o discriminación? | Presencia (pregunta sensible: formular con cuidado) | Sí → experiencia de discriminación reportada, señal a profundizar · No → sin reporte |
| Transmisión | ¿Qué elementos de su cultura o tradición familiar le gustaría transmitir o fortalecer? | Presencia (+ nota narrativa con el detalle) | Sí → interés de transmisión identificado · No → sin interés identificado |

## L. Territorial y Comunitaria

| Dimensión | Constructo | Variable | Indicador | Instrumento fuente | Estado |
|---|---|---|---|---|---|
| Contexto socioeconómico y político | Determinantes contextuales (marco CSDH) | Gobernanza local, políticas sociales, oferta institucional del territorio | No aplica puntaje individual — son variables de caracterización del entorno, no de la persona/familia | Marco CSDH | 🆕 Diseño propio del equipo — ver banco de preguntas abajo |
| Percepción de seguridad y entorno | Seguridad territorial percibida | Percepción de seguridad en el barrio, vereda o territorio | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🆕 Diseño propio del equipo | Ídem |
| Relación con la comunidad | Vínculo comunitario | Calidad percibida de la relación de la familia con su comunidad o vecindario | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🆕 Diseño propio del equipo | Ídem |

**Banco de preguntas propuesto (diseño propio):**

| Dimensión | Pregunta | Tipo de respuesta | Categoría/indicador resultante |
|---|---|---|---|
| Seguridad percibida | ¿Qué tan seguro/a se siente en el barrio o vereda donde vive? | Selección única: Poco seguro/a · Medianamente seguro/a · Muy seguro/a | Cada opción es la categoría directa |
| Oferta institucional | ¿Qué instituciones, programas u organizaciones conoce o ha usado en su territorio? | Checklist: Salud · Educación · ICBF/protección · Organizaciones comunitarias · Ninguna | Ausencia total = categoría "sin oferta institucional identificada" |
| Vínculo comunitario | ¿Cómo describiría la relación de su familia con la comunidad o el vecindario? | Selección única: Distante · Cordial pero poco cercana · Cercana/de apoyo mutuo | Cada opción es la categoría directa |
| Necesidades del territorio | ¿Qué necesidades del territorio afectan directamente a su familia? | Checklist: Movilidad/transporte · Servicios básicos · Seguridad · Oferta institucional · Ninguna | Cada opción marcada = categoría "necesidad territorial: [tipo]" |
| Participación | ¿Participa o le gustaría participar en espacios comunitarios —juntas, redes, organizaciones? | Selección única: Ya participa · Le gustaría participar · No le interesa | Cada opción es la categoría directa |

## M. Proyecto de Vida

La sección 12 del prompt maestro pide integrar once componentes: aptitudes
+ habilidades + intereses + actitudes + valores + fortalezas + aspiraciones
+ recursos + contexto + oportunidades + barreras. Cinco de once ya se
cubren con lo que este proyecto tiene verificado en otras esferas (fila
"✅ Reutilizado" abajo). Los otros seis **no requieren esperar un
instrumento psicométrico externo**: no son constructos que se midan con un
puntaje, son categorías de autoconocimiento que se exploran con preguntas
bien formuladas — el mismo principio que ya usa el motor del F1 (dato →
patrón → hipótesis → pregunta, nunca un puntaje clínico). Por eso esta
esfera deja de estar bloqueada por B/H/I: se diseñan directamente aquí.

**Importante (regla del prompt maestro, sección "no inventar evidencia
científica"):** las seis categorías nuevas no son instrumentos validados ni
tienen normas, puntos de corte o evidencia psicométrica — son preguntas de
exploración cualitativa diseñadas por el equipo. Se marcan explícitamente
como tales (🆕 Diseño propio) y su salida es descriptiva (patrones e
hipótesis a conversar con la persona), igual que el resto del sistema.

| Dimensión | Constructo | Variable | Indicador | Instrumento fuente | Estado |
|---|---|---|---|---|---|
| Fortalezas | Fortalezas de carácter | Fortalezas esenciales a la identidad | Ver esfera B | VIA GACS-24 / SSS | ✅ Reutilizado de esfera B |
| Recursos personales | Autoeficacia | Confianza percibida para lograr metas | Ver esfera A | Escala de Autoeficacia General | ✅ Reutilizado de esfera A |
| Recursos relacionales | Red de apoyo | Disponibilidad de apoyo para sostener el proyecto | Ver esferas D/F | MSPSS + motor de lectura del F1 | ✅ Reutilizado |
| Contexto | Determinantes estructurales y contextuales | Condiciones materiales, oferta institucional del territorio | Ver esferas J/L | Marco CSDH | ⚠️ Marco conceptual, preguntas compartidas con J/L pendientes de diseño |
| Intereses | Intereses y preferencias vitales/vocacionales | Actividades, temas o áreas que la persona identifica como significativas para sí | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🆕 Diseño propio del equipo | Ver banco de preguntas abajo |
| Aptitudes y habilidades | Capacidades reconocidas por la persona y su entorno | Habilidades que la persona identifica en sí misma o que otros le reconocen | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🆕 Diseño propio del equipo | Ídem |
| Actitudes | Disposición hacia el cambio y el futuro | Percepción de agencia sobre el propio proyecto de vida | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🆕 Diseño propio del equipo | Ídem |
| Valores | Prioridades y principios que orientan las decisiones | Valores que la persona identifica como guía de sus decisiones | Respuesta cerrada con categoría asociada, sin puntaje clínico (complementa Honestidad-Humildad de HEXACO, esfera A) | 🆕 Diseño propio del equipo | Ídem |
| Aspiraciones | Metas a mediano/largo plazo | Metas que la persona formula para distintos horizontes de tiempo | Respuesta cerrada con categoría asociada, sin puntaje clínico | 🆕 Diseño propio del equipo | Ídem |
| Oportunidades y barreras | Facilitadores y obstáculos percibidos | Factores externos que la persona percibe como apoyo u obstáculo para su proyecto | Respuesta cerrada con categoría asociada, sin puntaje clínico (dialoga con CSDH, esferas J/L) | 🆕 Diseño propio del equipo | Ídem |

### Banco de preguntas propuesto (diseño propio) para las seis categorías nuevas

Primer borrador, ajustable con el equipo psicosocial antes de digitalizar.
A diferencia de la versión anterior de este documento, cada pregunta ya
viene con respuesta cerrada y categoría asociada — es lo que permite que
el motor de lectura cualitativo detecte patrones automáticamente (ej.
"aspiración sin barrera identificada", no solo texto para leer):

| Categoría | Pregunta | Tipo de respuesta | Categoría/indicador resultante |
|---|---|---|---|
| Intereses | ¿Tiene actividades que disfruta hacer, aunque no le paguen por ellas? | Presencia (+ nota narrativa: ¿cuáles?) | Sí → interés identificado · No → a explorar |
| Intereses | ¿Hay algo que le gustaría aprender o hacer si tuviera el tiempo o los recursos? | Presencia (+ nota narrativa) | Sí → interés latente identificado · No → sin interés latente reportado |
| Intereses | ¿Hacía algo de niño/a o joven que hoy ya no hace y le gustaría retomar? | Presencia (+ nota narrativa) | Sí → interés a recuperar identificado · No → sin dato |
| Aptitudes y habilidades | ¿En qué le dicen las demás personas que usted es bueno/a? | Presencia (+ nota narrativa) | Sí → reconocimiento externo identificado · No → a explorar |
| Aptitudes y habilidades | ¿Sabe hacer algo que le ha servido para resolver situaciones difíciles? | Presencia (+ nota narrativa) | Sí → recurso/habilidad funcional identificado · No → a explorar |
| Aptitudes y habilidades | ¿Hay alguna habilidad que le gustaría fortalecer? | Presencia (+ nota narrativa) | Sí → objetivo de desarrollo identificado · No → sin dato |
| Actitudes | Cuando piensa en su futuro y el de su familia, ¿qué tan posible siente que es mejorar su situación actual? | Selección única: Poco posible · Medianamente posible · Muy posible | Cada opción es la categoría directa |
| Actitudes | ¿Qué tanto siente que las decisiones que toma hoy influyen en cómo estará en unos años? | Selección única: Poco · Medianamente · Mucho | Cada opción es la categoría directa |
| Valores | ¿Qué es lo más importante para usted a la hora de tomar una decisión importante? | Checklist: Familia · Estabilidad económica · Libertad/autonomía · Honestidad · Fe/espiritualidad · Otro (+ nota narrativa) | Cada opción marcada = categoría "valor guía: [tipo]" |
| Valores | ¿Qué le gustaría que las demás personas dijeran de usted? | Presencia (+ nota narrativa) | Sí → autoimagen deseada identificada · No → sin dato |
| Aspiraciones | ¿Tiene una meta o idea de cómo le gustaría que fuera su vida o la de su familia en un año? | Presencia (+ nota narrativa) | Sí → aspiración a corto plazo formulada · No → sin aspiración a corto plazo |
| Aspiraciones | ¿Tiene una meta o idea de cómo le gustaría que fuera su vida o la de su familia en cinco años? | Presencia (+ nota narrativa) | Sí → aspiración a largo plazo formulada · No → sin aspiración a largo plazo |
| Aspiraciones | ¿Hay alguna meta que ha tenido que aplazar? | Presencia (+ nota narrativa: ¿por qué?) | Sí → meta aplazada identificada · No → sin dato |
| Oportunidades y barreras | ¿Identifica cosas de su entorno que le facilitarían avanzar hacia esa meta? | Presencia (+ nota narrativa) | Sí → oportunidad identificada · No → sin oportunidad identificada |
| Oportunidades y barreras | ¿Identifica obstáculos para lograrlo? | Presencia (+ nota narrativa) | Sí → barrera identificada · No → sin barrera identificada |
| Oportunidades y barreras | ¿Ha intentado antes acercarse a esa meta? | Presencia (+ nota narrativa: ¿qué pasó?) | Sí → intento previo identificado · No → sin intento previo |

Con las respuestas de Presencia en formato Sí/No/Parcialmente, el motor
puede cruzar categorías directamente — por ejemplo, "barrera identificada"
= Sí **y** "oportunidad identificada" = No activa el patrón "barrera sin
contrapeso de oportunidad"; "aspiración a corto plazo" = No **y**
"aspiración a largo plazo" = No activa el patrón "proyecto de vida sin
formular todavía". Esto no sería posible si la respuesta fuera solo texto
libre.

Estas preguntas se leen con el mismo motor genérico propuesto en
[`arquitectura-modulo-perfilamiento.md`](arquitectura-modulo-perfilamiento.md#5-el-problema-que-hay-que-resolver-antes-de-escribir-componentes-un-motor-de-lectura-genérico),
pero en su variante cualitativa: en vez de sumar puntajes, detecta
presencia/ausencia de elementos (¿hay aspiración formulada?, ¿hay barrera
identificada sin oportunidad correspondiente?, ¿hay coherencia entre
intereses y aptitudes mencionadas?) para generar patrones e hipótesis,
igual que ya hace `lecturaRed.js` con los vínculos del F1.

## Resumen de cobertura

| Esfera | Instrumentos verificados | Estado general |
|---|---|---|
| A. Persona | 3 con licencia abierta (autoeficacia, BFI-2, WHO-5) + 3 híbridos (autoestima, Honestidad-Humildad, resiliencia individual) | Buena cobertura — sin dependencias de fuente bloqueada o insuficiente |
| B. Intereses y Potencial | 2 híbridos (fortalezas, intereses tipológicos) + 2 categorías de diseño propio | Cobertura completa — RIASEC/VIA quedan sustituidos por versión propia, no solo el formal sigue bloqueado |
| C. Familia | 4 con licencia abierta/verificada + 1 híbrido (empoderamiento familiar) | Muy buena cobertura |
| D. Relaciones | 2 | Buena cobertura |
| E. Crianza y Cuidado | 1 híbrido (sustituye al APQ bloqueado) | Cobertura completa, sin dependencia del APQ |
| F. Redes | 2 (compartidos con D) | Buena cobertura |
| G. Bienestar | 1 con licencia abierta (WHO-5) + 1 híbrido (sustituye a WHOQOL-BREF bloqueado) | Cobertura completa, sin depender del permiso de la OMS |
| H. Educación | 3 categorías de diseño propio | Cubierta con banco de preguntas propio |
| I. Ocupacional | 3 categorías de diseño propio + 1 reutilizada de B | Cubierta con banco de preguntas propio |
| J. Socioeconómica | Marco CSDH + banco de preguntas propio | Cubierta — marco conceptual ahora con preguntas concretas |
| K. Cultural | 4 categorías de diseño propio | Cubierta con banco de preguntas propio |
| L. Territorial/Comunitaria | Marco CSDH + 2 categorías de diseño propio + banco de preguntas | Cubierta — marco conceptual ahora con preguntas concretas |
| M. Proyecto de Vida | 5 reutilizados + 6 categorías de diseño propio (banco de preguntas incluido) | Cobertura completa de las 11 componentes de la sección 12 — 5 con instrumento verificado, 6 con exploración cualitativa propia |

**Las 13 esferas tienen ya al menos un camino de exploración cubierto, y
ninguna depende de un instrumento con licencia bloqueada** para poder
avanzar: HEXACO, VIA, WHOQOL-BREF, APQ, CD-RISC y Family Empowerment Scale
quedan documentados como referencia teórica (🔒 Bloqueado) pero sustituidos
operativamente por una fila 🔀 Híbrido (constructo verificado + preguntas
propias). El único caso deliberadamente no hibridado es el MBTI, por
problema de validez, no de licencia, y el único caso deliberadamente no
duplicado es APGAR Familiar, por ser redundante con cobertura ya existente
en C.

## Próximos pasos sugeridos

1. Validar con el equipo psicosocial los bancos de preguntas de diseño
   propio y los híbridos (A, B, C, E, G, H, I, J, K, L, M) antes de
   digitalizarlos — son un primer borrador, no un producto cerrado. Ya
   vienen parametrizados (respuesta cerrada + categoría/indicador, ver
   ["formato de pregunta parametrizada"](#formato-de-pregunta-parametrizada-diseño-propio-e-híbridas)),
   así que la validación es sobre todo de redacción y de las opciones de
   respuesta, no de la estructura.
2. Si en el futuro se resuelve una licencia hoy bloqueada (permiso de la
   OMS para WHOQOL-BREF, autorización operativa de VIA o HEXACO, compra de
   CD-RISC), el instrumento original puede reemplazar a su híbrido sin
   perder la estructura de dimensiones ya construida — el híbrido no es
   definitivo, es lo que evita quedar bloqueados mientras tanto.
3. Con esta matriz ya se puede empezar el Producto 5 (banco de preguntas)
   para las 13 esferas — instrumentos de licencia abierta, híbridos y
   diseño propio ya traen un primer borrador de preguntas listo para
   revisión antes de digitalizar.
4. Producto 6 (reglas de puntuación) y Producto 7 (reglas de
   interpretación), incluyendo cómo interactúan entre sí las preguntas de
   una misma herramienta, ya arrancaron en
   [`reglas-puntuacion-interpretacion.md`](reglas-puntuacion-interpretacion.md).
