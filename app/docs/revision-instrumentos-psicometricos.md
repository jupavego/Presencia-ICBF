# Revisión de Instrumentos Psicométricos (carpeta `instrumentos/`)

**Documento interno de la solución — fase de ideación.** Registra la revisión
de los 26 archivos cargados en la carpeta `instrumentos/` (fuera del
repositorio, en la carpeta de trabajo del servicio), pensados como insumo
para eventuales motores de lectura de otros formatos (F7 y siguientes),
siguiendo el mismo principio que ya usa el F1 — ver
[`motor-lectura-red.md`](motor-lectura-red.md).

No es una decisión de arquitectura ni un compromiso de qué se va a
implementar: es el inventario y la evaluación técnica de las fuentes, para
decidir después con criterio (y sin releer todo) qué instrumento vale la
pena convertir en motor de lectura.

## 1. Método de revisión

Leer los 26 PDF completos (varios de más de 5 MB, hasta 13 MB) habría sido
muy costoso en tokens. Se usó una revisión por capas:

1. **Triage por metadatos** (nombre/tamaño de archivo, costo cero).
2. **Lectura dirigida**: portada/índice primero; solo si el documento es
   relevante se profundiza directo en la sección de items, fórmula de
   puntuación e interpretación — nunca lectura lineal completa.
3. **Reportes grandes de la OMS sin identificar** (7 archivos, hasta 13 MB):
   solo portada/índice (2-4 páginas), para decidir si vale la pena
   profundizar.

La revisión se dividió en 3 procesos paralelos por categoría (instrumentos y
claves de puntuación; estudios de validación; reportes OMS/marcos teóricos)
para acotar el alcance de cada uno.

## 2. Instrumentos evaluados — fichas técnicas

| Instrumento | Fuente(s) en la carpeta | Ítems / subescalas | Fórmula de puntuación | Interpretación / cortes | Población validada | Estado |
|---|---|---|---|---|---|---|
| **WHO-5** (Índice de Bienestar OMS) | `oms-(cinco)-indice-de-bienestar-(oms-5).pdf` | 5 ítems, sin subescalas | Suma (0-25) × 4 → 0-100 | Bruto &lt;13 sugiere aplicar screening de depresión (ICD-10); cambio ≥10% = cambio significativo | Traducción española oficial, uso internacional | ✅ Completo y listo |
| **McMaster FAD** | `McMaster_FAD.pdf` + `McMaster_FAD_Subscales.pdf` + `FAD.R` | 60 ítems, 7 subescalas (Resolución de Problemas, Comunicación, Roles, Respuesta Afectiva, Involucramiento Afectivo, Control de Conducta, Funcionamiento General) | Promedio por subescala; `FAD.R` es la única fuente con la clave exacta de ítems directos/inversos | **No hay puntos de corte en ningún archivo de la carpeta** | Sin validación en español/Colombia en esta carpeta | ⚠️ Falta clave de corte + validación hispana |
| **FACES-20esp** (⚠️ no es FACES-IV, ver nota) | `Family_Adaptability_and_Cohesion_Evaluation_Scale_.pdf` | 20 ítems, 2 subescalas (Cohesión, Adaptabilidad) | Media por subescala, con ítems inversos | Modelo teórico curvilíneo (extremos = disfuncional); sin tabla de cortes numéricos | Español — 243 universitarios (España) | ⚠️ Nombre de archivo engañoso — corregir expectativa |
| **FACES-IV** (el instrumento real de Olson/Gorall) | Solo hay su **validación portuguesa**: `Manuscript_GomesPeixotoGouveia-Pereira2017...pdf` | 6 factores (paquete FACES-IV + Family Communication Scale + Family Satisfaction Scale) | No incluida — el archivo es solo el estudio de validación, no el instrumento | Sin cortes | Portugués — 553 adultos (Portugal) | ⚠️ Falta el instrumento en sí y una validación en español |
| **FQOL Scale** (Beach Center, Family Quality of Life) | `Family Quality of Life Psychometric Characteristics and Scoring Key.pdf` | 25 ítems, 5 subescalas (Interacción Familiar, Crianza, Bienestar Emocional, Bienestar Físico/Material, Apoyo relacionado con discapacidad) | Satisfacción Likert 1-5; agregación por subescala no explicitada literalmente | Sin cortes; explícitamente **no apta para diagnóstico ni elegibilidad** | Inglés (EE. UU.), familias de niños con discapacidad (extensible) | ✅ Uso educativo autorizado por el propio documento |
| **WHOQOL-BREF** | `WHOQOL-Bref_Syntax_files.pdf` (sintaxis) + `translation-methodology.pdf` + `WHO_HIS_HSI_Rev.2012.03_eng.pdf` (manual) | 26 ítems, 4 dominios (Físico, Psicológico, Relaciones sociales, Ambiente) + 2 ítems globales | Media del dominio × 4, transformado a 0-100; excluye casos con &gt;5 ítems faltantes | Sin cortes; puntaje continuo (mayor = mejor) | Instrumento oficial OMS, multilingüe | ✅ Completo — requiere autorización de uso de la OMS |
| **Escala de Autoeficacia General** (adaptación española) | `SANJUAN-PEREZ-BERMUDEZ_Psicothema-2000...pdf` | 10 ítems, unidimensional | Suma simple, 10-100 | Sin cortes clínicos; tabla normativa Z de referencia | Español — 259 universitarios (España) | ✅ Completo (sin cortes clínicos) |
| **Modelo ecológico de Bronfenbrenner** | `The Bronfenbrenner Ecological Model and Its 5 Systems.pdf` | N/A — marco conceptual, no instrumento puntuable | N/A | N/A | Fuente **secundaria/divulgativa** (blog Verywell Mind, no un paper académico) | ⚠️ Buscar fuente primaria si se usa para sustentar metodología |

