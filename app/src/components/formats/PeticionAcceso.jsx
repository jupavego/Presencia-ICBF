import { useRef, useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import { TextField, SelectField, TextAreaField } from '../ui/Field.jsx';
import Choice from '../ui/Choice.jsx';
import OptionGrid from '../ui/OptionGrid.jsx';
import CheckboxGrid from '../ui/CheckboxGrid.jsx';
import Callout from '../ui/Callout.jsx';
import FormActions from '../ui/FormActions.jsx';
import { MUNICIPIOS_ANTIOQUIA } from '../../data/municipiosAntioquia.js';
import { useCaso } from '../../context/CasoContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const ORIGENES = [
  { value: 'propia', label: 'Iniciativa propia', desc: 'La familia solicita directamente el acompañamiento.' },
  { value: 'remision', label: 'Remisión', desc: 'La familia llega remitida por otra entidad o servicio.' },
  { value: 'autoridad', label: 'Autoridad administrativa o judicial', desc: 'Ingreso derivado de una autoridad competente.' },
  { value: 'icbf', label: 'Canal institucional ICBF', desc: 'Ingreso mediante otro canal de atención institucional.' },
  { value: 'otro', label: 'Otro', desc: 'Otra forma de contacto.' },
];

const TIPOS_DOCUMENTO = ['Registro civil', 'Tarjeta de identidad', 'Cédula de ciudadanía', 'Cédula de extranjería', 'Permiso por Protección Temporal', 'Otro'];
const ROLES_FAMILIA = ['Madre', 'Padre', 'Cuidador/a', 'Hijo/a', 'Otro familiar', 'Persona interesada', 'Otro'];
const CANALES = ['Presencial', 'Telefónico', 'Virtual', 'Escrito', 'Centro Zonal', 'Otro'];
const INGRESOS = ['Menos de 1 salario mínimo', '1 salario mínimo', '2 salarios mínimos', '3 a 4 salarios mínimos', '5 o más salarios mínimos', 'No sabe / no informa'];
const APORTANTES = ['0', '1', '2', '3', '4 o más', 'No sabe / no informa'];
const VIVIENDAS = ['Propia', 'Familiar', 'En arriendo', 'Usufructo / ocupante de hecho', 'Inquilinato', 'Refugio temporal / albergue', 'Paga diario', 'Otra', 'No sabe / no informa'];
const TIPOS_APOYO = [
  { value: 'educacion', label: 'Educación' }, { value: 'salud', label: 'Salud' }, { value: 'vivienda', label: 'Vivienda' },
  { value: 'alimentacion', label: 'Alimentación' }, { value: 'recreacion', label: 'Recreación' },
  { value: 'transferencia', label: 'Transferencia económica' }, { value: 'otro', label: 'Otro' },
];
const GRUPOS_ETNICOS = ['Indígena', 'Negra / afrocolombiana', 'Raizal', 'Palenquera', 'Rrom / gitana', 'Otra pertenencia étnica', 'Otra comunidad / colectivo'];
const COMUNIDADES = ['Comunidad indígena', 'Consejo comunitario', 'Organización comunitaria', 'Organización campesina', 'Junta de Acción Comunal', 'Organización de mujeres', 'Organización juvenil', 'Organización de personas con discapacidad', 'Organización de víctimas', 'Organización cultural', 'Organización religiosa', 'Otra'];
const MOTIVOS = [
  'Dificultades de convivencia familiar', 'Dificultades en las relaciones familiares', 'Transición o cambio significativo',
  'Cambios en la estructura familiar', 'Conflictos o separación de pareja', 'Dificultades relacionadas con el cuidado',
  'Pérdida o fallecimiento significativo', 'Dificultades económicas o laborales', 'Situaciones relacionadas con salud',
  'Necesidad de fortalecer redes de apoyo', 'Fortalecimiento de capacidades familiares', 'Situación relacionada con el entorno comunitario',
  'Otra situación',
];
const EXPECTATIVAS = [
  { value: 'convivencia', label: 'Mejorar la convivencia', desc: 'Fortalecer las relaciones familiares.' },
  { value: 'comunicacion', label: 'Mejorar la comunicación', desc: 'Encontrar nuevas formas de conversar.' },
  { value: 'capacidades', label: 'Fortalecer capacidades', desc: 'Desarrollar herramientas familiares.' },
  { value: 'vinculos', label: 'Fortalecer vínculos', desc: 'Mejorar vínculos significativos.' },
  { value: 'redes', label: 'Fortalecer redes', desc: 'Reconocer y activar apoyos.' },
  { value: 'orientacion', label: 'Recibir orientación', desc: 'Comprender mejor la situación.' },
  { value: 'autonomia', label: 'Fortalecer autonomía', desc: 'Desarrollar recursos familiares.' },
  { value: 'comunidad', label: 'Fortalecer relación comunitaria', desc: 'Reconocer recursos del entorno.' },
];

