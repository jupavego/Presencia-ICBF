import { useEffect, useRef, useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import { TextField, SelectField, TextAreaField } from '../ui/Field.jsx';
import CheckboxGrid from '../ui/CheckboxGrid.jsx';
import DataTable from '../ui/DataTable.jsx';
import FormActions from '../ui/FormActions.jsx';
import Tooltip from '../ui/Tooltip.jsx';
import { descargarDocxOficial, formatoFecha } from '../../lib/exportOficial.js';
import { guardarDatosFormatoOficial } from '../../lib/persistenciaCaso.js';
import { useCaso } from '../../context/CasoContext.jsx';
import { useCompromisos } from '../../context/CompromisosContext.jsx';

// El documento oficial de F6 es de texto libre (10 preguntas abiertas)
// -- estas listas de opciones son un agregado propio del formulario web
// (ver docs/exportacion-formatos-oficiales.md). Por eso cada una termina
// en una opción "Otro/a" con campo de detalle, igual que en F5.
const MOTIVOS = ['Fortalecimiento de relaciones familiares.', 'Dificultades en la convivencia familiar.', 'Fortalecimiento de capacidades de cuidado.', 'Necesidad de fortalecer redes de apoyo.', 'Situación relacionada con condiciones económicas.', 'Situación relacionada con acceso a servicios.', 'Necesidad de orientación frente a una situación familiar.', 'Situación relacionada con cambios o transiciones familiares.', 'Interés en fortalecer recursos y capacidades existentes.', 'Solicitud de orientación o acompañamiento frente a una situación específica.', 'Otro motivo'];

const OBJETIVOS = ['Fortalecer capacidades familiares para el cuidado.', 'Fortalecer relaciones y vínculos familiares.', 'Favorecer estrategias para mejorar la convivencia.', 'Fortalecer redes de apoyo familiares y comunitarias.', 'Identificar recursos y fortalezas de la familia.', 'Promover autonomía y toma de decisiones.', 'Fortalecer capacidades para afrontar situaciones familiares.', 'Promover participación y corresponsabilidad familiar.', 'Favorecer la articulación con recursos institucionales o comunitarios.', 'Construir acuerdos y acciones de acompañamiento con la familia.', 'Otro objetivo'];

const HERRAMIENTAS = ['Diálogo para el Cuidado y el Buen Vivir.', 'Entrevista familiar.', 'Escucha activa y conversación reflexiva.', 'Cartografía de redes de apoyo.', 'Mapa de pertenencia.', 'Identificación de recursos y fortalezas familiares.', 'Análisis participativo de situaciones familiares.', 'Ejercicio de construcción de acuerdos.', 'Orientación y fortalecimiento de capacidades.', 'Identificación de necesidades de articulación institucional.', 'Otra herramienta'];

const COMPROMISOS_FAMILIA = ['Participar en los encuentros acordados.', 'Cumplir las fechas y horarios concertados.', 'Informar oportunamente dificultades para asistir.', 'Participar activamente en las actividades propuestas.', 'Implementar acuerdos construidos durante el acompañamiento.', 'Fortalecer prácticas de cuidado acordadas.', 'Activar o fortalecer redes de apoyo identificadas.', 'Realizar gestiones acordadas con otras instituciones o servicios.', 'Compartir información relevante para el desarrollo del acompañamiento.', 'Revisar conjuntamente los avances y dificultades del proceso.', 'Otro compromiso'];

const COMPROMISOS_ICBF = ['Realizar el acompañamiento acordado.', 'Cumplir las fechas y horarios concertados.', 'Brindar orientación relacionada con las necesidades identificadas.', 'Mantener confidencialidad sobre la información suministrada.', 'Realizar seguimiento a los acuerdos establecidos.', 'Facilitar información sobre servicios y recursos disponibles.', 'Orientar sobre rutas institucionales cuando corresponda.', 'Gestionar las articulaciones internas necesarias.', 'Orientar o facilitar articulaciones con actores externos cuando corresponda.', 'Revisar conjuntamente con la familia los resultados del acompañamiento.', 'Otro compromiso institucional'];

const ASPECTOS_COMUNIDAD = ['Existencia de redes familiares activas.', 'Existencia de redes comunitarias activas.', 'Participación de la familia en espacios comunitarios.', 'Disponibilidad de personas significativas para la familia.', 'Presencia de relaciones de solidaridad.', 'Vinculación con organizaciones comunitarias.', 'Acceso a instituciones o servicios del territorio.', 'Potencial para fortalecer redes existentes.', 'Necesidad de ampliar o diversificar redes de apoyo.', 'Identificación de recursos comunitarios susceptibles de activación.', 'Otro aspecto'];

const CONTEXTO_TERRITORIAL = ['Barreras de acceso geográfico.', 'Dificultades de movilidad o transporte.', 'Condiciones de seguridad del territorio.', 'Limitaciones en la oferta institucional.', 'Dificultades de acceso a servicios sociales.', 'Condiciones económicas del territorio.', 'Dinámicas comunitarias que afectan a la familia.', 'Situaciones ambientales o territoriales relevantes.', 'Débil articulación entre actores institucionales y comunitarios.', 'Oportunidades o recursos territoriales susceptibles de aprovechamiento.', 'Otro elemento'];

const RETOS = ['Fortalecer la participación de la familia.', 'Fortalecer redes familiares y comunitarias.', 'Mejorar la articulación institucional.', 'Ampliar el acceso a recursos y servicios.', 'Fortalecer capacidades familiares.', 'Mejorar la continuidad del acompañamiento.', 'Fortalecer el seguimiento a los acuerdos.', 'Aprovechar recursos existentes en el territorio.', 'Generar nuevas estrategias de acompañamiento.', 'Consolidar acciones de autonomía y sostenibilidad del proceso.', 'Otro reto'];

const COMPROMISO_COLUMNS = [
  { key: 'descripcion', label: 'Descripción del Compromiso', placeholder: 'Ej. Participar en próximo encuentro' },
  { key: 'responsable', label: 'Responsable', type: 'select', options: ['Familia', 'ICBF', 'Conjunto'] },
  { key: 'fecha', label: 'Fecha Prevista', type: 'date' },
  { key: 'estado', label: 'Estado', type: 'select', options: ['Pendiente', 'En proceso', 'Cumplido'] },
];
const nuevoCompromiso = () => ({ id: crypto.randomUUID(), descripcion: '', responsable: 'Familia', fecha: '', estado: 'Pendiente', origen: 'F6' });

export default function F6AcompanamientoEntornoFamiliar({ etapaCode, etapaNombre }) {
  const formRef = useRef(null);
  const { casoActivoId } = useCaso();
  const { compromisos: compromisosDelCaso, guardarCompromisos, cargando: cargandoCompromisos } = useCompromisos();
  const [motivoCategoria, setMotivoCategoria] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [herramientas, setHerramientas] = useState([]);
  const [compromisosFamilia, setCompromisosFamilia] = useState([]);
  const [compromisosIcbf, setCompromisosIcbf] = useState([]);
  const [aspectosComunidad, setAspectosComunidad] = useState([]);
  const [contextoTerritorial, setContextoTerritorial] = useState([]);
  const [retos, setRetos] = useState([]);
  const [compromisos, setCompromisos] = useState([nuevoCompromiso()]);
  // Detalle de texto libre de la opción "Otro/a" de cada campo — ver el
  // mismo patrón en F5EncuentrosComunitarios.jsx.
  const [detalles, setDetalles] = useState({});
  function setDetalle(campo, valor) {
    setDetalles((d) => ({ ...d, [campo]: valor }));
  }
  function conDetalle(valor, campo) {
    return valor.startsWith('Otr') && detalles[campo] ? detalles[campo] : valor;
  }
  function listaConDetalle(lista, campo) {
    return lista.map((v) => conDetalle(v, campo));
  }

  // Hidrata la matriz editable con lo que ya tenga guardado el caso activo
  // (compartido con cualquier otro formato que use CompromisosContext). Se
  // re-sincroniza al cambiar de caso y también cuando `cargandoCompromisos`
  // pasa de true a false — el fetch del contexto es async, ver el mismo
  // comentario en F7PerfilSocioFamiliar.jsx.
  useEffect(() => {
    if (cargandoCompromisos) return;
    setCompromisos(compromisosDelCaso.length ? compromisosDelCaso : [nuevoCompromiso()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [casoActivoId, cargandoCompromisos]);

  function actualizarCompromisos(nuevaLista) {
    setCompromisos(nuevaLista);
    guardarCompromisos(nuevaLista);
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert('¡Registro de acompañamiento familiar estructurado con éxito!');
  }

  async function handleExportarOficial() {
    const fd = new FormData(formRef.current);

    const motivo = [conDetalle(motivoCategoria, 'motivoCategoria'), fd.get('motivoDescripcion')].filter(Boolean).join('. ');

    const compromisosFamiliaConDetalle = listaConDetalle(compromisosFamilia, 'compromisosFamilia');
    const matrizTexto = compromisos
      .filter((c) => c.descripcion)
      .map((c) => `Matriz: ${c.descripcion} (${c.responsable}, ${formatoFecha(c.fecha) || 'sin fecha'}, ${c.estado})`)
      .join(' | ');
    const compromisoFamilia = [
      compromisosFamiliaConDetalle.length ? compromisosFamiliaConDetalle.join('; ') : '',
      matrizTexto,
    ].filter(Boolean).join(' | ');

    const datos = {
      fecha: formatoFecha(fd.get('fecha')),
      regional: fd.get('regional') || '',
      centroZonal: fd.get('centroZonal') || '',
      numPeticion: fd.get('numPeticion') || '',
      telefono: fd.get('telefono') || '',
      municipio: fd.get('municipio') || '',
      direccion: fd.get('direccion') || '',
      barrio: fd.get('barrio') || '',
      profesionales: fd.get('profesionales') || '',
      participantes: fd.get('participantes') || '',
      motivo,
      objetivo: conDetalle(objetivo, 'objetivo'),
      herramientas: listaConDetalle(herramientas, 'herramientas').join('; '),
      compromisoFamilia,
      compromisoIcbf: listaConDetalle(compromisosIcbf, 'compromisosIcbf').join('; '),
      aspectosComunidad: listaConDetalle(aspectosComunidad, 'aspectosComunidad').join('; '),
      contextoTerritorial: listaConDetalle(contextoTerritorial, 'contextoTerritorial').join('; '),
      retos: listaConDetalle(retos, 'retos').join('; '),
    };

    await guardarDatosFormatoOficial(casoActivoId, 'F6', datos);
    await descargarDocxOficial(
      '/plantillas/F6-Acompanamiento-Entorno-Familiar.docx',
      datos,
      'F6-Acompanamiento-Entorno-Familiar-diligenciado.docx'
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <FormatHeader
        eyebrow={`${etapaCode} · ${etapaNombre} · Entorno familiar`}
        title="Registro de Acompañamiento Familiar"
        description="Instrumento operativo parametrizado para registrar el encuentro de acompañamiento en el domicilio de la familia, conectando categorías orientadoras con la valoración profesional y la gestión de compromisos."
        metaTitle="F6.GO3.MT5.PP · V2"
        metaSub="Modalidad familiar"
      />

      <Section title="1. Datos iniciales y ubicación" hint="Información general del registro de acompañamiento y profesionales responsables.">
        <div className="grid">
          <TextField name="fecha" label="Fecha del acompañamiento" type="date" required />
          <TextField name="regional" label="Regional" placeholder="Ej. Antioquia" required />
          <TextField name="centroZonal" label="Centro Zonal" placeholder="Ej. Centro Zonal Norte" required />
          <TextField name="numPeticion" label="No. de petición / radicado" required />
          <TextField name="telefono" label="Teléfono de contacto" required />
          <TextField name="municipio" label="Municipio" placeholder="Ej. Girardota" required />
          <TextField name="direccion" label="Dirección" required />
          <TextField name="barrio" label="Barrio / Vereda" required />
          <TextField name="profesionales" span="wide" label="Profesionales que acompañan" placeholder="Nombres y registros profesionales" required />
          <TextAreaField name="participantes" label="Personas que participan (Nombre y rol en la familia)" placeholder="Ej. María Gómez (Madre), Carlos Pérez (Padre)..." required />
        </div>
      </Section>

      <Section title="2. Motivo, necesidad y objetivo">
        <div className="grid">
          <SelectField name="motivoCategoria" span="full" label="Motivo, necesidad o interés orientador" options={MOTIVOS} value={motivoCategoria} onChange={(e) => setMotivoCategoria(e.target.value)} required />
          {motivoCategoria.startsWith('Otr') && (
            <TextField span="full" label="¿Cuál motivo?" value={detalles.motivoCategoria || ''} onChange={(e) => setDetalle('motivoCategoria', e.target.value)} placeholder="Especifique el motivo" />
          )}
          <TextAreaField
            name="motivoDescripcion"
            label="Descripción ampliada del motivo expresado por la familia (Campo narrativo obligatorio)"
            tip="Es la explicación más completa, en palabras de la familia, de la razón por la que solicitan o requieren el acompañamiento."
            placeholder="Describa textualmente y con valoración profesional el motivo expresado..." required
          />
          <SelectField name="objetivo" span="full" label="Objetivo principal del acompañamiento" options={OBJETIVOS} value={objetivo} onChange={(e) => setObjetivo(e.target.value)} required />
          {objetivo.startsWith('Otr') && (
            <TextField span="full" label="¿Cuál objetivo?" value={detalles.objetivo || ''} onChange={(e) => setDetalle('objetivo', e.target.value)} placeholder="Especifique el objetivo" />
          )}
        </div>
      </Section>

      <Section title="3. Herramientas metodológicas utilizadas" hint="Selección múltiple de herramientas aplicadas durante el encuentro.">
        <CheckboxGrid cols={3} options={HERRAMIENTAS} selected={herramientas} onChange={setHerramientas} />
        {herramientas.includes('Otra herramienta') && (
          <div style={{ marginTop: 12 }}>
            <TextField label="¿Cuál otra herramienta?" value={detalles.herramientas || ''} onChange={(e) => setDetalle('herramientas', e.target.value)} placeholder="Describa la herramienta utilizada" />
          </div>
        )}
      </Section>

      <Section title="4. Gestión de compromisos y acuerdos" hint="Tipos de compromiso sugeridos e integración de la matriz de seguimiento (Responsable, Fecha, Estado).">
        <CheckboxGrid
          cols={3}
          label="Tipos de compromiso sugeridos (Familia)"
          tip="Son las acciones que la familia se compromete a realizar como parte del proceso de acompañamiento."
          options={COMPROMISOS_FAMILIA} selected={compromisosFamilia} onChange={setCompromisosFamilia}
        />
        {compromisosFamilia.includes('Otro compromiso') && (
          <div style={{ marginTop: 12 }}>
            <TextField label="¿Cuál otro compromiso de la familia?" value={detalles.compromisosFamilia || ''} onChange={(e) => setDetalle('compromisosFamilia', e.target.value)} placeholder="Describa el compromiso" />
          </div>
        )}

        <div style={{ marginTop: 22 }}>
          <label style={{ marginBottom: 8 }}>
            Matriz de compromisos operativos
            <Tooltip text="Registro detallado de cada compromiso acordado, con su responsable (Familia, ICBF o Conjunto), la fecha prevista y su estado de cumplimiento.">
              <span className="tip-ico">?</span>
            </Tooltip>
          </label>
          <DataTable columns={COMPROMISO_COLUMNS} rows={compromisos} onChange={actualizarCompromisos} newRow={nuevoCompromiso} />
        </div>

        <div style={{ marginTop: 22 }}>
          <CheckboxGrid cols={3} label="Compromisos institucionales del ICBF" options={COMPROMISOS_ICBF} selected={compromisosIcbf} onChange={setCompromisosIcbf} />
          {compromisosIcbf.includes('Otro compromiso institucional') && (
            <div style={{ marginTop: 12 }}>
              <TextField label="¿Cuál otro compromiso del ICBF?" value={detalles.compromisosIcbf || ''} onChange={(e) => setDetalle('compromisosIcbf', e.target.value)} placeholder="Describa el compromiso institucional" />
            </div>
          )}
        </div>
      </Section>

      <Section title="5. Relación familia-comunidad y contexto territorial" hint="Variables clave para el motor de análisis relacional e institucional.">
        <CheckboxGrid cols={3} label="Aspectos potenciales de la relación familia-comunidad" options={ASPECTOS_COMUNIDAD} selected={aspectosComunidad} onChange={setAspectosComunidad} />
        {aspectosComunidad.includes('Otro aspecto') && (
          <div style={{ marginTop: 12 }}>
            <TextField label="¿Cuál otro aspecto?" value={detalles.aspectosComunidad || ''} onChange={(e) => setDetalle('aspectosComunidad', e.target.value)} placeholder="Describa el aspecto" />
          </div>
        )}
        <div style={{ marginTop: 16 }}>
          <CheckboxGrid cols={3} label="Elementos críticos del contexto territorial y/o comunitario" options={CONTEXTO_TERRITORIAL} selected={contextoTerritorial} onChange={setContextoTerritorial} />
          {contextoTerritorial.includes('Otro elemento') && (
            <div style={{ marginTop: 12 }}>
              <TextField label="¿Cuál otro elemento?" value={detalles.contextoTerritorial || ''} onChange={(e) => setDetalle('contextoTerritorial', e.target.value)} placeholder="Describa el elemento del contexto" />
            </div>
          )}
        </div>
      </Section>

      <Section title="6. Retos, oportunidades y cierre">
        <CheckboxGrid cols={3} options={RETOS} selected={retos} onChange={setRetos} />
        {retos.includes('Otro reto') && (
          <div style={{ marginTop: 12 }}>
            <TextField label="¿Cuál otro reto?" value={detalles.retos || ''} onChange={(e) => setDetalle('retos', e.target.value)} placeholder="Describa el reto" />
          </div>
        )}
        <FormActions statusText="✓ Formulario parametrizado · listo para integración" onSaveDraft={() => alert('Borrador guardado localmente.')} submitLabel="Generar Registro →" onExport={handleExportarOficial} />
      </Section>
    </form>
  );
}