## 3. Hallazgo no solicitado pero relevante: FRAS

`fpsyg-16-1568139.pdf` no valida ninguno de los instrumentos de la lista
original: valida el **Family Resilience Assessment Scale (FRAS)**, adaptado
y validado en **303 familias de Salgar y Barbosa (Antioquia)** expuestas a
eventos estresantes (riesgo de desastre natural o conflicto armado) —
Valencia Londoño, Trujillo Orrego, Duque Monsalve &amp; Giraldo Cardona (2025).

Es la **misma región** que atiende este proyecto (ICBF Regional Antioquia),
con reporte psicométrico sólido (CFA, invarianza por género, Ω ≥ 0.7). No
estaba contemplado en el set original de instrumentos, pero por población y
región es un candidato a evaluar con el equipo — potencialmente más
pertinente que varios de los instrumentos de la lista original, que solo
tienen validación en España o Portugal.

## 4. Archivo de baja relevancia detectado

`adminpujojs,+19UP9-2_CMorran.pdf` valida el **Brief COPE / COPE-28**
(estrategias de afrontamiento), no uno de los instrumentos del proyecto.
Muestra española, y los propios autores del estudio concluyen que la
validez del instrumento "no es concluyente" (KMO cuestionable, estructura
factorial no confirmada). Recomendación: confirmar con el equipo si este
archivo corresponde a esta carpeta o quedó ahí por error.

## 5. Reportes OMS / marcos teóricos — triage (Layer 1, solo portada/índice)

| Archivo | Título identificado | Recomendación |
|---|---|---|
| `9789240112360-eng.pdf` | *From loneliness to social connection* (Comisión OMS sobre Conexión Social, 2025) | Archivar como contexto — su sección "Measurement instruments" no se verificó |
| `9789240104181-eng.pdf` | *Measuring the progress and impact of the UN Decade of Healthy Ageing* (OMS, 2024) | Archivar como contexto — población de adultos mayores, no coincide con el foco familiar |
| `9789240107588-eng.pdf` (+ duplicado exacto) | *World report on social determinants of health equity* (OMS, 2025) | Archivar como contexto |
| `9789240088320-eng.pdf` | *Operational framework for monitoring social determinants of health equity* (OMS, 2024) | Archivar como contexto |
| `9789241548533_eng.pdf` | *Assessing mental health and psychosocial needs and resources: toolkit for humanitarian settings* (OMS/ACNUR, 2012) | Profundizar si se quiere explorar — alta afinidad temática con apoyo social/psicosocial, no confirmada su relación directa con MSPSS |
| `9789241500852_eng.pdf` | *A Conceptual Framework for Action on the Social Determinants of Health* (Solar &amp; Irwin, OMS, 2010) | Archivar como contexto — marco de determinantes sociales, no de instrumentos |
| `9789241547598_eng.pdf` | Manual del WHODAS 2.0 (discapacidad/funcionamiento, OMS, 2010) | Archivar como contexto — instrumento distinto, aunque su índice menciona relación con WHOQOL |

