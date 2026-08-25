#!/usr/bin/env node
// Automatización reutilizable de datos de demo para "Presencia" (ICBF):
// crea 5 cuentas de profesional ICBF + 5 casos-beneficiario, cada
// beneficiario diligencia PET + F1 (Mapa de Pertenencia) + las 25
// herramientas del Módulo de Perfilamiento con perfiles de respuesta
// realistas (intermedio / extremo alto / extremo bajo / atípico), cada caso
// se asigna 1 a 1 a un profesional ICBF, y ese profesional diligencia
// F3/F4/F5/F6/F7/F8/F10. Al final genera los documentos Word/Excel
// oficiales rellenados en scripts-output/seed-demo/ (misma estructura de
// carpetas que usa el respaldo real en Drive) y un reporte de qué campos
// de cada plantilla oficial se quedaron sin dato.
//
// Uso:
//   node scripts/seed-demo.mjs           (primera vez / agrega si no existe demo previo)
//   node scripts/seed-demo.mjs --reset   (borra el demo anterior y lo vuelve a crear)
import crypto from 'node:crypto';
import { supabaseAdmin } from './seed-demo/supabaseAdmin.mjs';
import { resetDemo } from './seed-demo/reset.mjs';
import { PROFESIONALES_ICBF, BENEFICIARIOS, DOMINIO_DEMO } from './seed-demo/perfiles.mjs';
import { generarPerfilamientoCompleto } from './seed-demo/perfilamientoEngine.mjs';
import { generarF1, generarF3, generarF4, generarF6, generarCompromisos, generarFamiliaYF7, generarF8, datosF8ParaGuardar, generarF10 } from './seed-demo/formatos.mjs';
import { generarF5 } from './seed-demo/f5.mjs';
import { renderDocx, renderF4Xlsx, renderF8Xlsx, rutaSalida, guardarArchivo, SALIDA_DIR } from './seed-demo/exportarOficial.mjs';

const HOY = new Date();
const RESET = process.argv.includes('--reset');

function assert(cond, msg) { if (!cond) throw new Error(msg); }

function codigoAcceso() {
  return crypto.randomBytes(8).toString('hex').slice(0, 8).toUpperCase();
}

async function verificarDemoExistente() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw error;
  return data.users.some((u) => u.email?.endsWith(DOMINIO_DEMO));
}

async function crearProfesionalesIcbf() {
  console.log('--- Creando 5 cuentas de profesional ICBF ---');
  const creados = [];
  for (const p of PROFESIONALES_ICBF) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: p.email,
      password: p.password,
      email_confirm: true,
    });
    assert(!error, `No se pudo crear ${p.email}: ${error?.message}`);
    const userId = data.user.id;
    const { error: errPerfil } = await supabaseAdmin
      .from('profiles')
      .update({ nombre: p.nombre, centro_zonal: p.centroZonal })
      .eq('id', userId);
    assert(!errPerfil, `No se pudo actualizar profiles de ${p.email}: ${errPerfil?.message}`);
    console.log(`  + ${p.nombre} <${p.email}> — ${p.centroZonal}`);
    creados.push({ ...p, id: userId });
  }
  return creados;
}

async function crearCasosBeneficiarios() {
  console.log('\n--- Creando 5 casos-beneficiario (bolsa común) ---');
  const creados = [];
  for (const b of BENEFICIARIOS) {
    const codigo = codigoAcceso();
    const { data, error } = await supabaseAdmin
      .from('casos')
      .insert({
        numero_peticion: b.numeroPeticion,
        nombre_participante: b.nombre,
        municipio: b.municipio,
        estado: 'bolsa_comun',
        codigo_acceso: codigo,
      })
      .select()
      .single();
    assert(!error, `No se pudo crear el caso ${b.key}: ${error?.message}`);
    console.log(`  + ${b.nombre} (${b.municipio}) — perfil ${b.modo} — código de acceso ${codigo}`);
    creados.push({ ...b, id: data.id, codigoAcceso: codigo });
  }
  return creados;
}

