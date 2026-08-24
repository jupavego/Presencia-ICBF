import { useEffect, useRef, useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import { TextField, SelectField, TextAreaField } from '../ui/Field.jsx';
import Choice from '../ui/Choice.jsx';
import CheckboxGrid from '../ui/CheckboxGrid.jsx';
import Callout from '../ui/Callout.jsx';
import FormActions from '../ui/FormActions.jsx';
import { descargarDocxOficial, formatoFecha } from '../../lib/exportOficial.js';
import { guardarDatosFormatoOficial } from '../../lib/persistenciaCaso.js';
import { useCaso } from '../../context/CasoContext.jsx';
import { useFamilia } from '../../context/FamiliaContext.jsx';

const ESTADOS_CIVILES = ['Soltero(a)', 'Casado(a)', 'Unión libre', 'Separado(a)', 'Viudo(a)', 'Divorciado(a)', 'No aplica'];
const NIVELES_ESCOLARES = ['Ninguno', 'Primaria completa', 'Primaria incompleta', 'Secundaria completa', 'Secundaria incompleta', 'Técnico completo', 'Técnico incompleto', 'Universitario completo', 'Universitario incompleto', 'Preescolar', 'Otro'];
const ROLES_FAMILIA = ['Cónyuge o compañero(a) (sin hijos)', 'Madre, padre, cuidadora/or', 'Hija(o), hijastra(o)', 'Hermana(o), hermanastra(o)', 'Sobrina(o), tía(o), prima(o), cuñada(o)', 'Abuela(o)/suegra(o)', 'Nuera/yerno', 'Nieto/a', 'Otra(o) pariente', 'No-pariente'];
const AFILIACIONES_SALUD = ['Subsidiado', 'Contributivo', 'Prepagada', 'Sin afiliación'];
const OCUPACIONES = ['Estudiante', 'Desescolarizado', 'Desempleado(a)', 'Rentista/pensionado(a)', 'Actividades de cuidado en el hogar', 'Empleado(a)', 'Independiente formal', 'Independiente informal', 'No activo(a): bebé menor de 5 años / persona con discapacidad'];
const TIEMPOS_DEDICACION = ['Permanente', 'Temporal', 'Eventual'];

const TRAYECTORIA_SERVICIOS = ['Ninguna', 'Defensoría de Familia', 'Comisaría de Familia', 'Salud', 'Educación', 'Profesional particular', 'Juzgado', 'Organización Comunitaria', 'Alcaldía local', 'ONG', 'Agencia Internacional', 'Policía', 'Medicina Legal', 'Fiscalía', 'Otra'];
const EVENTOS_SIGNIFICATIVOS = ['Violencia intrafamiliar', 'Abuso de SPA', 'Enfermedades', 'Conflicto con la ley de algún integrante', 'Accidentes graves', 'Desplazamiento forzado', 'Muerte de algún integrante', 'Amenazas', 'Rupturas, pérdidas o abandonos', 'Migración', 'Conflictos de pareja', 'Abuso sexual', 'Relacionados con la salud mental', 'Desempleo', 'Alcoholismo', 'Otros'];
const ASPIRACIONES = ['Fortalecer la comunicación familiar', 'Mejorar relaciones y convivencia', 'Fortalecer cuidado y crianza', 'Fortalecer redes de apoyo', 'Mejorar condiciones económicas', 'Acceder a servicios y derechos', 'Fortalecer autonomía y toma de decisiones', 'Manejar una situación familiar específica', 'Fortalecer proyectos educativos', 'Fortalecer proyectos laborales o productivos', 'Mejorar bienestar y buen vivir', 'Fortalecer participación comunitaria', 'Construir acuerdos familiares', 'Reconocer fortalezas y capacidades', 'Prepararse para cambios o transiciones', 'Otra'];
const CONCLUSIONES = ['Respuesta satisfactoria y cierre', 'Nuevo encuentro de Diálogo para el Cuidado y el Buen Vivir', 'Encuentro Comunitario de Cuidado', 'Acompañamiento en el Entorno Familiar', 'Combinación de formas de acompañamiento', 'Profundizar la comprensión de la situación', 'Fortalecer capacidades de cuidado y crianza', 'Fortalecer redes familiares y sociales', 'Orientar acceso a oferta institucional', 'Articular con otra entidad o servicio', 'Hacer seguimiento a acuerdos', 'Fortalecer autonomía', 'Abordar situación familiar priorizada', 'Construir plan de acción con la familia', 'Realizar nueva valoración', 'Otro resultado / conclusión'];
const RUTA_CONTINUIDAD = ['Cierre', 'Nuevo encuentro de Diálogo para el Cuidado y el Buen Vivir', 'Encuentro Comunitario de Cuidado', 'Acompañamiento en el Entorno Familiar', 'Combinación de formas de acompañamiento', 'Otra / por definir'];

const INGRESO_OPCIONES = ['Menos de un salario mínimo', '1 s.m.', '2 s.m.', '3 a 4 s.m.', '5 o más s.m.', 'No sabe / no informa'];
const INGRESO_TAGS = ['ingresoMenosSmX', 'ingreso1SmX', 'ingreso2SmX', 'ingreso3a4SmX', 'ingreso5MasSmX', 'ingresoNoSabeX'];
const VIVIENDA_OPCIONES = ['Propia', 'Familiar', 'En arriendo', 'Usufructo', 'Inquilinato', 'Refugio temporal', 'Paga diario', 'No sabe / no informa'];
const VIVIENDA_TAGS = ['viviendaPropiaX', 'viviendaFamiliarX', 'viviendaArriendoX', 'viviendaUsufructoX', 'viviendaInquilinatoX', 'viviendaRefugioX', 'viviendaPagaDiarioX', 'viviendaNoSabeX'];
const TRAYECTORIA_TAGS = {
  'Ninguna': 'trNingunaX', 'Defensoría de Familia': 'trDefensoriaX', 'Comisaría de Familia': 'trComisariaX',
  'Salud': 'trSaludX', 'Educación': 'trEducacionX', 'Profesional particular': 'trProfesionalX', 'Juzgado': 'trJuzgadoX',
  'Organización Comunitaria': 'trOrganizacionX', 'Alcaldía local': 'trAlcaldiaX', 'ONG': 'trOngX', 'Agencia Internacional': 'trAgenciaX',
  'Policía': 'trPoliciaX', 'Medicina Legal': 'trMedicinaX', 'Fiscalía': 'trFiscaliaX', 'Otra': 'trOtraX',
};
const EVENTO_TAGS = ['ev1X', 'ev2X', 'ev3X', 'ev4X', 'ev5X', 'ev6X', 'ev7X', 'ev8X', 'ev9X', 'ev10X', 'ev11X', 'ev12X', 'ev13X', 'ev14X', 'ev15X', 'ev16X'];

const nuevoIntegrante = () => ({
  id: crypto.randomUUID(),
  nombre: '', edad: '', lugarNacimiento: '', estadoCivil: '', nivelEscolar: '',
  rolFamilia: '', afiliacionSalud: '', ocupacion: '', dedicacion: '',
});

export default function F7PerfilSocioFamiliar({ etapaCode, etapaNombre }) {
  const formRef = useRef(null);
  const { casoActivoId } = useCaso();
  const { integrantes: integrantesDelCaso, guardarIntegrantes, cargando: cargandoFamilia } = useFamilia();
  const [acudenPor, setAcudenPor] = useState('');
  const [recibeSubsidios, setRecibeSubsidios] = useState('');
  const [trayectoria, setTrayectoria] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [aspiraciones, setAspiraciones] = useState([]);
  const [conclusiones, setConclusiones] = useState([]);
  const [integrantes, setIntegrantes] = useState([nuevoIntegrante()]);
  const [modalidadIcbf, setModalidadIcbf] = useState('');
  const [rutaContinuidad, setRutaContinuidad] = useState('');
  // Detalle de texto libre de la opción "Otro/a" — ver el mismo patrón en
  // F5EncuentrosComunitarios.jsx. Reemplaza los campos "¿Cuál?" que
  // vivían siempre visibles debajo de cada lista (trOtraCual,
  // ipOtroCual, aspiracionOtraCual, rutaOtraCual): ahora solo aparecen
  // cuando la opción "Otro/a" está realmente seleccionada.
  const [detalles, setDetalles] = useState({});
  function setDetalle(campo, valor) {
    setDetalles((d) => ({ ...d, [campo]: valor }));
  }
  function esOtro(valor) {
    return typeof valor === 'string' && /^otr[oa]/i.test(valor);
  }
  function conDetalle(valor, campo) {
    return esOtro(valor) && detalles[campo] ? detalles[campo] : valor;
  }
  function listaConDetalle(lista, campo) {
    return lista.map((v) => (esOtro(v) && detalles[campo] ? detalles[campo] : v));
  }
  const [cursoVida, setCursoVida] = useState('');
  const [padre, setPadre] = useState('');
  const [madre, setMadre] = useState('');
  const [ella, setElla] = useState('');
  const [el, setEl] = useState('');
  const [procesos, setProcesos] = useState('');
  const [vidaSocial, setVidaSocial] = useState([]);
  const [institucionesProf, setInstitucionesProf] = useState([]);
  const [ocupacionSocial, setOcupacionSocial] = useState([]);

  // Hidrata la lista editable con lo que ya tenga guardado el caso activo
  // (compartido con cualquier otro formato que use FamiliaContext). Se
  // re-sincroniza al cambiar de caso y también cuando `cargandoFamilia`
  // pasa de true a false — el fetch del contexto es async, así que si
  // este formulario ya estaba montado antes de que la carga terminara,
  // `integrantesDelCaso` seguía en `[]` en el primer render y había que
  // esperar a que terminara de cargar para volver a sincronizar; sin este
  // segundo disparador, la hidratación real llegaba tarde y se perdía.
  useEffect(() => {
    if (cargandoFamilia) return;
    setIntegrantes(integrantesDelCaso.length ? integrantesDelCaso : [nuevoIntegrante()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [casoActivoId, cargandoFamilia]);

  function toggleEnArreglo(arreglo, setArreglo, valor) {
    setArreglo(arreglo.includes(valor) ? arreglo.filter((v) => v !== valor) : [...arreglo, valor]);
  }

  // El texto se sigue editando localmente en cada tecleo (sin esperar red);
  // solo al salir del campo (onBlur, ver JSX) se persiste la lista
  // completa al caso — así no se dispara una escritura por cada letra.
  function updateIntegrante(index, key, value) {
    setIntegrantes(integrantes.map((it, i) => (i === index ? { ...it, [key]: value } : it)));
  }
  function persistirIntegrantes() {
    guardarIntegrantes(integrantes);
  }
  function addIntegrante() {
    const lista = [...integrantes, nuevoIntegrante()];
    setIntegrantes(lista);
    guardarIntegrantes(lista);
  }
  function removeIntegrante(index) {
    if (integrantes.length <= 1) {
      alert('Debe permanecer al menos un integrante para iniciar el registro.');
      return;
    }
    const lista = integrantes.filter((_, i) => i !== index);
    setIntegrantes(lista);
    guardarIntegrantes(lista);
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert('¡Perfil sociofamiliar estructurado con éxito!');
  }

  async function handleExportarOficial() {
    const fd = new FormData(formRef.current);
    const datos = {
      fecha: formatoFecha(fd.get('fecha')),
      regional: fd.get('regional') || '',
      centroZonal: fd.get('centroZonal') || '',
      numPeticion: fd.get('numPeticion') || '',
      profesionales: fd.get('profesionales') || '',
      nombreParticipante: fd.get('nombreParticipante') || '',
      tipoDocumento: fd.get('tipoDocumento') || '',
      rolParticipante: fd.get('rolParticipante') || '',
      participantesEncuentro: fd.get('participantesEncuentro') || '',
      direccion: fd.get('direccion') || '',
      barrio: fd.get('barrio') || '',
      municipio: fd.get('municipio') || '',
      telefono: fd.get('telefono') || '',
      acudenPropiaMarca: acudenPor === 'Propia iniciativa' ? 'X' : '',
      acudenRemitidosMarca: acudenPor === 'Remitidos' ? 'X' : '',
      numAportantes: fd.get('numAportantes') || '',
      subsidiosCual: fd.get('subsidiosCual') || '',
      subsidiosSiMarca: recibeSubsidios === 'Sí' ? 'X' : '',
      subsidiosNoMarca: recibeSubsidios === 'No' ? 'X' : '',
      subsidiosNoInformaMarca: recibeSubsidios === 'No informa' ? 'X' : '',
      relatoFamilia: fd.get('relatoFamilia') || '',
      familiaExtensa: fd.get('familiaExtensa') || '',
      otrasPersonas: fd.get('otrasPersonas') || '',
      hijosUnionActual: fd.get('hijosUnionActual') || '',
      hijosUnionAnterior: fd.get('hijosUnionAnterior') || '',
      padreX: padre === 'Sí' ? 'X' : '',
      madreX: madre === 'Sí' ? 'X' : '',
      ellaNum: ella || '',
      elNum: el || '',
      procesosSiMarca: procesos === 'Sí' ? 'X' : '',
      procesosNoMarca: procesos === 'No' ? 'X' : '',
      procesosCuales: fd.get('procesosCuales') || '',
      modalidadIcbf: conDetalle(modalidadIcbf, 'modalidadIcbf'),
      ipOtroCual: detalles.institucionesProf || '',
      trOtraCual: detalles.trayectoria || '',
    };

    INGRESO_OPCIONES.forEach((opt, i) => { datos[INGRESO_TAGS[i]] = ''; });
    const ingresoSel = fd.get('ingreso');
    const ingresoIdx = INGRESO_OPCIONES.indexOf(ingresoSel);
    if (ingresoIdx >= 0) datos[INGRESO_TAGS[ingresoIdx]] = 'X';

    VIVIENDA_OPCIONES.forEach((opt, i) => { datos[VIVIENDA_TAGS[i]] = ''; });
    const viviendaSel = fd.get('vivienda');
    const viviendaIdx = VIVIENDA_OPCIONES.indexOf(viviendaSel);
    if (viviendaIdx >= 0) datos[VIVIENDA_TAGS[viviendaIdx]] = 'X';

    Object.values(TRAYECTORIA_TAGS).forEach((tag) => { datos[tag] = ''; });
    trayectoria.forEach((label) => {
      const tag = TRAYECTORIA_TAGS[label];
      if (tag) datos[tag] = 'X';
    });

    EVENTO_TAGS.forEach((tag) => { datos[tag] = ''; });
    eventos.forEach((label) => {
      const idx = EVENTOS_SIGNIFICATIVOS.indexOf(label);
      if (idx >= 0) datos[EVENTO_TAGS[idx]] = 'X';
    });

    datos.vsAmigosX = vidaSocial.includes('Amigos') ? 'X' : '';
    datos.vsVecinosX = vidaSocial.includes('Vecinos') ? 'X' : '';
    datos.vsGruposX = vidaSocial.includes('Grupos informales') ? 'X' : '';
    datos.vsFamiliaX = vidaSocial.includes('Familia') ? 'X' : '';
    datos.ipSaludX = institucionesProf.includes('Salud') ? 'X' : '';
    datos.ipJusticiaX = institucionesProf.includes('Justicia') ? 'X' : '';
    datos.ipIglesiaX = institucionesProf.includes('Iglesia') ? 'X' : '';
    datos.ipOtroX = institucionesProf.includes('Otro') ? 'X' : '';
    datos.ocEstudioX = ocupacionSocial.includes('Estudio') ? 'X' : '';
    datos.ocTrabajoX = ocupacionSocial.includes('Trabajo') ? 'X' : '';

    const aspiracionesConDetalle = listaConDetalle(aspiraciones, 'aspiraciones');
    datos.aspiracionesTexto = [
      aspiracionesConDetalle.length ? aspiracionesConDetalle.join('; ') : '',
      fd.get('aspiracionExpectativa') ? `Expectativa: ${fd.get('aspiracionExpectativa')}` : '',
    ].filter(Boolean).join(' | ');

    const conclusionesConDetalle = listaConDetalle(conclusiones, 'conclusiones');
    datos.conclusionesTexto = [
      conclusionesConDetalle.length ? conclusionesConDetalle.join('; ') : '',
      fd.get('conclusionNarrativa') ? `Conclusión: ${fd.get('conclusionNarrativa')}` : '',
    ].filter(Boolean).join(' | ');

    datos.acuerdosTexto = [
      fd.get('acuerdosCompromisos') ? `Acuerdos: ${fd.get('acuerdosCompromisos')}` : '',
      rutaContinuidad ? `Ruta: ${conDetalle(rutaContinuidad, 'rutaContinuidad')}` : '',
    ].filter(Boolean).join(' | ');

    datos.integrantes = integrantes
      .filter((it) => it.nombre)
      .map((it) => ({
        nombre: it.nombre || '', edad: it.edad || '', lugarNacimiento: it.lugarNacimiento || '',
        estadoCivil: it.estadoCivil || '', nivelEscolar: it.nivelEscolar || '', rolFamilia: it.rolFamilia || '',
        afiliacionSalud: it.afiliacionSalud || '', ocupacion: it.ocupacion || '', dedicacion: it.dedicacion || '',
      }));
    if (datos.integrantes.length === 0) {
      datos.integrantes = [{ nombre: '', edad: '', lugarNacimiento: '', estadoCivil: '', nivelEscolar: '', rolFamilia: '', afiliacionSalud: '', ocupacion: '', dedicacion: '' }];
    }

    await guardarDatosFormatoOficial(casoActivoId, 'F7', datos);
    await descargarDocxOficial(
      '/plantillas/F7-Perfil-Socio-Familiar.docx',
      datos,
      'F7-Perfil-Socio-Familiar-diligenciado.docx'
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <FormatHeader
        eyebrow={`${etapaCode} · ${etapaNombre} · Perfil familiar`}
        title="Comprender a la familia"
        description="Espacio digital para construir el Perfil Sociofamiliar a partir de la conversación con la familia. La estructura toma como base el F7.GO3.MT5.PP y lo convierte en una experiencia de trabajo por componentes, no en una copia literal del documento."
        metaTitle="F7.GO3.MT5.PP · V2"
        metaSub="Fuente: Ficha de Perfil Sociofamiliar"
      />

      <Section title="1. Datos iniciales" hint="Información de apertura de la historia sociofamiliar.">
        <div className="grid">
          <TextField name="fecha" label="Fecha de apertura" type="date" />
          <TextField name="regional" label="Regional" placeholder="Ej. Antioquia" />
          <TextField name="centroZonal" label="Centro Zonal" placeholder="Ej. Centro Zonal Norte" />
          <TextField name="numPeticion" label="No. de petición" />
          <TextField name="profesionales" span="wide" label="Profesionales que acompañan" />
        </div>
      </Section>

      <Section title="2. Persona participante" hint="Registrar los datos de la persona a la cual se le haya creado el beneficiario en el SIM.">
        <div className="grid">
          <TextField name="nombreParticipante" span="wide" label="Nombre" />
          <TextField name="tipoDocumento" label="Tipo y número de identificación" />
          <TextField name="rolParticipante" label="Rol en el grupo familiar" />
        </div>
      </Section>

      <Section title="3. Encuentro inicial" hint="Personas que participan en el encuentro inicial de Diálogos por el cuidado y el buen vivir.">
        <div className="grid">
          <TextAreaField name="participantesEncuentro" label="Participantes: nombre, documento y rol familiar" />
          <TextField name="direccion" label="Dirección" />
          <TextField name="barrio" label="Barrio" />
          <TextField name="municipio" label="Municipio" />
          <TextField name="telefono" label="Teléfono" />
          <Choice label="Acuden por" name="acudenPor" options={['Propia iniciativa', 'Remitidos']} value={acudenPor} onChange={setAcudenPor} />
        </div>
      </Section>

      <Section title="4. Información sociodemográfica" hint="Variables económicas, de vivienda y apoyos sociales contempladas por la ficha.">
        <div className="grid">
          <SelectField
            name="ingreso"
            label="Ingreso mensual aproximado"
            tip="Son los ingresos o recursos económicos que recibe el núcleo familiar en un mes, sumando los aportes de todos sus integrantes (salarios, subsidios, actividades informales, etc.)."
            options={INGRESO_OPCIONES}
          />
          <SelectField
            name="vivienda"
            label="Vivienda"
            tip="Indica el tipo de tenencia del lugar donde vive la familia. Usufructo: uso de una vivienda que no es propia. Inquilinato: habitación arrendada dentro de una vivienda compartida con otros hogares."
            options={VIVIENDA_OPCIONES}
          />
          <TextField name="numAportantes" label="Personas que aportan económicamente" type="number" />
          <Choice span="wide" label="¿Recibe subsidios?" name="subsidios" options={['Sí', 'No', 'No informa']} value={recibeSubsidios} onChange={setRecibeSubsidios} />
          <TextField name="subsidiosCual" label="¿Cuál?" />
        </div>
      </Section>

      <Section title="5. Situación que motiva el contacto" hint="Relato textual de la familia.">
        <TextAreaField
          name="relatoFamilia"
          span="full"
          label="Relato de la familia"
          tip="Es la descripción, en las propias palabras de la familia, del motivo o la situación que la lleva a acudir al servicio Presencia."
          placeholder="Registrar el relato de la familia, conservando su sentido y su voz."
        />
      </Section>

      <Section title="6. Información de otros miembros de la familia" hint='Registre a cada integrante de la familia. Las categorías del F7 están incorporadas directamente en las listas desplegables.'>
        {integrantes.map((it, i) => (
          <div className="repeater-item" key={it.id || i}>
            <div className="repeater-head">
              <span className="repeater-num">INTEGRANTE {String(i + 1).padStart(2, '0')}</span>
              <button type="button" className="remove-row" onClick={() => removeIntegrante(i)}>Eliminar</button>
            </div>
            <div className="grid">
              <TextField span="col-3" label="Nombre y apellido" placeholder="Nombre completo" value={it.nombre} onChange={(e) => updateIntegrante(i, 'nombre', e.target.value)} onBlur={persistirIntegrantes} />
              <TextField span="col-3" label="Edad" type="number" min="0" value={it.edad} onChange={(e) => updateIntegrante(i, 'edad', e.target.value)} onBlur={persistirIntegrantes} />
              <TextField span="col-3" label="Lugar de nacimiento" value={it.lugarNacimiento} onChange={(e) => updateIntegrante(i, 'lugarNacimiento', e.target.value)} onBlur={persistirIntegrantes} />
              <SelectField span="col-3" label="Estado civil" options={ESTADOS_CIVILES} value={it.estadoCivil} onChange={(e) => updateIntegrante(i, 'estadoCivil', e.target.value)} onBlur={persistirIntegrantes} />
              <SelectField span="col-3" label="Nivel escolar" options={NIVELES_ESCOLARES} value={it.nivelEscolar} onChange={(e) => updateIntegrante(i, 'nivelEscolar', e.target.value)} onBlur={persistirIntegrantes} />
              <SelectField span="col-3" label="Rol en la familia" options={ROLES_FAMILIA} value={it.rolFamilia} onChange={(e) => updateIntegrante(i, 'rolFamilia', e.target.value)} onBlur={persistirIntegrantes} />
              <SelectField span="col-3" label="Afiliación a salud" options={AFILIACIONES_SALUD} value={it.afiliacionSalud} onChange={(e) => updateIntegrante(i, 'afiliacionSalud', e.target.value)} onBlur={persistirIntegrantes} />
              <SelectField span="col-3" label="Actividad económica / ocupación" options={OCUPACIONES} value={it.ocupacion} onChange={(e) => updateIntegrante(i, 'ocupacion', e.target.value)} onBlur={persistirIntegrantes} />
              <SelectField span="col-3" label="Tiempo de dedicación" options={TIEMPOS_DEDICACION} value={it.dedicacion} onChange={(e) => updateIntegrante(i, 'dedicacion', e.target.value)} onBlur={persistirIntegrantes} />
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <button type="button" className="btn-add" onClick={addIntegrante}>＋ Agregar integrante</button>
          <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{integrantes.length} integrante{integrantes.length === 1 ? '' : 's'} registrado{integrantes.length === 1 ? '' : 's'}</span>
        </div>
        <Callout>
          <b>Diseño:</b> cada integrante ocupa una sola tarjeta. Las listas están parametrizadas con las categorías del F7 y no se muestran como catálogos independientes.
        </Callout>
      </Section>

      <Section title="7. Curso de vida y trayectoria institucional">
        <div className="grid">
          <Choice span="full" label="Momento del curso de vida" name="cursoVida" options={['Sin hijos', 'Preescolar 0–6', 'Escolar 7–11', 'Adolescente 12–18', 'Joven 19–28', 'Adulto >28']} value={cursoVida} onChange={setCursoVida} />
          <TextAreaField name="entidadesCursoVida" label="Entidades o profesionales que han intervenido" />
        </div>
      </Section>

      <Section title="8. Trayectoria con otros servicios sociales" hint="Entidades o profesionales que han intervenido en el manejo de la situación que motiva el contacto con el ICBF. Selección múltiple.">
        <CheckboxGrid
          cols={4}
          label="Entidades o profesionales que han intervenido"
          tip="Son las entidades o profesionales que ya han intervenido en el manejo de la situación que motiva el contacto (salud, defensoría, comisaría, educación, entre otras)."
          options={TRAYECTORIA_SERVICIOS} selected={trayectoria} onChange={setTrayectoria}
        />
        {trayectoria.some(esOtro) && (
          <div className="grid" style={{ marginTop: 10 }}>
            <TextField span="full" label='¿Cuál "Otra"?' value={detalles.trayectoria || ''} onChange={(e) => setDetalle('trayectoria', e.target.value)} />
          </div>
        )}
      </Section>

      <Section title="9. Subsistemas que conviven" hint="Composición relacional de la familia y de las uniones actuales o anteriores.">
        <div className="grid">
          <Choice
            label="Padre"
            tip="Indica si la figura paterna hace parte del grupo familiar actual, independientemente de si convive con la familia."
            name="padre" options={['Sí', 'No']} value={padre} onChange={setPadre}
          />
          <Choice label="Madre" name="madre" options={['Sí', 'No']} value={madre} onChange={setMadre} />
          <TextField name="hijosUnionActual" label="Hijos de la unión actual" type="number" min="0" placeholder="Cantidad" />
          <TextField name="hijosUnionAnterior" label="Hijos de uniones anteriores" type="number" min="0" placeholder="Cantidad" />
          <TextAreaField name="familiaExtensa" label="Miembros de la familia extensa" placeholder="Especificar." />
          <TextAreaField name="otrasPersonas" label="Otras personas" placeholder="Especificar." />
          <Choice label="Número de la unión actual · de ella" name="ella" options={['1', '2', '3', '4']} value={ella} onChange={setElla} />
          <Choice label="Número de la unión actual · de él" name="el" options={['1', '2', '3', '4']} value={el} onChange={setEl} />
        </div>
      </Section>

      <Section title="10. Eventos significativos y otros procesos" hint="Eventos vividos en el último año o muy significativos en la historia familiar. Marque con una X.">
        <CheckboxGrid
          cols={4}
          label="Eventos vividos por la familia"
          tip="Son situaciones vividas por la familia en el último año, o que han sido especialmente significativas en su historia, y que pueden influir en su dinámica actual."
          options={EVENTOS_SIGNIFICATIVOS} selected={eventos} onChange={setEventos}
        />
        <div className="grid" style={{ marginTop: 12 }}>
          <Choice label="¿Actualmente están incursos en otros procesos?" name="procesos" options={['No', 'Sí']} value={procesos} onChange={setProcesos} />
          <TextField name="procesosCuales" span="wide" label="¿Cuáles?" placeholder="Legales, terapéuticos, médicos, etc." />
          <SelectField name="modalidadIcbf" span="full" label="Modalidad para el restablecimiento de derechos del ICBF, si aplica" options={['Hogar sustituto', 'Hogar de paso', 'Internado', 'Casa hogar', 'Casa de acogida', 'Apoyo y fortalecimiento a la familia', 'Intervención de apoyo', 'Externado', 'Seminternado', 'Centro de emergencia', 'Hogar gestor', 'Acogimiento familiar', 'Acogimiento residencial', 'Medida en medio familiar', 'Otra modalidad / medida']} value={modalidadIcbf} onChange={(e) => setModalidadIcbf(e.target.value)} />
          {esOtro(modalidadIcbf) && (
            <TextField span="full" label='¿Cuál "Otra modalidad / medida"?' value={detalles.modalidadIcbf || ''} onChange={(e) => setDetalle('modalidadIcbf', e.target.value)} />
          )}
        </div>
        <Callout><b>Control documental:</b> catálogo preliminar de parametrización; debe validarse contra el catálogo vigente del ICBF antes de producción.</Callout>
      </Section>

      <Section title="11. Relaciones con familia extensa y red social" hint="Cuando tienen una dificultad económica, de salud, de labores de cuidado u otras, ¿a quiénes acuden?">
        <div className="grid">
          <TextAreaField name="respuestaFamiliaRed" label="Respuesta de la familia" />
          <div className="field"><label>Vida social</label><div className="check-stack">
            <label><input type="checkbox" checked={vidaSocial.includes('Amigos')} onChange={() => toggleEnArreglo(vidaSocial, setVidaSocial, 'Amigos')} /> Amigos</label>
            <label><input type="checkbox" checked={vidaSocial.includes('Vecinos')} onChange={() => toggleEnArreglo(vidaSocial, setVidaSocial, 'Vecinos')} /> Vecinos</label>
            <label><input type="checkbox" checked={vidaSocial.includes('Grupos informales')} onChange={() => toggleEnArreglo(vidaSocial, setVidaSocial, 'Grupos informales')} /> Grupos informales</label>
            <label><input type="checkbox" checked={vidaSocial.includes('Familia')} onChange={() => toggleEnArreglo(vidaSocial, setVidaSocial, 'Familia')} /> Familia</label>
          </div></div>
          <div className="field"><label>Instituciones y profesionales</label><div className="check-stack">
            <label><input type="checkbox" checked={institucionesProf.includes('Salud')} onChange={() => toggleEnArreglo(institucionesProf, setInstitucionesProf, 'Salud')} /> Salud</label>
            <label><input type="checkbox" checked={institucionesProf.includes('Justicia')} onChange={() => toggleEnArreglo(institucionesProf, setInstitucionesProf, 'Justicia')} /> Justicia</label>
            <label><input type="checkbox" checked={institucionesProf.includes('Iglesia')} onChange={() => toggleEnArreglo(institucionesProf, setInstitucionesProf, 'Iglesia')} /> Iglesia</label>
            <label><input type="checkbox" checked={institucionesProf.includes('Otro')} onChange={() => toggleEnArreglo(institucionesProf, setInstitucionesProf, 'Otro')} /> Otro</label>
          </div></div>
          <div className="field"><label>Ocupación</label><div className="check-stack">
            <label><input type="checkbox" checked={ocupacionSocial.includes('Estudio')} onChange={() => toggleEnArreglo(ocupacionSocial, setOcupacionSocial, 'Estudio')} /> Estudio</label>
            <label><input type="checkbox" checked={ocupacionSocial.includes('Trabajo')} onChange={() => toggleEnArreglo(ocupacionSocial, setOcupacionSocial, 'Trabajo')} /> Trabajo</label>
          </div></div>
          {institucionesProf.includes('Otro') && (
            <TextField span="wide" label="Otro, ¿cuál?" value={detalles.institucionesProf || ''} onChange={(e) => setDetalle('institucionesProf', e.target.value)} />
          )}
        </div>
      </Section>

      <Section title="12. Proyectos / aspiraciones de la familia" hint="¿Qué expectativas tiene la familia de este acompañamiento? Selección múltiple + respuesta abierta.">
        <CheckboxGrid cols={3} options={ASPIRACIONES} selected={aspiraciones} onChange={setAspiraciones} />
        <div className="grid" style={{ marginTop: 10 }}>
          <TextAreaField name="aspiracionExpectativa" label="Expectativa expresada por la familia" />
          {aspiraciones.some(esOtro) && (
            <TextField span="full" label='¿Cuál "Otra"?' value={detalles.aspiraciones || ''} onChange={(e) => setDetalle('aspiraciones', e.target.value)} />
          )}
        </div>
      </Section>

      <Section title="13. Conclusiones y compromisos" hint="Orientadores estructurados para la decisión. La conclusión narrativa y los acuerdos conservan la valoración profesional y lo construido con la familia.">
        <CheckboxGrid options={CONCLUSIONES} selected={conclusiones} onChange={setConclusiones} />
        {conclusiones.some(esOtro) && (
          <div className="grid" style={{ marginTop: 10 }}>
            <TextField span="full" label='¿Cuál "Otro resultado / conclusión"?' value={detalles.conclusiones || ''} onChange={(e) => setDetalle('conclusiones', e.target.value)} />
          </div>
        )}
        <div className="grid" style={{ marginTop: 12 }}>
          <TextAreaField name="conclusionNarrativa" label="Conclusión narrativa" placeholder="Propuestas adecuadas a la expectativa de la familia, respuesta brindada y decisión de continuidad o cierre." />
          <TextAreaField name="acuerdosCompromisos" label="Acuerdos y compromisos" placeholder="Qué se acordó, quién participa y qué acción se realizará." />
          <SelectField name="rutaContinuidad" span="full" label="Ruta de continuidad propuesta" options={RUTA_CONTINUIDAD} value={rutaContinuidad} onChange={(e) => setRutaContinuidad(e.target.value)} />
          {esOtro(rutaContinuidad) && (
            <TextField span="full" label='¿Cuál "Otra / por definir"?' value={detalles.rutaContinuidad || ''} onChange={(e) => setDetalle('rutaContinuidad', e.target.value)} />
          )}
        </div>
      </Section>

      <Section title="14. Validación del perfil">
        <Callout variant="warn"><b>Salida documental</b><br />Las selecciones alimentan la trazabilidad y el análisis; la narrativa conserva el componente cualitativo. La información queda preparada para generar posteriormente el F7 institucional.</Callout>
        <FormActions statusText="✓ Perfil estructurado · listo para revisión profesional" onSaveDraft={() => alert('Borrador guardado localmente.')} submitLabel="Validar perfil →" onExport={handleExportarOficial} />
      </Section>
    </form>
  );
}