## 6. Duplicados detectados

- `9789240107588-eng.pdf` y `9789240107588-eng (1).pdf` — copia exacta.
- `whoqol-bref-syntax-files.zip` y `WHOQOL-Bref_Syntax_files.pdf` — mismo
  contenido en dos formatos; el PDF es más fácil de auditar.
- `McMaster_FAD.pdf` es subconjunto de `McMaster_FAD_Subscales.pdf` +
  `FAD.R` (no aporta nada que estos dos no tengan).
- `raw...MSPSS.R.pdf` es redundante frente a `MSPSS.pdf` (que además trae
  la fórmula explícita y rangos orientativos que el script no aclara).

## 7. Vacíos identificados

- No hay clave de puntuación con puntos de corte para el FAD (McMaster) en
  la carpeta.
- No hay validación en español/Colombia para WHO-5, MSPSS ni FAD.
- Confusión de nombre entre FACES-20esp (español, disponible) y FACES-IV
  (portugués, solo el estudio de validación, sin el instrumento en
  español) — pendiente decidir cuál usar.
- El modelo de Bronfenbrenner solo tiene respaldo en una fuente
  secundaria no académica.

## 8. Prioridad orientativa para un futuro motor de lectura

Siguiendo el estándar que ya fija `motor-lectura-red.md` (nunca
diagnosticar, siempre condicional/orientador, avisos éticos explícitos):

- **Más listos para integrar** (fórmula completa, sin vacíos críticos):
  WHO-5, Escala de Autoeficacia General, WHOQOL-BREF (con permiso de la
  OMS), FQOL Scale (uso educativo ya autorizado por su fuente).
- **Necesitan trabajo adicional antes de construir el motor**: FAD (sin
  cortes ni validación hispana), FACES (resolver qué versión usar), MSPSS
  (sin validación hispana).
- **A evaluar con el equipo, fuera de la lista original**: FRAS
  (validación regional en Antioquia, alta pertinencia).

## 8.1 Cobertura completa verificada (los 26 archivos, sin excepción)

Tras la evaluación técnica inicial (secciones 1-8), se completó la lectura de la
totalidad de los 26 archivos de la carpeta, incluidos los 8 reportes OMS de
contexto (1181 páginas en total: soledad/conexión social, envejecimiento
saludable, determinantes sociales ×2, marco conceptual CSDH, toolkit
psicosocial humanitario, manual WHOQOL, manual WHODAS 2.0).

Para verificar que ninguna mención aislada de los instrumentos del proyecto
quedara oculta en medio de esos reportes, se hizo una búsqueda de texto
completo (no solo portada/índice/conclusiones) por los nombres exactos de
cada instrumento (MSPSS/Zimet, McMaster FAD, FACES/Olson/Circumplex,
WHO-5, Bronfenbrenner, Baessler/Schwarzer, FRAS/Sixbey) y por
Antioquia/Salgar/Barbosa, sobre el texto íntegro extraído de los 8
documentos. **Ninguno de esos términos aparece en ningún punto de los 8
reportes**, fuera de las menciones ya cubiertas de WHOQOL (instrumento
propio, ya documentado en la sección 2) y de WHODAS 2.0 (instrumento de
discapacidad/funcionamiento, distinto a los de la lista original — no
aporta a la batería familiar de este proyecto).

Con esto, la revisión de la carpeta `instrumentos/` queda completa: no hay
instrumento, fórmula de puntuación ni estudio de validación pendiente de
identificar en ninguno de los 26 archivos.

## 9. Próximos pasos sugeridos

1. Decidir con el equipo qué versión de FACES usar (FACES-20esp en español
   vs. FACES-IV con validación solo en portugués).
2. Si se requiere el mismo rigor que el FRAS, buscar validaciones en
   español/Colombia faltantes para FAD, MSPSS y WHO-5.
3. Confirmar la pertinencia de `adminpujojs...CMorran.pdf` (COPE-28) en la
   carpeta.
4. Evaluar si el FRAS (sección 3) se incorpora como instrumento adicional,
   dada su validación regional.
5. Al construir cualquier motor de lectura a partir de estos instrumentos,
   seguir el mismo principio de diseño Dato → Patrón → Hipótesis →
   Pregunta y las salvaguardas éticas ya documentadas en
   [`motor-lectura-red.md`, sección 9](motor-lectura-red.md#9-salvaguardas-y-límites-decisiones-deliberadas).