async function sembrarF1YPerfilamiento(casos) {
  console.log('\n--- Diligenciando (beneficiario): F1 + 25 herramientas de Perfilamiento ---');
  for (const caso of casos) {
    const f1 = generarF1(caso);
    const { error: errF1 } = await supabaseAdmin.from('formatos_oficiales_datos').insert({ caso_id: caso.id, formato_key: 'F1', datos: f1 });
    assert(!errF1, `F1 (${caso.key}): ${errF1?.message}`);

    const filas = generarPerfilamientoCompleto(caso).map((f) => ({ caso_id: caso.id, instrumento_id: f.instrumento_id, resultado: f.resultado }));
    const { error: errPerfil } = await supabaseAdmin.from('perfilamiento_resultados').insert(filas);
    assert(!errPerfil, `perfilamiento_resultados (${caso.key}): ${errPerfil?.message}`);
    console.log(`  + ${caso.key}: F1 (${f1.actual.length} vínculos actuales) + ${filas.length}/25 herramientas`);
  }
}

async function asignarCasos(casos, profesionales) {
  console.log('\n--- Asignando cada caso a un profesional ICBF (1 a 1) ---');
  const asignaciones = [];
  for (const caso of casos) {
    const profesional = profesionales[caso.asignarA];
    const ahora = new Date().toISOString();
    const { error: errUpdate } = await supabaseAdmin
      .from('casos')
      .update({ estado: 'asignado', asignado_a: profesional.id, asignado_en: ahora })
      .eq('id', caso.id);
    assert(!errUpdate, `Asignar ${caso.key}: ${errUpdate?.message}`);
    const { error: errHist } = await supabaseAdmin
      .from('caso_asignaciones')
      .insert({ caso_id: caso.id, asignado_a: profesional.id, asignado_por: profesional.id });
    assert(!errHist, `caso_asignaciones ${caso.key}: ${errHist?.message}`);
    console.log(`  + ${caso.key} (${caso.nombre}) -> ${profesional.nombre}`);
    asignaciones.push({ caso, profesional });
  }
  return asignaciones;
}

async function sembrarFormatosProfesional(asignaciones) {
  console.log('\n--- Diligenciando (ICBF asignado): F3, F6, F7, F8, F10 ---');
  const contexto = [];
  for (const { caso, profesional } of asignaciones) {
    const itemsF6 = generarCompromisos(caso, 'F6');
    const itemsF7 = generarCompromisos(caso, 'F7');
    const itemsCombinados = [...itemsF6, ...itemsF7];

    const datosF3 = generarF3(caso, HOY);
    const datosF6 = generarF6(caso, caso, profesional, HOY, itemsF6);
    const { datos: datosF7, familiaIntegrantes } = generarFamiliaYF7(caso, caso, profesional, HOY, itemsCombinados);
    const datosF8 = generarF8(caso, profesional, HOY);
    const datosF10 = generarF10(caso, caso, profesional, HOY);

    const filas = [
      { caso_id: caso.id, formato_key: 'F3', datos: datosF3 },
      { caso_id: caso.id, formato_key: 'F6', datos: datosF6 },
      { caso_id: caso.id, formato_key: 'F7', datos: datosF7 },
      { caso_id: caso.id, formato_key: 'F8', datos: datosF8ParaGuardar(datosF8) },
      { caso_id: caso.id, formato_key: 'F10', datos: datosF10 },
    ];
    const { error: errFormatos } = await supabaseAdmin.from('formatos_oficiales_datos').insert(filas);
    assert(!errFormatos, `formatos_oficiales_datos (${caso.key}): ${errFormatos?.message}`);

    const { error: errFamilia } = await supabaseAdmin
      .from('familia_integrantes')
      .upsert({ caso_id: caso.id, integrantes: familiaIntegrantes }, { onConflict: 'caso_id' });
    assert(!errFamilia, `familia_integrantes (${caso.key}): ${errFamilia?.message}`);

    const { error: errCompromisos } = await supabaseAdmin
      .from('compromisos')
      .upsert({ caso_id: caso.id, items: itemsCombinados }, { onConflict: 'caso_id' });
    assert(!errCompromisos, `compromisos (${caso.key}): ${errCompromisos?.message}`);

    console.log(`  + ${caso.key}: F3, F6, F7 (${familiaIntegrantes.length} integrantes), F8, F10, compromisos (${itemsCombinados.length})`);
    contexto.push({ caso, profesional, datosF3, datosF6, datosF7, datosF8, datosF10 });
  }
  return contexto;
}