function evaluarOrientacion(alerta) {
  if (alerta === 'si') {
    return {
      clase: 'yellow',
      codigo: 'ORIENTACIÓN · VALORACIÓN',
      titulo: 'Se requiere valoración profesional',
      texto: 'La información registrada contiene un elemento que requiere valoración profesional antes de definir la ruta de continuidad. Este registro no determina automáticamente una ruta institucional.',
    };
  }
  if (alerta === 'duda') {
    return {
      clase: 'blue',
      codigo: 'ORIENTACIÓN · PROFUNDIZAR',
      titulo: 'Se recomienda profundizar en la situación',
      texto: 'La información disponible requiere ser ampliada durante la etapa de Comprensión antes de establecer una orientación definitiva.',
    };
  }
  return {
    clase: 'green',
    codigo: 'PRESENCIA · CONTINUAR',
    titulo: 'La solicitud puede continuar hacia Comprensión',
    texto: 'La información inicial registrada permite continuar con la etapa de Comprensión, donde se profundizará en la situación, contexto, capacidades, necesidades y redes de la familia.',
  };
}

export default function PeticionAcceso({ etapaCode, etapaNombre }) {
  const formRef = useRef(null);
  const { crearCaso } = useCaso();
  const { session } = useAuth();
  const [origen, setOrigen] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [zona, setZona] = useState('');
  const [subsidios, setSubsidios] = useState('');
  const [tiposApoyo, setTiposApoyo] = useState([]);
  const [pertenencia, setPertenencia] = useState('');
  const [motivo, setMotivo] = useState('');
  const [expectativas, setExpectativas] = useState([]);
  const [alerta, setAlerta] = useState('');
  const [resultado, setResultado] = useState(null);
  const [errorCaso, setErrorCaso] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(formRef.current);
    const nombre = (fd.get('nombre') || '').trim();

    if (!nombre || !municipio || !motivo || !origen) {
      setResultado({
        clase: 'yellow',
        codigo: 'INFORMACIÓN INCOMPLETA',
        titulo: 'Completa los datos esenciales',
        texto: 'Para registrar la petición se requiere identificar a la persona solicitante, el origen, el municipio y el motivo principal del contacto.',
        resumen: null,
      });
      return;
    }

    // Esta petición es el punto donde nace el caso: crea la fila raíz en
    // Supabase y la deja como caso activo para que el resto de formatos y
    // herramientas (F1-F10, Módulo de Perfilamiento) cuelguen sus datos
    // de este mismo id — ver CasoContext.jsx.
    setErrorCaso(null);
    try {
      await crearCaso({ nombreParticipante: nombre, municipio });
    } catch (err) {
      setErrorCaso(
        session
          ? 'No se pudo registrar el caso en el servidor. La orientación se muestra igual, pero los datos de esta petición no quedaron guardados — intente de nuevo.'
          : 'La orientación se muestra igual, pero para que esta petición quede guardada como un caso real necesita iniciar sesión (botón arriba a la derecha).'
      );
    }

    const lectura = evaluarOrientacion(alerta);
    setResultado({
      ...lectura,
      resumen: {
        municipio,
        zona: zona || 'No registrado',
        ingreso: fd.get('ingreso') || 'No informado',
        vivienda: fd.get('vivienda') || 'No informado',
        pertenencia: pertenencia === 'si' ? 'Sí' : pertenencia === 'no' ? 'No' : 'No informado',
        motivo,
        expectativas: expectativas.length,
        origen: ORIGENES.find((o) => o.value === origen)?.label || origen,
      },
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <FormatHeader
        eyebrow={`${etapaCode} · ${etapaNombre} · Petición de vinculación`}
        title="Petición de Vinculación al Servicio"
        description="Formato propio de la plataforma, complementario al registro en el Sistema de Información Oficial. Recoge cómo llega la familia, quién solicita el servicio, dónde se encuentra, sus condiciones de contexto, su pertenencia y el motivo que origina el contacto, para orientar el paso hacia Comprensión y Planificación Familiar."
        metaTitle="Formato propio · Presencia"
        metaSub="Complementario al registro SIO"
      />

      <Callout>
        <b>¿Qué significa este registro?</b><br />
        Esta información permite construir el contexto inicial de la solicitud y orientar el siguiente momento del proceso. Las variables territoriales, socioeconómicas, culturales y familiares sirven para caracterizar la situación y apoyar la valoración profesional.
      </Callout>

      <Section title="1. Origen de la petición" hint="Identifica cómo llega la familia al servicio.">
        <OptionGrid name="origen" options={ORIGENES} selected={origen} onChange={setOrigen} />
      </Section>

      <Section title="2. Identificación inicial" hint="Información básica de la persona que realiza la solicitud.">
        <div className="grid">
          <TextField name="nombre" label="Nombre completo" required placeholder="Nombre y apellidos" />
          <SelectField name="tipoDocumento" label="Tipo de identificación" options={TIPOS_DOCUMENTO} />
          <TextField name="documento" label="Número de identificación" />
          <SelectField name="rol" label="Rol en la familia" options={ROLES_FAMILIA} />
          <TextField name="telefono" label="Teléfono" type="tel" placeholder="Número de contacto" />
          <SelectField name="canal" label="Canal de contacto" options={CANALES} />
        </div>
      </Section>

      <Section title="3. Caracterización territorial" hint="Ubicación de la familia. El municipio se selecciona desde el catálogo territorial de Antioquia para evitar inconsistencias de escritura.">
        <div className="grid">
          <SelectField label="Departamento" options={['Antioquia']} placeholder="" defaultValue="Antioquia" disabled />
          <SelectField
            name="municipio" label="Municipio" required
            options={MUNICIPIOS_ANTIOQUIA} placeholder="Seleccione municipio"
            value={municipio} onChange={(e) => setMunicipio(e.target.value)}
          />
          <SelectField name="zona" label="Zona" options={['Urbana', 'Rural', 'Rural dispersa']} value={zona} onChange={(e) => setZona(e.target.value)} />
          <TextField name="sector" label="Barrio / vereda / corregimiento" placeholder="Nombre del sector" />
          <TextField
            name="centroZonal" label="Centro Zonal"
            tip="Este campo queda preparado para asociarse automáticamente con el municipio mediante una tabla maestra territorial."
            placeholder="Se define según municipio"
          />
        </div>
        {municipio && (
          <Callout>
            <b>Territorio registrado.</b> Municipio seleccionado: <b>{municipio}</b>. La plataforma podrá asociar posteriormente este municipio con su subregión y Centro Zonal mediante una tabla maestra territorial.
          </Callout>
        )}
      </Section>

      <Section title="4. Caracterización socioeconómica" hint="Permite comprender las condiciones materiales y económicas del hogar.">
        <div className="grid">
          <SelectField name="ingreso" label="Ingreso mensual aproximado del hogar" options={INGRESOS} />
          <SelectField name="aportantes" label="Personas que aportan económicamente" options={APORTANTES} />
          <SelectField name="vivienda" label="Tenencia de la vivienda" options={VIVIENDAS} />
          <Choice label="¿Recibe subsidios o apoyos?" name="subsidios" options={['Sí', 'No', 'No informa']} value={subsidios} onChange={setSubsidios} />
        </div>
        {subsidios === 'Sí' && (
          <div style={{ marginTop: 16 }}>
            <OptionGrid label="Tipo de apoyo o subsidio" options={TIPOS_APOYO} selected={tiposApoyo} onChange={setTiposApoyo} multiple cols={4} />
          </div>
        )}
      </Section>

      <Section title="5. Pertenencia étnica y comunitaria" hint="Permite reconocer elementos culturales, comunitarios y de pertenencia que pueden ser relevantes para el acompañamiento.">
        <Choice
          span="full"
          label="¿La persona o familia se reconoce como perteneciente a algún grupo étnico o comunidad?"
          name="pertenencia" options={['Sí', 'No', 'No sabe / no informa', 'Prefiere no responder']}
          value={pertenencia === 'si' ? 'Sí' : pertenencia === 'no' ? 'No' : pertenencia === 'ns' ? 'No sabe / no informa' : pertenencia === 'nr' ? 'Prefiere no responder' : ''}
          onChange={(v) => setPertenencia(v === 'Sí' ? 'si' : v === 'No' ? 'no' : v === 'No sabe / no informa' ? 'ns' : 'nr')}
        />
        {pertenencia === 'si' && (
          <div style={{ marginTop: 16 }}>
            <div className="grid">
              <SelectField name="grupoEtnico" label="Pertenencia étnica" options={GRUPOS_ETNICOS} />
              <SelectField name="comunidad" label="Comunidad / organización / colectivo" options={COMUNIDADES} />
              <TextField name="nombreComunidad" label="Nombre de la comunidad u organización" placeholder="Opcional" />
            </div>
            <div className="grid" style={{ marginTop: 12 }}>
              <TextAreaField
                span="full" name="practicas"
                label="¿Existe alguna práctica cultural, comunitaria, territorial o familiar que considere importante tener en cuenta durante el acompañamiento?"
                placeholder="Describa aquello que considere relevante..."
              />
            </div>
          </div>
        )}
      </Section>

      <Section title="6. Situación que motiva el contacto" hint="Identificación inicial del motivo expresado por la familia.">
        <div className="grid">
          <SelectField
            span="full" name="motivo" label="Situación principal" required
            options={MOTIVOS} value={motivo} onChange={(e) => setMotivo(e.target.value)}
          />
          <TextAreaField
            span="full" name="relato" label="Relato inicial de la familia"
            tip="Se recomienda conservar el relato de la familia sin sustituirlo inicialmente por una interpretación profesional."
            placeholder="Permita que la familia explique con sus propias palabras qué la lleva a solicitar acompañamiento..."
          />
        </div>
      </Section>

      <Section title="7. Expectativas frente al acompañamiento" hint="¿Qué espera encontrar la familia en este proceso?">
        <OptionGrid options={EXPECTATIVAS} selected={expectativas} onChange={setExpectativas} multiple cols={4} />
      </Section>

      <Section title="8. Orientación inicial" hint="Identificación preliminar de situaciones que podrían requerir valoración o articulación.">
        <Callout variant="warn">
          <b>Importante:</b> esta pregunta no reemplaza la valoración profesional ni determina por sí sola la procedencia de una ruta.
        </Callout>
        <div className="grid" style={{ marginTop: 14 }}>
          <Choice
            span="full"
            label="¿Existe actualmente alguna situación que requiera atención inmediata o intervención de otra autoridad?"
            name="alerta" options={['No', 'No estoy seguro/a', 'Sí']}
            value={alerta === 'no' ? 'No' : alerta === 'duda' ? 'No estoy seguro/a' : alerta === 'si' ? 'Sí' : ''}
            onChange={(v) => setAlerta(v === 'No' ? 'no' : v === 'Sí' ? 'si' : 'duda')}
          />
        </div>
        {(alerta === 'si' || alerta === 'duda') && (
          <div className="grid" style={{ marginTop: 14 }}>
            <TextAreaField span="full" name="detalleAlerta" label="Describa brevemente la situación" placeholder="Registre la información relevante para la orientación..." />
          </div>
        )}
      </Section>

      {errorCaso && <Callout variant="warn">{errorCaso}</Callout>}

      {resultado && (
        <div className={`orient-card ${resultado.clase}`}>
          <span className="orient-code">{resultado.codigo}</span>
          <h3>{resultado.titulo}</h3>
          <p>{resultado.texto}</p>
          {resultado.resumen && (
            <>
              <p style={{ marginTop: 12 }}><strong>Siguiente etapa:</strong> 02 · Comprensión y Planificación Familiar</p>
              <div className="orient-summary">
                <div className="orient-summary-item"><div className="orient-summary-label">Municipio</div><div className="orient-summary-value">{resultado.resumen.municipio}</div></div>
                <div className="orient-summary-item"><div className="orient-summary-label">Zona</div><div className="orient-summary-value">{resultado.resumen.zona}</div></div>
                <div className="orient-summary-item"><div className="orient-summary-label">Ingreso</div><div className="orient-summary-value">{resultado.resumen.ingreso}</div></div>
                <div className="orient-summary-item"><div className="orient-summary-label">Vivienda</div><div className="orient-summary-value">{resultado.resumen.vivienda}</div></div>
                <div className="orient-summary-item"><div className="orient-summary-label">Pertenencia</div><div className="orient-summary-value">{resultado.resumen.pertenencia}</div></div>
                <div className="orient-summary-item"><div className="orient-summary-label">Situación</div><div className="orient-summary-value">{resultado.resumen.motivo}</div></div>
                <div className="orient-summary-item"><div className="orient-summary-label">Expectativas</div><div className="orient-summary-value">{resultado.resumen.expectativas}</div></div>
                <div className="orient-summary-item"><div className="orient-summary-label">Origen</div><div className="orient-summary-value">{resultado.resumen.origen}</div></div>
              </div>
            </>
          )}
        </div>
      )}

      <Section title="Registro de la petición">
        <FormActions statusText="✓ Formato propio · complementario al registro SIO" onSaveDraft={() => alert('Borrador guardado localmente.')} submitLabel="Registrar y orientar solicitud →" />
      </Section>
    </form>
  );
}
