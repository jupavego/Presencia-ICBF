// Motor de lectura genérico para instrumentos cuantitativos (Tipo A):
// ítems tipo Likert que se suman o promedian, con o sin corte oficial.
// Ver docs/reglas-puntuacion-interpretacion.md para el diseño de cada
// instrumento y docs/arquitectura-modulo-perfilamiento.md (sección 5) para
// el contrato general del motor.
//
// No diagnostica: produce un perfil descriptivo con el mismo contrato que
// usa PatternCard (nivel, título, evidencia, lectura, preguntas), igual
// que el motor de lectura de red del F1 (lecturaRed.js).

// Calcula el puntaje de un instrumento a partir de sus ítems y las
// respuestas de la persona. `escalaMax` (y `escalaMin`, por defecto 0) son
// necesarios solo si hay ítems marcados como `invertido` — la inversión es
// (escalaMin + escalaMax) - valor, no solo escalaMax - valor, para que
// funcione también en escalas que no empiezan en 0 (ej. Likert 1-4).
export function calcularPuntaje(items, respuestas, { formula = 'suma', multiplicador = 1, escalaMin = 0, escalaMax } = {}) {
  const valores = items.map((item) => {
    const v = respuestas[item.id];
    if (v === undefined || v === null) return null;
    return item.invertido && escalaMax != null ? (escalaMin + escalaMax) - v : v;
  });
  if (valores.some((v) => v === null)) return null;
  const suma = valores.reduce((a, b) => a + b, 0);
  const bruto = formula === 'promedio' ? suma / valores.length : suma;
  return bruto * multiplicador;
}