async function sembrarF5(asignaciones) {
  console.log('\n--- Diligenciando (ICBF asignado): F5 · Encuentro Comunitario ---');
  const resultado = [];
  for (const { caso, profesional } of asignaciones) {
    const { fecha, datos } = generarF5(profesional, caso.nombre, HOY);
    const { data: encuentro, error: errEncuentro } = await supabaseAdmin
      .from('encuentros_comunitarios')
      .insert({ realizado_por: profesional.id, fecha: fecha.toISOString().slice(0, 10), datos })
      .select()
      .single();
    assert(!errEncuentro, `encuentros_comunitarios (${caso.key}): ${errEncuentro?.message}`);
    const { error: errPart } = await supabaseAdmin
      .from('encuentro_participantes')
      .insert({ encuentro_id: encuentro.id, caso_id: caso.id });
    assert(!errPart, `encuentro_participantes (${caso.key}): ${errPart?.message}`);
    console.log(`  + ${caso.key}: encuentro comunitario del ${datos.fecha}`);
    resultado.push({ caso, profesional, datosF5: datos });
  }
  return resultado;
}

// Genera y escribe a disco los documentos oficiales (.docx/.xlsx) de cada
// caso, en la misma estructura de carpetas que usa el respaldo real en
// Drive (drive-storage/index.ts): <raíz>/<profesional>/<beneficiario>/<fase>/<archivo>.
// Devuelve, por formato, los marcadores de plantilla que quedaron sin dato
// en al menos uno de los 5 casos — la verificación de cobertura pedida.
async function generarExpedientes(contextoFormatos, contextoF5) {
  console.log('\n--- Generando documentos oficiales (.docx/.xlsx) en scripts-output/seed-demo ---');
  const FASE = {
    F3: '02 · Comprensión y Planificación Familiar',
    F6: '03 · Acompañamiento',
    F7: '02 · Comprensión y Planificación Familiar',
    F8: '02 · Comprensión y Planificación Familiar',
    F10: '04 · Seguimiento',
    F5: '03 · Acompañamiento',
    F4: '05 · Valoración y Cierre',
  };
  const faltantesPorFormato = {};
  const registrarFaltantes = (clave, lista) => {
    if (!lista.length) return;
    faltantesPorFormato[clave] = faltantesPorFormato[clave] || new Set();
    lista.forEach((c) => faltantesPorFormato[clave].add(c));
  };

  for (const { caso, profesional, datosF3, datosF6, datosF7, datosF8, datosF10 } of contextoFormatos) {
    const docs = [
      ['F3', 'F3-Acuerdo-Vinculacion.docx', 'F3-Acuerdo-Vinculacion-diligenciado.docx', datosF3],
      ['F6', 'F6-Acompanamiento-Entorno-Familiar.docx', 'F6-Acompanamiento-Entorno-Familiar-diligenciado.docx', datosF6],
      ['F7', 'F7-Perfil-Socio-Familiar.docx', 'F7-Perfil-Socio-Familiar-diligenciado.docx', datosF7],
      ['F10', 'F10-Seguimiento-Recurso.docx', 'F10-Seguimiento-Recurso-diligenciado.docx', datosF10],
    ];
    for (const [clave, plantilla, archivoSalida, datos] of docs) {
      const { buffer, camposFaltantes } = renderDocx(plantilla, datos);
      guardarArchivo(rutaSalida(profesional.nombre, caso.nombre, FASE[clave], archivoSalida), buffer);
      registrarFaltantes(clave, camposFaltantes);
    }

    const f4 = generarF4(caso, caso, profesional, HOY);
    const { error: errF4 } = await supabaseAdmin.from('formatos_oficiales_datos').insert({ caso_id: caso.id, formato_key: 'F4', datos: f4 });
    assert(!errF4, `F4 (${caso.key}): ${errF4?.message}`);
    const { buffer: bufF4, camposFaltantes: faltF4 } = await renderF4Xlsx(f4);
    guardarArchivo(rutaSalida(profesional.nombre, caso.nombre, FASE.F4, 'F4-Encuesta-Satisfaccion-diligenciada.xlsx'), bufF4);
    registrarFaltantes('F4', faltF4);

    const { buffer: bufF8 } = await renderF8Xlsx(datosF8);
    guardarArchivo(rutaSalida(profesional.nombre, caso.nombre, FASE.F8, 'F8-Cronograma-diligenciado.xlsx'), bufF8);

    console.log(`  + ${caso.key}: F3, F4, F6, F7, F8, F10 -> carpeta de ${profesional.nombre} / ${caso.nombre}`);
  }

  for (const { caso, profesional, datosF5 } of contextoF5) {
    const { buffer, camposFaltantes } = renderDocx('F5-Encuentros-Comunitarios.docx', datosF5);
    guardarArchivo(rutaSalida(profesional.nombre, caso.nombre, FASE.F5, 'F5-Encuentros-Comunitarios-diligenciado.docx'), buffer);
    registrarFaltantes('F5', camposFaltantes);
  }

  return faltantesPorFormato;
}

