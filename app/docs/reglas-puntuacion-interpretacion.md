# Reglas de Puntuación e Interpretación por Herramienta

**Documento interno de la solución — fase de ideación.** Cubre "Producto 6"
(reglas de puntuación) y "Producto 7" (reglas de interpretación) de la hoja
de ruta, a nivel de **una sola herramienta** — cómo se combinan entre sí
las respuestas de las distintas preguntas de un mismo instrumento para
producir algo más rico que leer cada pregunta por separado. La integración
entre herramientas de distintas esferas (perfil multidimensional completo)
es Producto 8, no este documento.

**Aclaración de lenguaje, no solo de forma:** este sistema **no produce
diagnósticos**. Es la regla más repetida en todo lo construido hasta ahora
— [`motor-lectura-red.md`](motor-lectura-red.md) lo dice explícitamente
para el F1, y el catálogo marca instrumentos como WHO-5 con la advertencia
"es un screening, no una herramienta diagnóstica". Lo que sí se puede
generar, y es lo que cubre este documento, es un **perfil descriptivo**:
una lectura de patrones e hipótesis a conversar con la persona o familia,
con el mismo contrato que ya usa `PatternCard` (nivel, título, evidencia,
lectura, preguntas orientadoras) — nunca una etiqueta clínica, nunca un
punto de corte presentado como validado si no lo está.

**Extensión del contrato — primer paso de Producto 9 (motor de
recomendaciones):** cada patrón puede llevar además dos campos opcionales,
ya implementados en `PatternCard.jsx`:

- `estrategias`: acciones concretas que el equipo puede considerar,
  ancladas en herramientas que **ya existen** en la app (F1, F5, criterios
  de priorización de la Guía Operativa) — nunca una intervención clínica
  inventada ni un protocolo terapéutico.
- `riesgos` (mostrado como "Factores a priorizar"): señales operativas
  para el caso — cuándo priorizar seguimiento o considerar escalar — no
  una evaluación de riesgo clínico ni una probabilidad calculada.

Ambos campos son opcionales por patrón: una fortaleza puede llevar solo
`estrategias` (reconocer y reforzar), y no todos los patrones necesitan
`riesgos`. Ya aplicado a las reglas de WHO-5 y MSPSS (sección 2.1) — las
dos únicas herramientas digitalizadas hasta ahora. Pendiente de extender
al resto conforme se vayan construyendo.

## 1. Dos tipos de herramienta, dos formas de puntuar

### Tipo A — Instrumentos cuantitativos (con fórmula ya verificada)

WHO-5, Autoeficacia General, BFI-2, McMaster FAD, FACES-20esp, FRAS, FQOL,
MSPSS: ya tienen fórmula de puntuación documentada en el
[catálogo](catalogo-instrumentos-psicosociales.md) (suma o promedio por
subescala). Lo que falta es la **regla de nivel por subescala** cuando el
instrumento no trae puntos de corte oficiales (la mayoría no los trae:
McMaster FAD, MSPSS y FRAS lo dicen explícitamente en su ficha técnica) y
la **regla de interacción entre subescalas**.

Cuando no hay corte oficial, se define uno **propio, transparente y no
clínico** — dividir el rango real de la escala en tercios o mitades— y se
marca siempre como tal. Ejemplo con McMaster FAD (Likert 1-4 por ítem,
promedio por subescala):

| Rango del promedio | Categoría descriptiva propia |
|---|---|
| 1.0 – 2.0 | Funcionamiento saludable percibido |
| 2.1 – 3.0 | Área con cierta dificultad |
| 3.1 – 4.0 | Área con dificultad marcada |

*(Corte descriptivo propio del equipo — no corresponde a un punto de corte
clínico validado, porque el instrumento no trae uno.)*

### Tipo B — Instrumentos categóricos (diseño propio / híbridos)

