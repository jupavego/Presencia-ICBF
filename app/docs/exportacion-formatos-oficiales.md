# Exportación a los formatos oficiales del ICBF

**Documento interno de la solución.** Describe cómo cada formulario web
puede descargar lo diligenciado directamente sobre la plantilla oficial
(.docx / .xlsx) del ICBF, sin modificar su diseño.

Código: [`src/lib/exportOficial.js`](../src/lib/exportOficial.js) (motor genérico) · plantillas en [`public/plantillas/`](../public/plantillas/) · botón en [`src/components/ui/FormActions.jsx`](../src/components/ui/FormActions.jsx) (prop `onExport`).

## 1. Cómo funciona (sin backend)

Todo corre en el navegador, con dos librerías según el tipo de archivo:

- **.docx → [docxtemplater](https://docxtemplater.com/) + pizzip.** Se carga
  una *plantilla* — una copia del .docx oficial con marcadores `{tag}`
  insertados en los espacios en blanco — y se renderiza con los datos del
  formulario. El resultado conserva exactamente el diseño original.
- **.xlsx → [exceljs](https://github.com/exceljs/exceljs).** No hace falta
  una plantilla aparte: se carga el .xlsx oficial **sin modificar**, se
  escribe directamente en las celdas por su coordenada (`C6`, `A14`, etc.) y
  se descarga el resultado. El formato del libro se conserva porque solo se
  cambia el *valor* de celdas ya existentes.

En ambos casos, el archivo original de `formatos/` (raíz del proyecto)
**no se toca**. Las plantillas de `public/plantillas/` son copias
generadas para este propósito — ver sección 3.

## 2. Cómo se obtienen los datos de cada formulario

La mayoría de campos de los formularios son *no controlados* (sin
`useState` de React, por simplicidad — ver decisiones de diseño previas).
Para poder leerlos al momento de exportar, cada campo relevante recibe un
atributo `name`, y la función de exportación arma los datos con
`new FormData(formRef.current)`. Los campos que sí están en estado de React
(checkboxes, radios, tablas dinámicas) se leen directamente de ese estado.

Patrón usado en cada formato con exportación:

```jsx
const formRef = useRef(null);
// ...
<form ref={formRef} onSubmit={handleSubmit}>
  <TextField name="declaranteNombre" label="Nombre completo" />
  ...
  <FormActions onExport={handleExportarOficial} ... />
</form>
```

## 3. Cómo se construyeron las plantillas .docx

Las plantillas no se escriben a mano: se generan una sola vez con un script
de `python-docx` que abre el .docx oficial y reemplaza cada raya de
diligenciamiento ("____", "Si \_\_ No\_\_") por un marcador `{tag}`, dentro
del mismo *run* de texto — es decir, sin tocar el resto del documento. El
script fuente de cada plantilla puede reconstruirse a partir del código de
este documento si hace falta regenerarla.

Casos especiales resueltos:

- **Blancos "Si \_\_ No\_\_" dentro de una oración**: se reemplaza el
  bloque completo por un único tag (p. ej. `{autDatosTexto}`), y en tiempo
  de ejecución el formulario arma el texto final ("Si X\_ No\_\_" o
  "Si \_\_ NoX\_") según la respuesta — igual a como se marcaría a mano.
- **Celdas de Excel con texto enriquecido** (varias fuentes dentro de la
  misma celda, como el Habeas Data de F4): exceljs expone la celda como
  `{ richText: [...] }`; se ubica el *run* que contiene la pregunta por un
  fragmento único de texto y solo se modifica ese run.
- **Nombres de hoja con espacios** (F8 trae una hoja llamada
  `" Encuentro Comunitar Cuidado "`, con espacio inicial y final): se
  referencia por posición (`workbook.worksheets[2]`) en vez de por nombre,
  para no depender de ese detalle fragil del archivo original.
- **Filas de tabla repetidas** (F7 trae una sola fila para el integrante,
  pero el formulario web permite agregar varios): se usa el *loop de fila*
  nativo de docxtemplater — el tag `{#integrantes}` se coloca al inicio del
  texto de la primera celda de la fila, y `{/integrantes}` al final del
  texto de la última celda de esa misma fila. Docxtemplater detecta que el
  loop abre y cierra dentro de la misma fila y la repite completa por cada
  elemento del arreglo, conservando el formato de la fila original.
- **Tablas anidadas** (F10 trae una tabla de "Datos básicos" dentro de una
  celda combinada de la tabla principal): se accede con
  `tabla.rows[i].cells[j].tables[0]` y se opera sobre esa tabla anidada
  igual que sobre cualquier otra.

## 4. Estado por formato

| Formato | Tipo | Estado | Notas |
|---|---|---|---|
| **F3** Acuerdo de Vinculación | .docx | ✅ Completo | Incluye hasta 4 menores de edad (el original solo trae 4 líneas en blanco para eso). |
| **F4** Encuesta de Satisfacción | .xlsx | ✅ Completo | Sin plantilla aparte: escribe directo sobre el .xlsx oficial. |
| **F8** Cronograma de Visitas y Encuentros | .xlsx | ✅ Completo | Las dos pestañas (Entorno Familiar / Encuentros Comunitarios) exportan a sus dos hojas correspondientes, con filas ilimitadas. |
| **F7** Perfil Socio Familiar | .docx | ✅ Completo | El original combina blancos de texto, tablas de selección (ingreso/vivienda/eventos, con una celda de respuesta por opción — se marca con `X`) y una tabla de un integrante por fila. Esa tabla se resuelve con un **loop de fila de Word** (`{#integrantes}` al inicio de la primera celda de la fila de datos y `{/integrantes}` al final de la última; docxtemplater repite la fila completa por cada integrante). Varios controles del formulario web (curso de vida, padre/madre, unión actual, otros procesos, y los checkboxes de vida social/instituciones/ocupación de la sección 11) no tenían estado de React conectado — se completó esa conexión como parte de este trabajo. Dos bloques del documento original (Dinámica relacional familiar, Significados y prácticas) no tienen campo equivalente en el formulario web; quedan en blanco en la plantilla para diligenciarse a mano. |
| **F10** Seguimiento Uso del Recurso | .docx | ✅ Completo | Los campos básicos viven en una tabla anidada dentro de la fila 1 de la tabla principal (celda combinada de 5 columnas); se ubica con `table.rows[1].cells[0].tables[0]`. La tabla de compras del original tiene 8 filas fijas — se rellenan hasta 8 filas de la tabla dinámica del formulario web (igual límite que los 4 menores de F3). |
| **F5** Encuentros Comunitarios | .docx | ✅ Completo | El documento oficial real es un formulario de **texto libre** (líneas en blanco por sección), sin las categorías de selección múltiple del formulario web. Solución: cada grupo de casillas (actividades, logros, aciertos, barreras, mejoras) se une en una sola lista de texto separada por `;` al momento de exportar, y se inserta en el blanco correspondiente de la plantilla. |
| **F6** Acompañamiento Entorno Familiar | .docx | ✅ Completo | Mismo caso que F5: el original son 10 preguntas de texto libre. Solución equivalente — las casillas de herramientas, aspectos, contexto y retos se unen en texto; los "Tipos de compromiso" (checkboxes) y la matriz de compromisos (tabla dinámica Responsable/Fecha/Estado) se combinan en un solo bloque de texto legible para el campo `{compromisoFamilia}`. |
| **F1** Mapa de Pertenencia | — | 🚫 No aplica | El documento fuente es una guía metodológica (sin tabla ni campos), no un formato para diligenciar. No hay una "plantilla oficial" que llenar. |

## 5. Cómo agregar la exportación a un formato nuevo

1. Si es **.xlsx**: no se necesita plantilla nueva — copiar el archivo
   original a `public/plantillas/` tal cual, e identificar las coordenadas
   de celda con `openpyxl` (`ws['A1'].value`, `ws.merged_cells.ranges`).
2. Si es **.docx**: escribir un script de `python-docx` que localice cada
   blanco por su texto exacto y lo reemplace por `{tag}` dentro del mismo
   run (ver sección 3), y guardar el resultado en `public/plantillas/`.
3. En el componente del formato: agregar `formRef`, `name` a los campos no
   controlados, una función `handleExportarOficial` que arme el objeto de
   datos, y pasarla como `onExport` a `<FormActions>`.