// Garantía del motor: ninguna combinación de respuestas completa debe
// quedar sin lectura. Si ninguna regla de la definición aplicó, se usa
// `definicion.reglaResumen(ctx)` si existe (una lectura general, propia de
// cada instrumento); si tampoco existe, se genera un resumen mínimo a
// partir del puntaje. Esto no reemplaza diseñar bien las reglas de cada
// instrumento — es el respaldo para que un vacío de diseño nunca se vea
// como "sin patrones" en la interfaz.
function conGarantiaDeLectura(patrones, definicion, ctx) {
  if (patrones.length > 0) return patrones;
  if (definicion.reglaResumen) {
    const resumen = definicion.reglaResumen(ctx);
    if (resumen) return [resumen];
  }
  let resumenTexto;
  if (ctx.puntaje != null) {
    resumenTexto = `Puntaje: ${ctx.puntaje.toFixed ? ctx.puntaje.toFixed(1) : ctx.puntaje}`;
  } else if (ctx.puntajes) {
    resumenTexto = Object.entries(ctx.puntajes).map(([k, v]) => `${k}: ${v.toFixed(1)}`).join(' · ');
  } else {
    resumenTexto = Object.entries(ctx.categorias || {})
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.map((x) => x.etiqueta).join(', ') : v?.etiqueta ?? v}`)
      .join(' · ');
  }
  return [{
    codigo: `${definicion.id}_RESUMEN_GENERICO`,
    nivel: 'oportunidad',
    titulo: 'Lectura general',
    evidencia: [resumenTexto],
    lectura: 'Las respuestas no encajan en ninguno de los patrones específicos definidos para este instrumento; queda registrado el resultado general para revisar con el equipo.',
  }];
}

// Ejecuta las reglas de interacción de una definición de instrumento sobre
// un conjunto de respuestas. Cada regla es una función `(ctx) => patrón |
// null`; `ctx` recibe { puntaje, respuestas, items }. Se filtran las que no
// aplican y se devuelven en el mismo orden en que están definidas.
// Para instrumentos unidimensionales (ej. WHO-5, Autoeficacia General).
export function leerInstrumento(definicion, respuestas) {
  const puntaje = calcularPuntaje(definicion.items, respuestas, definicion);
  if (puntaje === null) return { completo: false, puntaje: null, patrones: [] };
  const ctx = { puntaje, respuestas, items: definicion.items };
  const patrones = conGarantiaDeLectura(
    definicion.reglas.map((regla) => regla(ctx)).filter(Boolean),
    definicion,
    ctx,
  );
  return { completo: true, puntaje, patrones };
}

// Variante para instrumentos con varias subescalas (ej. MSPSS, FACES-20esp,
// FRAS, FQOL, McMaster FAD): `definicion.subescalas` es un arreglo de
// { id, nombre, items, formula?, multiplicador?, escalaMax? } — cada una se
// puntúa con `calcularPuntaje`, heredando formula/multiplicador/escalaMax
// de la definición general si no los define ella misma. Las reglas reciben
// { puntajes: { subescalaId: valor }, respuestas, subescalas }.
export function leerInstrumentoMultiescala(definicion, respuestas) {
  const puntajes = {};
  for (const sub of definicion.subescalas) {
    const puntaje = calcularPuntaje(sub.items, respuestas, {
      formula: sub.formula || definicion.formula,
      multiplicador: sub.multiplicador || definicion.multiplicador || 1,
      escalaMin: sub.escalaMin ?? definicion.escalaMin ?? 0,
      escalaMax: sub.escalaMax || definicion.escalaMax,
    });
    if (puntaje === null) return { completo: false, puntajes: null, patrones: [] };
    puntajes[sub.id] = puntaje;
  }
  const ctx = { puntajes, respuestas, subescalas: definicion.subescalas };
  const patrones = conGarantiaDeLectura(
    definicion.reglas.map((regla) => regla(ctx)).filter(Boolean),
    definicion,
    ctx,
  );
  return { completo: true, puntajes, patrones };
}

// Motor cualitativo (Tipo B): preguntas de respuesta cerrada donde cada
// opción ya trae su categoría/indicador asociado — ver
// docs/matriz-variables-indicadores.md#formato-de-pregunta-parametrizada-diseño-propio-e-híbridas.
// A diferencia del motor cuantitativo, nunca suma puntajes: solo traduce
// cada respuesta a su categoría y deja que las reglas crucen categorías
// entre sí, igual principio que `detectarPatrones()` en lecturaRed.js.
//
// `definicion.preguntas`: array de
//   { id, texto, tipo: 'presencia'|'frecuencia'|'seleccion_unica'|'checklist'|'numerico',
//     opciones: [{ valor, etiqueta, categoria?, nivel? }], notaAbierta?, notaPlaceholder? }
//   - `categoria` es la etiqueta descriptiva de esa respuesta (por defecto,
//     la misma `etiqueta`); `nivel` (opcional: 'bajo'|'medio'|'alto') es lo
//     que usan las reglas de interacción genéricas para comparar preguntas
//     de tipos distintos entre sí (ver reglaMixto de cada instrumento).
//   - En 'checklist', `respuestas[id]` es un arreglo de `valor`es
//     seleccionados; en 'numerico' no hay `opciones`, se usa el valor tal
//     cual, sin categorizar.
//   - `notaAbierta: true` habilita un campo de texto libre opcional junto a
//     la pregunta (para preguntas cerradas donde precisar el contenido
//     importa, ej. "¿tiene una meta?" Sí/No + "¿cuál?"). Se guarda en
//     `respuestas[`${id}_nota`]` y nunca es obligatorio ni se usa en las
//     reglas — es un registro cualitativo aparte, expuesto en `notas`.
// `definicion.reglas`: reciben { categorias, respuestas, preguntas, notas }.
export function leerCategorias(definicion, respuestas) {
  const categorias = {};
  for (const p of definicion.preguntas) {
    const v = respuestas[p.id];
    if (v === undefined || v === null) return { completo: false, categorias: null, patrones: [] };
    if (p.tipo === 'checklist') {
      if (!Array.isArray(v) || v.length === 0) return { completo: false, categorias: null, patrones: [] };
      categorias[p.id] = v
        .map((val) => p.opciones.find((o) => o.valor === val))
        .filter(Boolean)
        .map((o) => ({ valor: o.valor, etiqueta: o.categoria || o.etiqueta, nivel: o.nivel }));
    } else if (p.tipo === 'numerico') {
      categorias[p.id] = { valor: v, etiqueta: String(v) };
    } else {
      const opcion = p.opciones.find((o) => o.valor === v);
      if (!opcion) return { completo: false, categorias: null, patrones: [] };
      categorias[p.id] = { valor: opcion.valor, etiqueta: opcion.categoria || opcion.etiqueta, nivel: opcion.nivel };
    }
  }
  const notas = {};
  for (const p of definicion.preguntas) {
    if (!p.notaAbierta) continue;
    const texto = respuestas[`${p.id}_nota`];
    if (texto && String(texto).trim()) notas[p.id] = String(texto).trim();
  }
  const ctx = { categorias, respuestas, preguntas: definicion.preguntas, notas };
  const patrones = conGarantiaDeLectura(
    definicion.reglas.map((regla) => regla(ctx)).filter(Boolean),
    definicion,
    ctx,
  );
  return { completo: true, categorias, notas, patrones };
}
