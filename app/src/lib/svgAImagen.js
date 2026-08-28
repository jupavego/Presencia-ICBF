// Convierte un <svg> del DOM (por ejemplo el Mapa de Pertenencia de F1,
// que no tiene plantilla .docx oficial — el documento original solo trae
// dos diagramas en blanco para dibujar a mano, ver
// formatos/f1.go3_.mt5_.pp_mapa_pertenencia_actual_potencial_v1.docx) en
// un PNG, para poder respaldarlo en Drive igual que los formatos con
// plantilla de texto.
//
// Un <svg> serializado como imagen independiente no hereda las variables
// CSS del documento host (var(--border), var(--text)...) — se resuelven
// primero a su valor real y se reemplazan como texto en el XML, o el
// diagrama sale sin líneas/texto visibles.
async function cargarSvgComoImagen(svgEl, size) {
  const clone = svgEl.cloneNode(true);
  clone.setAttribute('width', size);
  clone.setAttribute('height', size);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  const raiz = getComputedStyle(document.documentElement);
  const border = raiz.getPropertyValue('--border').trim() || '#d8dfdb';
  const texto = raiz.getPropertyValue('--text').trim() || '#1c2b25';

  let svgString = new XMLSerializer().serializeToString(clone);
  svgString = svgString.replaceAll('var(--border)', border).replaceAll('var(--text)', texto);

  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function svgElementAPng(svgEl, { size = 900, fondo = '#ffffff', mime = 'image/png' } = {}) {
  const img = await cargarSvgComoImagen(svgEl, size);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = fondo;
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, 0, 0, size, size);
  return await new Promise((resolve) => canvas.toBlob(resolve, mime));
}

function envolverTexto(ctx, texto, maxWidth) {
  const palabras = texto.split(' ');
  const lineas = [];
  let actual = '';
  for (const palabra of palabras) {
    const prueba = actual ? `${actual} ${palabra}` : palabra;
    if (actual && ctx.measureText(prueba).width > maxWidth) {
      lineas.push(actual);
      actual = palabra;
    } else {
      actual = prueba;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

// Igual que svgElementAPng, pero le agrega debajo del diagrama la lectura
// automatizada del mapa (perfil, métricas, patrones) como texto — así la
// evidencia que queda en Drive no es solo el dibujo en blanco, incluye el
// análisis que ya genera la app. `nota.titulo` va en negrita arriba,
// `nota.parrafos` son líneas de texto corrido debajo, en orden.
//
// `mime` es 'image/png' por defecto (uso original: respaldo en Drive) pero
// acepta 'image/jpeg' — hace falta al insertar esta imagen dentro del .docx
// oficial de F1 (exportOficial.js), cuyas dos imágenes originales están
// declaradas como .jpeg; escribir bytes PNG ahí con esa extensión rompe la
// apertura del documento en Word.
export async function svgElementConNotaAPng(svgEl, nota, { size = 900, fondo = '#ffffff', mime = 'image/png' } = {}) {
  const img = await cargarSvgComoImagen(svgEl, size);

  const margen = 28;
  const anchoTexto = size - margen * 2;
  const medidor = document.createElement('canvas').getContext('2d');

  const bloques = [];
  medidor.font = '700 20px system-ui, sans-serif';
  bloques.push({ lineas: envolverTexto(medidor, nota.titulo, anchoTexto), font: '700 20px system-ui, sans-serif', alto: 26, espacioDespues: 10 });
  medidor.font = '400 15px system-ui, sans-serif';
  for (const parrafo of nota.parrafos) {
    bloques.push({ lineas: envolverTexto(medidor, parrafo, anchoTexto), font: '400 15px system-ui, sans-serif', alto: 20, espacioDespues: 12 });
  }

  const altoNota = margen + bloques.reduce((acc, b) => acc + b.lineas.length * b.alto + b.espacioDespues, 0) + margen;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size + altoNota;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = fondo;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, size, size);

  ctx.strokeStyle = '#d8dfdb';
  ctx.beginPath();
  ctx.moveTo(margen, size + margen / 2);
  ctx.lineTo(size - margen, size + margen / 2);
  ctx.stroke();

  ctx.fillStyle = '#1c2b25';
  ctx.textBaseline = 'top';
  let y = size + margen;
  for (const bloque of bloques) {
    ctx.font = bloque.font;
    for (const linea of bloque.lineas) {
      ctx.fillText(linea, margen, y);
      y += bloque.alto;
    }
    y += bloque.espacioDespues;
  }

  return await new Promise((resolve) => canvas.toBlob(resolve, mime));
}