function imprimirReporteFaltantes(faltantesPorFormato) {
  console.log('\n--- Verificación: marcadores de la plantilla oficial sin dato ---');
  const claves = Object.keys(faltantesPorFormato);
  if (claves.length === 0) {
    console.log('  Ningún marcador de las plantillas .docx quedó sin dato en los 5 casos. ✓');
    return;
  }
  for (const clave of claves) {
    console.log(`  ${clave}: ${[...faltantesPorFormato[clave]].join(', ')}`);
  }
  console.log('  (F4/F8 son .xlsx de celdas fijas, no tienen marcadores {tag} que reportar de esta forma.)');
}

function imprimirResumenFinal(profesionales, casos, faltantesPorFormato) {
  console.log('\n=== Resumen de la demo sembrada ===\n');
  console.log('Profesionales ICBF (correo / contraseña):');
  for (const p of profesionales) console.log(`  - ${p.nombre}: ${p.email} / ${p.password}`);
  console.log('\nCasos-beneficiario (código de acceso, sin cuenta — 8 caracteres):');
  for (const c of casos) console.log(`  - ${c.nombre} [${c.modo}]: código ${c.codigoAcceso}`);
  console.log(`\nDocumentos oficiales generados en: ${SALIDA_DIR}`);
  imprimirReporteFaltantes(faltantesPorFormato);
  console.log('\nPara deshacer todo: node scripts/seed-demo.mjs --reset\n');
}

async function main() {
  if (RESET) await resetDemo();
  else if (await verificarDemoExistente()) {
    console.error('Ya existe una demo sembrada (cuentas @presencia-icbf.demo). Corre con --reset para rehacerla.');
    process.exit(1);
  }

  const profesionales = await crearProfesionalesIcbf();
  const casos = await crearCasosBeneficiarios();
  await sembrarF1YPerfilamiento(casos);
  const asignaciones = await asignarCasos(casos, profesionales);
  const contextoFormatos = await sembrarFormatosProfesional(asignaciones);
  const contextoF5 = await sembrarF5(asignaciones);
  const faltantesPorFormato = await generarExpedientes(contextoFormatos, contextoF5);

  imprimirResumenFinal(profesionales, casos, faltantesPorFormato);
}

main().catch((err) => {
  console.error('\nFalló el seed:', err.message || err);
  process.exit(1);
});