Los ~11 esferas con banco de preguntas parametrizado (ver
[matriz-variables-indicadores.md](matriz-variables-indicadores.md#formato-de-pregunta-parametrizada-diseño-propio-e-híbridas)):
cada pregunta ya devuelve una categoría/indicador (Presente / A explorar /
selección específica), no un número. Aquí la "puntuación" es un **conteo o
cruce de categorías**, no una suma — el mismo principio que ya usa
`lecturaRed.js` para clasificar la red del F1 en "diversificada",
"concentrada", etc. a partir de conteos, no de una suma ponderada.

## 2. Reglas de interacción, herramienta por herramienta

Sumar o promediar las preguntas de un instrumento ya está resuelto (es la
fórmula del catálogo, o el conteo simple). Lo que falta, y es el corazón
de este documento, son las reglas que **cruzan dos o más preguntas o
subescalas del mismo instrumento entre sí** — patrones que no aparecen si
se lee cada una por separado. Se cubren todas las herramientas con banco
de preguntas ya parametrizado; cada una con su propia lógica, no una
plantilla repetida — donde el instrumento tiene una teoría propia detrás
(ej. el modelo curvilíneo de Olson en FACES-20esp) se usa esa teoría, no
un corte inventado.

### 2.1 Instrumentos Tipo A (cuantitativos, con fórmula del catálogo)

#### McMaster FAD (7 subescalas)

Además del nivel individual por subescala (tabla de arriba), se definen
patrones de **interacción entre las 7**:

| Patrón | Regla | Lectura |
|---|---|---|
| Fortaleza consistente | Todas las subescalas en "saludable percibido" | No se identifican áreas de dificultad marcada en las 7 dimensiones evaluadas |
| Dificultad generalizada | ≥5 de 7 subescalas en "dificultad marcada" | El funcionamiento familiar muestra dificultades en la mayoría de las áreas evaluadas, no en un punto aislado |
| Dificultad focalizada | 1-2 subescalas en "dificultad marcada", el resto exactamente en "saludable" | Se identifica un área específica de atención, mientras el resto del funcionamiento se percibe saludable |
| Percepción global discordante | "Funcionamiento General" en "saludable" **pero** ≥2 subescalas específicas en "dificultad marcada" (puede co-ocurrir con las anteriores) | La percepción general no refleja las dificultades específicas identificadas — vale la pena explorar esta diferencia con la familia, no solo reportarla |
| Funcionamiento con niveles mixtos | Exhaustivo: cualquier combinación que no sea "todas saludables" ni "≥5 en dificultad marcada" (ej. una subescala en dificultad marcada y otra en nivel intermedio) | Identifica dinámicamente el área más saludable y la de más dificultad entre las 7 |

El tercer patrón ("percepción global discordante") es el ejemplo más claro
de por qué la interacción importa: leyendo solo la subescala de
"Funcionamiento General" no se vería ningún problema; leyendo solo las
subescalas específicas tampoco se vería la discordancia. Es el cruce el
que genera la hipótesis a conversar. Con "fortaleza consistente" +
"dificultad generalizada" + "niveles mixtos" las 3^7 combinaciones
posibles quedan cubiertas exhaustivamente; los otros 2 patrones son
lecturas adicionales que pueden co-ocurrir con esas 3.

Implementado en `data/instrumentos/mcmasterFad.js`, con los 60 ítems
reales — el PDF de texto que se había identificado como fuente
(`McMaster_FAD_Subscales.pdf`) resultó tener solo 53 de los 60 ítems; los
60 se transcribieron directamente de las imágenes del PDF escaneado
original (`McMaster_FAD.pdf`, sin capa de texto), verificados contra la
numeración e inversión de `FAD.R`. Primer instrumento del proyecto con
ítems invertidos reales — motivó corregir `calcularPuntaje` en
`motorInstrumento.js` para que la inversión funcione en escalas que no
empiezan en 0 (aquí es Likert 1-4, antes solo se había probado con 0-5).

#### WHO-5 (5 ítems, unidimensional)

A diferencia de los demás instrumentos Tipo A, el WHO-5 **sí trae un
corte oficial** en su propio manual (ya citado en el catálogo): puntaje
bruto &lt;13 (de 25) sugiere aplicar un screening de depresión (ICD-10).
Se usa ese corte tal cual, sin inventar uno propio — y se aplica solo como
señal para el profesional, nunca como un screening que el sistema mismo
ejecute o comunique a la persona.

| Patrón | Regla | Lectura |
|---|---|---|
| Bienestar bajo (regla oficial del instrumento) | Puntaje bruto &lt;13/25 | El propio manual del WHO-5 sugiere valorar la pertinencia de un screening adicional — señal para el equipo, no una conclusión |
| Área específica dentro de un total aceptable | Puntaje total ≥13 **pero** 1 de los 5 ítems marcado notablemente más bajo que los otros 4 | El bienestar general no enciende la alerta oficial, pero hay una dimensión específica (ánimo, calma, vitalidad, descanso o interés) que vale la pena explorar aunque el total no lo refleje |
| Bienestar consistente | Los 5 ítems en niveles similares y altos | No se identifican áreas específicas de menor bienestar dentro de las últimas 2 semanas |

#### Autoeficacia General (10 ítems, unidimensional, suma 10-100, sin corte oficial)

| Rango | Categoría descriptiva propia |
|---|---|
| 10 – 40 | Autoeficacia percibida baja |
| 41 – 70 | Autoeficacia percibida moderada |
| 71 – 100 | Autoeficacia percibida alta |

*(Corte propio del equipo, en tercios — el instrumento no trae uno
oficial.)* Al ser unidimensional no hay subescalas que cruzar, pero sí se
agregó una regla de interacción **entre ítems del mismo instrumento**: si
el total cae en moderado/alto pero un ítem puntúa notablemente por debajo
del promedio del resto, se genera un patrón adicional señalando esa área
específica — el mismo principio que "área específica" del WHO-5, aplicado
aquí. La interacción con **otras herramientas** de la esfera A (Autoestima,
Resiliencia individual) sigue siendo candidato para Producto 8
(integración entre esferas), no para este documento.

Implementado en `data/instrumentos/autoeficacia.js`, con los 10 ítems
reales extraídos de la Tabla I del paper fuente.

#### FACES-20esp (Cohesión, Adaptabilidad — modelo circumplejo de Olson)

Este instrumento sí tiene una teoría propia detrás, ya verificada en el
[mapa teórico](mapa-teorico-marcos-conceptuales.md#modelo-circumplejo-de-olson-circumplex-model):
el modelo de Olson es **curvilíneo** — los extremos de cada dimensión son
los que la teoría marca como potencialmente disfuncionales, no los
puntajes bajos por sí solos. El nivel por subescala usa esa lógica, no un
tercio arbitrario:

| Rango (media Likert 1-5) | Categoría (según la teoría del propio modelo) |
|---|---|
| 1.0 – 2.0 | Extremo bajo — Cohesión: "desligada" / Adaptabilidad: "rígida" |
| 2.1 – 3.9 | Rango balanceado |
| 4.0 – 5.0 | Extremo alto — Cohesión: "enmarañada" / Adaptabilidad: "caótica" |

Diseño exhaustivo sobre las 9 combinaciones posibles (bajo/balanceado/alto ×
2 dimensiones), con 3 reglas genéricas — no 9 reglas hardcodeadas — que
identifican dinámicamente cuál dimensión está en qué polo:

| Patrón | Regla | Lectura |
|---|---|---|
| Funcionamiento balanceado | Cohesión **y** Adaptabilidad en rango balanceado (1 combinación) | Ambas dimensiones se ubican en el rango que el modelo de Olson asocia con mayor funcionalidad |
| Extremo aislado | Exactamente una dimensión en extremo, la otra balanceada (4 combinaciones) | Se identifica un extremo en una sola dimensión — vale la pena explorar esa área específica con la familia, no la configuración completa |
| Configuración en las 4 esquinas del circumplejo | Ambas dimensiones en extremo — enmarañada-rígida, desligada-caótica, desligada-rígida o enmarañada-caótica según el caso (4 combinaciones) | Combinación que la tipología de Olson (16 tipos del circumplejo) marca como potencialmente disfuncional; se presenta como hipótesis a conversar, nunca como conclusión — con la cautela explícita de que estas subescalas extremas muestran psicometría más débil en validaciones hispanohablantes |

Implementado en `data/instrumentos/faces20esp.js` con los 20 ítems reales
extraídos del Anexo 1 del paper fuente (no reconstruidos de memoria).

#### FRAS — 🔒 bloqueado, sustituido por híbrido (6 subescalas: Comunicación/resolución, Recursos sociales/económicos, Actitud positiva, Conexión familiar, Espiritualidad, Sentido de la adversidad)

El FRAS real queda documentado como referencia teórica pero no se
digitaliza tal cual: el paper de la adaptación colombiana
(fpsyg-16-1568139.pdf) no reproduce los 54 ítems completos — solo una
tabla de cargas factoriales por número de ítem. No es un bloqueo de
licencia (a diferencia de HEXACO/VIA/WHOQOL-BREF/APQ), es que la fuente
disponible no permite reconstruir el cuestionario real.

**Híbrido implementado** (`data/instrumentos/frasHibrido.js`): conserva
las 6 dimensiones verificadas del modelo de Walsh, con preguntas de
diseño propio (formato Frecuencia: Nunca/A veces/Frecuentemente/Siempre,
0-3) en vez de los ítems reales. 24 preguntas (4 por dimensión), primer
borrador.

| Rango del promedio por ítem (0-3) | Categoría descriptiva propia |
|---|---|
| 0.0 – 1.0 | Recurso de resiliencia poco presente |
| 1.1 – 2.0 | Recurso de resiliencia parcialmente presente |
| 2.1 – 3.0 | Recurso de resiliencia consolidado |

| Patrón | Regla | Lectura |
|---|---|---|
| Resiliencia consolidada | Las 6 dimensiones "consolidadas" | La familia muestra recursos de resiliencia consolidados en las 6 dimensiones del modelo de Walsh |
| A fortalecer | Las 6 dimensiones "poco presentes" | Señal relevante para priorizar el caso |
| Resiliencia interna sin recurso externo | Actitud positiva, Conexión familiar y Sentido de la adversidad "consolidados" **pero** Recursos sociales/económicos "poco presente" (puede co-ocurrir con "mixto") | Fortaleza en los recursos internos de la familia, con una brecha específica en el acceso o uso de redes sociales y económicas — conecta directamente con la esfera Redes y el objetivo 3 del servicio |
| Recurso externo sin activar | Recursos sociales/económicos "consolidado" **pero** Conexión familiar "poco presente" (puede co-ocurrir con "mixto") | La familia tiene acceso a redes de apoyo externas, pero la cohesión interna para movilizarlas parece más débil |
| Dimensiones desiguales (mixto, exhaustivo) | Cualquier combinación que no sea "todas consolidadas" ni "todas poco presentes" | Identifica dinámicamente la dimensión más y menos presente entre las 6 |
| Recurso externo disponible sin activar | Recursos sociales/económicos "consolidado" **pero** Conexión familiar "poco presente" | La familia tiene acceso a redes de apoyo, pero la cohesión interna para movilizarlas juntos como unidad parece más débil |

#### FQOL Scale (5 subescalas: Interacción Familiar, Crianza, Bienestar Emocional, Bienestar Físico/Material, Apoyo por discapacidad)

| Rango (satisfacción Likert 1-5) | Categoría descriptiva propia |
|---|---|
| 1.0 – 2.3 | Satisfacción baja |
| 2.4 – 3.6 | Satisfacción media |
| 3.7 – 5.0 | Satisfacción alta |

| Patrón | Regla | Lectura |
|---|---|---|
| Satisfacción generalizada | Todas las subescalas activas en "alta" | Satisfacción alta en todos los dominios considerados |
| Insatisfacción generalizada | Todas las subescalas activas en "baja" | Señal relevante para priorizar el caso |
| Satisfacción material sin bienestar emocional | Bienestar Físico/Material "alta" **y** Bienestar Emocional "baja" | Contar con recursos materiales no se está traduciendo en bienestar emocional percibido — puede co-ocurrir con "mixto" |
| Calidad de vida con niveles mixtos | Cualquier combinación que no sea "todas alta" ni "todas baja" (exhaustivo, igual que MSPSS) | Identifica dinámicamente cuál subescala activa es la más alta y cuál la más baja |

**Subescala condicional:** "Apoyo por discapacidad" solo se incluye en el
cálculo si la familia confirma tener un integrante con discapacidad — se
resuelve con una pregunta previa en el formulario (`FQOLHerramienta.jsx`)
que filtra dinámicamente qué subescalas entran a `leerInstrumentoMultiescala`,
en vez de forzar un puntaje bajo por una pregunta que no aplica.

Implementado en `data/instrumentos/fqol.js`, con los 25 ítems reales
extraídos del PDF fuente (Beach Center, licencia educativa explícita;
traducción al español propia del equipo).

#### MSPSS (3 subescalas: Familia, Amigos, Otro significativo)

Se usan los rangos orientativos que ya trae el propio catálogo (no
oficiales, pero ya documentados, no inventados aquí): 1-2.9 bajo, 3-5
moderado, 5.1-7 alto.

| Patrón | Regla | Lectura |
|---|---|---|
| Apoyo concentrado | Una subescala "alto" **y** las otras dos "bajo" (aplica a cualquiera de las 3 fuentes, no solo familia) | La red de apoyo percibida depende principalmente de esa fuente — patrón que conecta directamente con las esferas D/F y el motor de lectura del F1 |
| Apoyo diversificado | Las 3 subescalas en "moderado" o "alto" | El apoyo social percibido se distribuye en más de una fuente |
| Vacío de apoyo | Las 3 subescalas en "bajo" | Señal relevante para activar el Mapa de Pertenencia (F1) como herramienta de profundización |
| Apoyo con niveles mixtos | Cualquier combinación que no encaje en las 3 anteriores (ej. una moderada + una alta + una baja) | Identifica dinámicamente cuál fuente se percibe más alta y cuál más baja, sin forzarlo a "vacío" ni a "diversificado" |

**Exhaustividad, no solo casos "interesantes":** las 4 reglas de MSPSS están
diseñadas para que **toda** combinación de niveles (bajo/moderado/alto ×
3 subescalas) caiga en exactamente una de ellas — la regla "mixto" es el
complemento exacto de las otras 3, no un simple resumen genérico. El motor
(`motorInstrumento.js`) además trae una garantía a nivel de sistema: si
ninguna regla de una definición aplicara, genera una lectura de respaldo
en vez de mostrar "sin patrones" en la interfaz — pensado para que un
vacío de diseño en una herramienta futura nunca se note como ausencia de
lectura, aunque el objetivo sigue siendo diseñar reglas exhaustivas por
construcción, como se hizo aquí, no depender del respaldo.

### 2.2 Instrumentos Tipo B (categóricos, diseño propio / híbridos)

#### Empoderamiento familiar (esfera C, 4 preguntas)

Preguntas y categorías, tal como quedaron parametrizadas en la matriz:
`capacidad_percibida` (Poco/Medianamente/Muy capaz), `ruta_gestion`
(Sí/No/Parcialmente sabe a quién acudir), `participacion` (Frecuencia),
`agencia_percibida` (Frecuencia).

| Patrón | Regla | Lectura |
|---|---|---|
| Confianza interna sin ruta externa | `capacidad_percibida` = Muy capaz **y** `ruta_gestion` = No | La familia confía en su propia capacidad de resolver problemas, pero no identifica a quién acudir cuando necesita algo — una fortaleza interna con una brecha de información sobre recursos externos |
| Agencia sin participación activa | `agencia_percibida` = Frecuentemente/Siempre **y** `participacion` = Nunca/A veces | La familia siente que puede influir en su situación, pero reporta baja participación efectiva en las decisiones que la afectan — vale la pena explorar esta diferencia entre percepción y práctica |
| Empoderamiento consolidado | Las 4 categorías en su nivel más alto | Las cuatro dimensiones evaluadas muestran una percepción de empoderamiento familiar sólida |
| Empoderamiento a fortalecer, múltiples dimensiones | Las 4 categorías en su nivel más bajo | Se identifican oportunidades de fortalecimiento en las cuatro dimensiones evaluadas de empoderamiento familiar |
| Dimensiones desiguales (mixto, exhaustivo) | Cualquier combinación que no sea "las 4 en alto" ni "las 4 en bajo" | Identifica dinámicamente la dimensión más y menos presente entre las 4 — agregado al implementar, para que ninguna combinación quede sin lectura específica |

Ninguno de los cinco patrones es un "resultado" o "puntaje total" del
instrumento — son lecturas condicionales, exactamente como las que ya
produce `detectarPatrones()` en `lecturaRed.js`, y todas terminan en una
pregunta orientadora para la conversación con la familia, no en una
etiqueta.

#### Autoestima (esfera A, 4 preguntas: satisfacción general, cualidades reconocidas, ítem inverso, respeto propio)

| Patrón | Regla | Lectura |
|---|---|---|
| Autoestima consolidada | ≥3 de 4 preguntas en categoría positiva | La autopercepción general se muestra positiva en la mayoría de las dimensiones evaluadas |
| Autoestima frágil ante momentos específicos | Satisfacción general y cualidades reconocidas positivas, **pero** el ítem inverso ("momentos de sentirse menos que otros") en Frecuentemente/Siempre | La autoimagen general es positiva, pero hay momentos específicos de mayor vulnerabilidad — matiz que un promedio simple de las 4 preguntas no mostraría |
| A fortalecer | Mayoría de las 4 preguntas en categoría negativa | Se identifican oportunidades de fortalecimiento en la autopercepción |

#### Honestidad-Humildad (esfera A, 3 preguntas)

| Patrón | Regla | Lectura |
|---|---|---|
| Rasgo consistente | Las 3 preguntas en categoría "presente" | El rasgo se manifiesta de forma consistente en las situaciones exploradas |
| Equidad sin asertividad | "Evitar aprovecharse de otros" presente **pero** "sinceridad aunque ponga en desventaja" ausente | Se cuida de no perjudicar a otros, pero le cuesta ser sincero/a cuando eso lo/la pone en desventaja a sí mismo/a — matiz para la conversación, no una contradicción a resolver |

#### Resiliencia individual (esfera A, 3 preguntas)

| Patrón | Regla | Lectura |
|---|---|---|
| Resiliencia consolidada con historia | "Puede salir adelante con recursos propios" presente **y** "experiencia de recuperación previa" = Sí **y** "se adapta con facilidad" = Sí | La percepción de capacidad de recuperación está respaldada por experiencia previa concreta |
| Confianza sin historia consolidada | "Puede salir adelante" presente **pero** "experiencia de recuperación previa" = No | Hay una percepción optimista de la propia capacidad que no está necesariamente respaldada por una experiencia previa identificada — no es positivo ni negativo por sí mismo, es un matiz a explorar en la conversación |

#### Fortalezas de carácter por virtud (esfera B, 6 virtudes / 7 preguntas)

La virtud Justicia se explora con **dos** preguntas (equidad/justicia y
trabajo en equipo) en vez de una combinada — son dos fortalezas
distintas dentro de esa virtud en la taxonomía original. La virtud
cuenta como reconocida si cualquiera de las dos lo está; en la evidencia
de los patrones aparece una sola vez ("Justicia"), no duplicada.

| Patrón | Regla | Lectura |
|---|---|---|
| Perfil de fortalezas amplio | ≥4 de 6 virtudes con fortaleza reconocida | La persona reconoce fortalezas propias distribuidas en la mayoría de las 6 virtudes de la taxonomía |
| Fortalezas focalizadas | 1-3 virtudes con fortaleza reconocida, el resto sin evidencia | Las fortalezas reconocidas se concentran en un área específica — insumo directo para el futuro motor de recomendaciones (Producto 9), que podría orientar hacia actividades afines a esa virtud |
| Sin fortalezas reconocidas | Ninguna virtud con evidencia positiva | No se debe asumir ausencia real de fortalezas — es más probable que las preguntas no hayan logrado capturarlas; señal para profundizar en conversación abierta, no una conclusión sobre la persona |

#### Intereses vocacionales tipológico — inspirado en RIASEC (esfera B, 6 preguntas Sí/No independientes)

| Patrón | Regla | Lectura |
|---|---|---|
| Perfil combinado | 2-3 tipos con "Sí" | Combinación de afinidades descriptivas (ej. Social + Artístico: interés en actividades de ayuda con componente creativo) — se presenta como perfil descriptivo, explícitamente distinto del código de 3 letras del SDS oficial, que este proyecto no reproduce |
| Sin afinidad identificada | Los 6 tipos en "No" | Señal de que las preguntas cerradas no capturaron el interés — se recomienda complementar con la categoría abierta "Intereses y preferencias vitales" (también en esfera B) en vez de asumir ausencia de interés |

#### Prácticas de crianza (esfera E, 5 preguntas)

| Patrón | Regla | Lectura |
|---|---|---|
| Crianza positiva consolidada | Involucramiento, Supervisión y Disciplina positiva presentes, Consistencia alta, Castigo físico "Nunca" | Las 5 dimensiones evaluadas muestran un patrón de crianza consistente y sin uso de castigo físico |
| Supervisión sin involucramiento | Supervisión presente **pero** Involucramiento positivo ausente | Hay control/monitoreo de los hijos/as sin que se reporte el mismo nivel de conexión afectiva cotidiana — matiz relevante que ninguna de las dos preguntas muestra por separado |
| Alerta de castigo físico | Castigo físico en "A veces/Frecuentemente/Siempre" | Se marca como señal a abordar directamente con el equipo psicosocial **independientemente** de cómo puntúen las otras 4 dimensiones — no se "compensa" con buen desempeño en las demás |

La pregunta de castigo físico muestra un aviso ("pregunta delicada,
formule con calma") antes de presentarse — mismo tratamiento aplicado a
la pregunta de discriminación en Exploración cultural.

#### Calidad de vida por dominios (esfera G, 4 dominios)

| Patrón | Regla | Lectura |
|---|---|---|
| Bienestar material sin bienestar relacional | Físico y/o Ambiente "muy satisfecho/a" **pero** Relaciones sociales "poco satisfecho/a" | Las condiciones materiales no se traducen necesariamente en satisfacción relacional |
| Discordancia con el estado anímico reciente | WHO-5 (esfera A/G, estado de las últimas 2 semanas) bajo **pero** dominio Psicológico de este instrumento "muy satisfecho/a" | Posible diferencia entre el estado anímico reciente y la percepción general de satisfacción con la vida — útil para el profesional, candidato también a Producto 8 (cruce entre dos herramientas distintas) |

#### Exploración educativa (esfera H, 6 preguntas)

Se agregó la 6ª pregunta del diseño original ("¿qué apoyo necesitaría
para retomar o continuar su proceso educativo?", checklist) — cuando hay
barrera activa, la estrategia sugerida nombra el apoyo concreto
solicitado en vez de un texto genérico.

| Patrón | Regla | Lectura |
|---|---|---|
| Interés con barrera activa | "Le gustaría continuar/retomar estudios" = Sí **y** al menos una barrera marcada en el checklist | Hay interés educativo identificado junto con obstáculos concretos; si además se marcó apoyo necesario, la estrategia lo nombra directamente |
| Incongruencia a explorar | "Le gustaría continuar" = Sí **pero** "importancia de la educación" = Poco importante | Combinación que vale la pena conversar, no resolver automáticamente — puede reflejar ambivalencia real, no un error de captura |

#### Exploración ocupacional (esfera I, 5 preguntas)

Se agregó la pregunta de apoyo necesario del diseño original ("¿qué
necesitaría para acceder a una oportunidad laboral que le interese?",
checklist), con el mismo tratamiento que en Exploración educativa.

| Patrón | Regla | Lectura |
|---|---|---|
| Barrera múltiple de acceso | Situación actual = Sin ocupación/Buscando **y** ≥2 barreras marcadas | Se identifican varias barreras simultáneas para el acceso ocupacional; si además se marcó apoyo necesario, la estrategia lo nombra directamente |
| Estabilidad sin satisfacción | Situación actual = Ocupación estable **pero** satisfacción = Poco satisfecho/a | Tener una ocupación estable no implica satisfacción con ella — matiz que la sola pregunta de "situación actual" no capturaría |

#### Caracterización socioeconómica (esfera J)

| Patrón | Regla | Lectura |
|---|---|---|
| Vulnerabilidad material compuesta | Ingreso = "No alcanza" **y** al menos un servicio básico marcado como faltante | La combinación de ambos indicadores describe una situación más específica que cualquiera de los dos por separado |
| Ingreso a contextualizar | Ingreso = "Alcanza con holgura" **pero** número de dependientes económicos alto | El nivel de ingreso reportado se lee junto con cuántas personas dependen de él, no de forma aislada |

#### Exploración cultural e identitaria (esfera K)

| Patrón | Regla | Lectura |
|---|---|---|
| Identidad con experiencia de barrera | Identidad cultural/étnica marcada **y** experiencia de discriminación = Sí | Relevante para el enfoque diferencial del servicio; conecta con las esferas J y L |
| Continuidad cultural activa | Prácticas culturales presentes **y** interés en transmitirlas presente | Se identifica una transmisión cultural activa dentro de la familia, no solo prácticas aisladas |

#### Exploración territorial y comunitaria (esfera L)

| Patrón | Regla | Lectura |
|---|---|---|
| Aislamiento territorial compuesto | Seguridad percibida = "Poco seguro/a" **y** vínculo comunitario = "Distante" | Ni el entorno se percibe seguro ni hay tejido comunitario de apoyo cercano — relevante directamente para el objetivo 3 del servicio (redes de cuidado) |
| Participación pese a barreras | Necesidades territoriales múltiples marcadas **pero** "ya participa" en espacios comunitarios | Se identifica una fortaleza de participación activa a pesar de las barreras estructurales del territorio — vale la pena reconocerla explícitamente, no solo registrar las barreras |

#### Proyecto de vida (esfera M)

Ya documentado con ejemplos completos directamente en
[matriz-variables-indicadores.md](matriz-variables-indicadores.md#banco-de-preguntas-propuesto-diseño-propio-para-las-seis-categorías-nuevas)
("barrera identificada sin oportunidad correspondiente", "proyecto de vida
sin formular todavía") — no se repite aquí para no duplicar contenido.

#### BFI-2 — Cinco Grandes (esfera A, Tipo A, 5 dominios/60 ítems)

Instrumento real, no híbrido — ítems y clave de corrección extraídos
directamente de `instrumentos/BFI2_Spanish.pdf` (licencia de código
abierto, ver catálogo). Se puntúa a nivel de dominio (no de las 15
facetas). Los 5 dominios tienen valencias distintas — Emocionalidad
negativa alta no es "lo opuesto" de una fortaleza de la misma forma que
Apertura baja — así que, a diferencia de los demás instrumentos
multiescala, el catch-all exhaustivo es un `reglaResumen` neutral (solo
presenta los 5 puntajes, sin calificar ninguno de positivo o negativo)
en vez de una regla "mixta" que compare niveles entre dominios.

| Patrón | Regla | Lectura |
|---|---|---|
| Perfil resiliente y sociable | Extraversión alta **y** Emocionalidad negativa baja | Alta disposición a la interacción social con baja tendencia a la ansiedad o el desánimo — recurso directo frente a crisis o cambio |
| Perfil confiable y prosocial | Responsabilidad alta **y** Cordialidad alta | Organización y constancia junto con comprensión y generosidad hacia los demás |
| Vulnerabilidad emocional con baja organización | Emocionalidad negativa alta **y** Responsabilidad baja | Puede dificultar sostener rutinas o planes durante una crisis — hipótesis a conversar, no conclusión clínica |
| Apertura a nuevas experiencias | Apertura de mente alta | Recurso a considerar al proponer alternativas o rutas de acción |

#### Intereses y preferencias vitales (esfera B, Tipo B, 3 preguntas)

Complementa RIASEC (tipológico, 6 categorías fijas) con una mirada
abierta por áreas temáticas. Exhaustivo sobre 4 ramas: sin intereses
identificados / intereses poco practicados / activos y compartidos /
activos pero individuales.

| Patrón | Regla | Lectura |
|---|---|---|
| Sin áreas de interés identificadas | Checklist de áreas = solo "Ninguno" | No implica ausencia real; las categorías propuestas pueden no haberlo capturado |
| Intereses activos y compartidos | ≥1 área marcada **y** práctica alta **y** los comparte | Recurso directo, personal y de red social |
| Intereses latentes | ≥1 área marcada **pero** práctica baja | Reconocidos pero sin espacio activo en la vida cotidiana |
| Intereses activos, individuales | ≥1 área marcada **y** práctica alta **pero** no los comparte | Punto de partida para tejer nuevas conexiones sociales |

#### Aptitudes y habilidades percibidas (esfera B, Tipo B, 4 preguntas)

Explora dominios de habilidad (manuales, comunicación, organización,
etc.), distinto de Fortalezas por virtud (rasgos de carácter) y de las
preguntas de "Aptitudes" en Proyecto de Vida (presencia pura, sin
categorizar el área). Exhaustivo sobre 4 ramas: sin habilidades
identificadas / sin reconocimiento externo / reconocidas sin uso ante
dificultades / funcionales y reconocidas.

| Patrón | Regla | Lectura |
|---|---|---|
| Sin habilidades identificadas | Checklist de áreas = solo "Ninguna" | No implica ausencia real de habilidades |
| Habilidades funcionales y reconocidas | ≥1 área marcada **y** reconocidas por el entorno **y** usadas ante dificultades | Recurso verificado en la práctica, no solo potencial |
| Habilidades sin reconocimiento externo | ≥1 área marcada **pero** no reconocidas por el entorno | Vale explorar si es diferencia real de percepción o falta de oportunidad de mostrarlas |
| Habilidades reconocidas sin uso claro | ≥1 área marcada **y** reconocidas por el entorno **pero** no usadas —o solo parcialmente— ante dificultades | Capacidad disponible que todavía no se ha puesto a prueba en ese sentido |

## 3. Esquema general (la lógica detrás de cada ficha de la sección 2)

Cada herramienta, cuando se digitalice, necesita responder estas 4
preguntas — es la plantilla que generalizan las fichas de la sección 2,
sin que ninguna se haya rellenado mecánicamente: cada tabla de niveles y
cada patrón de interacción sale de lo que ese instrumento específico mide
y de la teoría que lo respalda (ver mapa teórico), no de copiar la
estructura de otro instrumento:

1. **¿Cómo se puntúa cada pregunta o subescala individualmente?** (ya
   resuelto: fórmula del catálogo para Tipo A, categoría del banco de
   preguntas para Tipo B)
2. **¿Hay puntos de corte oficiales?** Si sí, usarlos y citar la fuente.
   Si no, definir un corte descriptivo propio y marcarlo explícitamente
   como no clínico (tabla de tercios/mitades, igual que el ejemplo de
   McMaster FAD).
3. **¿Qué combinaciones de 2+ preguntas o subescalas del mismo instrumento
   generan un patrón que ninguna de ellas muestra por separado?** — esta
   es la pregunta que estaba sin resolver antes de este documento.
4. **¿Qué pregunta orientadora acompaña cada patrón?** Nunca se cierra en
   una afirmación; siempre se deja una pregunta para conversar con la
   persona o familia (mismo principio del F1).

## 4. Estado de cobertura

| Herramienta | Tipo | Reglas de interacción definidas | Implementada en código |
|---|---|---|---|
| WHO-5 | A | ✅ Completo (sección 2.1) — usa el corte oficial del propio manual | ✅ `data/instrumentos/who5.js` + `herramientas/WHO5Herramienta.jsx` |
| BFI-2 (Cinco Grandes) | A | ✅ Completo — 4 reglas + `reglaResumen` neutral como catch-all exhaustivo (valencias distintas por dominio) | ✅ `data/instrumentos/bfi2.js` + `herramientas/BFI2Herramienta.jsx` — 60 ítems reales extraídos del PDF fuente, licencia de código abierto |
| MSPSS | A | ✅ Completo (sección 2.1) — usa los rangos orientativos ya documentados en el catálogo | ✅ `data/instrumentos/mspss.js` + `herramientas/MSPSSHerramienta.jsx` |
| FACES-20esp | A | ✅ Completo (sección 2.1) — usa la lógica curvilínea del propio modelo de Olson, no un corte inventado; exhaustivo sobre las 9 combinaciones posibles (balanceado, 4 extremos aislados, 4 esquinas del circumplejo) | ✅ `data/instrumentos/faces20esp.js` + `herramientas/FACES20espHerramienta.jsx` — ítems reales extraídos del anexo del paper fuente |
| Autoeficacia General | A | ✅ Completo (sección 2.1) — unidimensional; se agregó además una regla de ítem divergente dentro del propio instrumento (no solo cruce entre esferas) | ✅ `data/instrumentos/autoeficacia.js` + `herramientas/AutoeficaciaHerramienta.jsx` — ítems reales extraídos de la Tabla I del paper fuente |
| FRAS (real) | A | — | 🔒 Bloqueado — fuente incompleta (no un problema de licencia), ver fila híbrida |
| FRAS (híbrido) | A | ✅ Completo (sección 2.1) — mismo modelo de 6 dimensiones de Walsh, 5 reglas exhaustivas | ✅ `data/instrumentos/frasHibrido.js` + `herramientas/FRASHibridoHerramienta.jsx` — preguntas de diseño propio, no ítems del FRAS original |
| FQOL Scale | A | ✅ Completo (sección 2.1) — regla exhaustiva "mixto" + subescala condicional (Apoyo por discapacidad, solo si aplica a la familia) | ✅ `data/instrumentos/fqol.js` + `herramientas/FQOLHerramienta.jsx` — ítems reales extraídos del PDF fuente, traducción propia |
| McMaster FAD | A | ✅ Completo (sección 2.1) — 5 reglas exhaustivas (fortaleza consistente / dificultad generalizada / focalizada / percepción discordante / mixto) | ✅ `data/instrumentos/mcmasterFad.js` + `herramientas/McMasterFADHerramienta.jsx` — 60 ítems reales transcritos del PDF escaneado (imagen, no texto); primer instrumento con ítems invertidos reales, motivó corregir `calcularPuntaje` para escalas 1-4 |
| Empoderamiento familiar (esfera C) | B | ✅ Completo (sección 2.2) — se agregó la regla "mixto" para exhaustividad, más allá de los 4 patrones originales | ✅ `data/instrumentos/empoderamientoFamiliar.js` + `herramientas/EmpoderamientoFamiliarHerramienta.jsx` — primera herramienta con el motor cualitativo (`leerCategorias`) |
| Autoestima (esfera A) | B | ✅ Completo (sección 2.2) + regla "mixta" exhaustiva | ✅ `data/instrumentos/autoestima.js` |
| Honestidad-Humildad (esfera A) | B | ✅ Completo + regla "mixta" exhaustiva | ✅ `data/instrumentos/honestidadHumildad.js` |
| Resiliencia individual (esfera A) | B | ✅ Completo + regla "mixta" exhaustiva | ✅ `data/instrumentos/resilienciaIndividual.js` |
| Fortalezas por virtud (esfera B) | B | ✅ Completo — primera con tipo `checklist`; Justicia se separó en 2 preguntas (equidad + trabajo en equipo) tras validación del equipo | ✅ `data/instrumentos/fortalezasPorVirtud.js` |
| Intereses tipológico (esfera B) | B | ✅ Completo, exhaustivo (0/1/2-3/4-6 afinidades) | ✅ `data/instrumentos/interesesTipologicos.js` |
| Intereses y preferencias vitales (esfera B) | B | ✅ Completo, exhaustivo (4 ramas) | ✅ `data/instrumentos/interesesPreferenciasVitales.js` |
| Aptitudes y habilidades percibidas (esfera B) | B | ✅ Completo, exhaustivo (4 ramas) | ✅ `data/instrumentos/aptitudesHabilidades.js` |
| Prácticas de crianza (esfera E) | B | ✅ Completo — incluye la regla de alerta de Castigo físico, independiente de las otras 4 | ✅ `data/instrumentos/practicasCrianza.js` |
| Calidad de vida por dominios (esfera G) | B | ✅ Completo, exhaustivo | ✅ `data/instrumentos/calidadVidaDominios.js` |
| Exploración educativa (esfera H) | B | ✅ Completo, exhaustivo dentro de la rama "le gustaría continuar" | ✅ `data/instrumentos/exploracionEducativa.js` |
| Exploración ocupacional (esfera I) | B | ✅ Completo | ✅ `data/instrumentos/exploracionOcupacional.js` |
| Caracterización socioeconómica (esfera J) | B | ✅ Completo — primera con tipo `numerico` | ✅ `data/instrumentos/caracterizacionSocioeconomica.js` |
| Exploración cultural (esfera K) | B | ✅ Completo | ✅ `data/instrumentos/exploracionCultural.js` |
| Exploración territorial (esfera L) | B | ✅ Completo | ✅ `data/instrumentos/exploracionTerritorial.js` |
| Proyecto de vida (esfera M) | B | ✅ Completo — incluye las 2 reglas de cruce ya documentadas ("barrera sin oportunidad", "proyecto sin formular") + 3 adicionales | ✅ `data/instrumentos/proyectoDeVida.js` — la más grande (16 preguntas, 6 categorías) |

**Las 24 herramientas (8 Tipo A + 16 Tipo B) están completamente
implementadas y verificadas en el navegador**, no solo documentadas. Cada
una fue construida con `CategoricoHerramienta.jsx` (componente genérico
compartido para el motor cualitativo) o su equivalente Tipo A, siguiendo
el mismo estándar de exhaustividad y verificación establecido desde
WHO-5. Ninguna quedó resuelta con una plantilla genérica: cada tabla de
niveles usa la fórmula o la teoría propia del instrumento cuando existe
(WHO-5, FACES-20esp, MSPSS), y cada patrón de interacción está redactado
sobre las preguntas reales de esa herramienta, no sobre una estructura
copiada de otra.

## 5. Próximos pasos sugeridos

1. Validar con el equipo psicosocial que los cortes descriptivos propios
   (tercios/mitades) y los patrones de interacción propuestos en la
   sección 2 tienen sentido clínico antes de digitalizarlos — siguen
   siendo un primer borrador, igual que el banco de preguntas.
2. Decidir, herramienta por herramienta, si algún patrón de interacción
   necesita ajustarse una vez el equipo pruebe las preguntas reales con
   familias (algunos umbrales, como "≥5 de 7 subescalas", son supuestos
   de partida, no cifras validadas).
3. Ahora que cada herramienta tiene su propio perfil descriptivo, Producto
   8 (integración multidimensional) puede empezar a cruzar patrones
   **entre** esferas distintas (ej. "barrera identificada en Proyecto de
   Vida" + "baja
   participación en Empoderamiento familiar"), no solo dentro de una
   misma herramienta como hace este documento.
