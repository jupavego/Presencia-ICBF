import { useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import { TextField, SelectField, TextAreaField } from '../ui/Field.jsx';
import Choice from '../ui/Choice.jsx';
import CheckboxGrid from '../ui/CheckboxGrid.jsx';
import Callout from '../ui/Callout.jsx';
import FormActions from '../ui/FormActions.jsx';

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

const nuevoIntegrante = () => ({
  nombre: '', edad: '', lugarNacimiento: '', estadoCivil: '', nivelEscolar: '',
  rolFamilia: '', afiliacionSalud: '', ocupacion: '', dedicacion: '',
});

export default function F7PerfilSocioFamiliar({ etapaCode, etapaNombre }) {
  const [acudenPor, setAcudenPor] = useState('');
  const [recibeSubsidios, setRecibeSubsidios] = useState('');
  const [trayectoria, setTrayectoria] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [aspiraciones, setAspiraciones] = useState([]);
  const [conclusiones, setConclusiones] = useState([]);
  const [integrantes, setIntegrantes] = useState([nuevoIntegrante()]);

  function updateIntegrante(index, key, value) {
    setIntegrantes(integrantes.map((it, i) => (i === index ? { ...it, [key]: value } : it)));
  }
  function addIntegrante() {
    setIntegrantes([...integrantes, nuevoIntegrante()]);
  }
  function removeIntegrante(index) {
    if (integrantes.length <= 1) {
      alert('Debe permanecer al menos un integrante para iniciar el registro.');
      return;
    }
    setIntegrantes(integrantes.filter((_, i) => i !== index));
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert('¡Perfil sociofamiliar estructurado con éxito!');
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormatHeader
        eyebrow={`${etapaCode} · ${etapaNombre} · Perfil familiar`}
        title="Comprender a la familia"
        description="Espacio digital para construir el Perfil Sociofamiliar a partir de la conversación con la familia. La estructura toma como base el F7.GO3.MT5.PP y lo convierte en una experiencia de trabajo por componentes, no en una copia literal del documento."
        metaTitle="F7.GO3.MT5.PP · V2"
        metaSub="Fuente: Ficha de Perfil Sociofamiliar"
      />

      <Section title="1. Datos iniciales" hint="Información de apertura de la historia sociofamiliar.">
        <div className="grid">
          <TextField label="Fecha de apertura" type="date" />
          <TextField label="Regional" placeholder="Ej. Antioquia" />
          <TextField label="Centro Zonal" placeholder="Ej. Centro Zonal Norte" />
          <TextField label="No. de petición" />
          <TextField span="wide" label="Profesionales que acompañan" />
        </div>
      </Section>

      <Section title="2. Persona participante" hint="Registrar los datos de la persona a la cual se le haya creado el beneficiario en el SIM.">
        <div className="grid">
          <TextField span="wide" label="Nombre" />
          <TextField label="Tipo y número de identificación" />
          <TextField label="Rol en el grupo familiar" />
        </div>
      </Section>

      <Section title="3. Encuentro inicial" hint="Personas que participan en el encuentro inicial de Diálogos por el cuidado y el buen vivir.">
        <div className="grid">
          <TextAreaField label="Participantes: nombre, documento y rol familiar" />
          <TextField label="Dirección" />
          <TextField label="Barrio" />
          <TextField label="Municipio" />
          <TextField label="Teléfono" />
          <Choice label="Acuden por" name="acudenPor" options={['Propia iniciativa', 'Remitidos']} value={acudenPor} onChange={setAcudenPor} />
        </div>
      </Section>

      <Section title="4. Información sociodemográfica" hint="Variables económicas, de vivienda y apoyos sociales contempladas por la ficha.">
        <div className="grid">
          <SelectField
            label="Ingreso mensual aproximado"
            tip="Son los ingresos o recursos económicos que recibe el núcleo familiar en un mes, sumando los aportes de todos sus integrantes (salarios, subsidios, actividades informales, etc.)."
            options={['Menos de un salario mínimo', '1 s.m.', '2 s.m.', '3 a 4 s.m.', '5 o más s.m.', 'No sabe / no informa']}
          />
          <SelectField
            label="Vivienda"
            tip="Indica el tipo de tenencia del lugar donde vive la familia. Usufructo: uso de una vivienda que no es propia. Inquilinato: habitación arrendada dentro de una vivienda compartida con otros hogares."
            options={['Propia', 'Familiar', 'En arriendo', 'Usufructo', 'Inquilinato', 'Refugio temporal', 'Paga diario', 'No sabe / no informa']}
          />
          <TextField label="Personas que aportan económicamente" type="number" />
          <Choice span="wide" label="¿Recibe subsidios?" name="subsidios" options={['Sí', 'No', 'No informa']} value={recibeSubsidios} onChange={setRecibeSubsidios} />
          <TextField label="¿Cuál?" />
        </div>
      </Section>

      <Section title="5. Situación que motiva el contacto" hint="Relato textual de la familia.">
        <TextAreaField
          span="full"
          label="Relato de la familia"
          tip="Es la descripción, en las propias palabras de la familia, del motivo o la situación que la lleva a acudir al servicio Presencia."
          placeholder="Registrar el relato de la familia, conservando su sentido y su voz."
        />
      </Section>

      <Section title="6. Información de otros miembros de la familia" hint='Registre a cada integrante de la familia. Las categorías del F7 están incorporadas directamente en las listas desplegables.'>
        {integrantes.map((it, i) => (
          <div className="repeater-item" key={i}>
            <div className="repeater-head">
              <span className="repeater-num">INTEGRANTE {String(i + 1).padStart(2, '0')}</span>
              <button type="button" className="remove-row" onClick={() => removeIntegrante(i)}>Eliminar</button>
            </div>
            <div className="grid">
              <TextField span="col-3" label="Nombre y apellido" placeholder="Nombre completo" value={it.nombre} onChange={(e) => updateIntegrante(i, 'nombre', e.target.value)} />
              <TextField span="col-3" label="Edad" type="number" min="0" value={it.edad} onChange={(e) => updateIntegrante(i, 'edad', e.target.value)} />
              <TextField span="col-3" label="Lugar de nacimiento" value={it.lugarNacimiento} onChange={(e) => updateIntegrante(i, 'lugarNacimiento', e.target.value)} />
              <SelectField span="col-3" label="Estado civil" options={ESTADOS_CIVILES} value={it.estadoCivil} onChange={(e) => updateIntegrante(i, 'estadoCivil', e.target.value)} />
              <SelectField span="col-3" label="Nivel escolar" options={NIVELES_ESCOLARES} value={it.nivelEscolar} onChange={(e) => updateIntegrante(i, 'nivelEscolar', e.target.value)} />
              <SelectField span="col-3" label="Rol en la familia" options={ROLES_FAMILIA} value={it.rolFamilia} onChange={(e) => updateIntegrante(i, 'rolFamilia', e.target.value)} />
              <SelectField span="col-3" label="Afiliación a salud" options={AFILIACIONES_SALUD} value={it.afiliacionSalud} onChange={(e) => updateIntegrante(i, 'afiliacionSalud', e.target.value)} />
              <SelectField span="col-3" label="Actividad económica / ocupación" options={OCUPACIONES} value={it.ocupacion} onChange={(e) => updateIntegrante(i, 'ocupacion', e.target.value)} />
              <SelectField span="col-3" label="Tiempo de dedicación" options={TIEMPOS_DEDICACION} value={it.dedicacion} onChange={(e) => updateIntegrante(i, 'dedicacion', e.target.value)} />
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
          <Choice span="full" label="Momento del curso de vida" name="cursoVida" options={['Sin hijos', 'Preescolar 0–6', 'Escolar 7–11', 'Adolescente 12–18', 'Joven 19–28', 'Adulto >28']} value="" onChange={() => {}} />
          <TextAreaField label="Entidades o profesionales que han intervenido" />
        </div>
      </Section>

      <Section title="8. Trayectoria con otros servicios sociales" hint="Entidades o profesionales que han intervenido en el manejo de la situación que motiva el contacto con el ICBF. Selección múltiple.">
        <CheckboxGrid
          cols={4}
          label="Entidades o profesionales que han intervenido"
          tip="Son las entidades o profesionales que ya han intervenido en el manejo de la situación que motiva el contacto (salud, defensoría, comisaría, educación, entre otras)."
          options={TRAYECTORIA_SERVICIOS} selected={trayectoria} onChange={setTrayectoria}
        />
        <div className="grid" style={{ marginTop: 10 }}><TextField span="full" label='Si seleccionó "Otra", ¿cuál?' /></div>
      </Section>

      <Section title="9. Subsistemas que conviven" hint="Composición relacional de la familia y de las uniones actuales o anteriores.">
        <div className="grid">
          <Choice
            label="Padre"
            tip="Indica si la figura paterna hace parte del grupo familiar actual, independientemente de si convive con la familia."
            name="padre" options={['Sí', 'No']} value="" onChange={() => {}}
          />
          <Choice label="Madre" name="madre" options={['Sí', 'No']} value="" onChange={() => {}} />
          <TextField label="Hijos de la unión actual" type="number" min="0" placeholder="Cantidad" />
          <TextField label="Hijos de uniones anteriores" type="number" min="0" placeholder="Cantidad" />
          <TextAreaField label="Miembros de la familia extensa" placeholder="Especificar." />
          <TextAreaField label="Otras personas" placeholder="Especificar." />
          <Choice label="Número de la unión actual · de ella" name="ella" options={['1', '2', '3', '4']} value="" onChange={() => {}} />
          <Choice label="Número de la unión actual · de él" name="el" options={['1', '2', '3', '4']} value="" onChange={() => {}} />
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
          <Choice label="¿Actualmente están incursos en otros procesos?" name="procesos" options={['No', 'Sí']} value="" onChange={() => {}} />
          <TextField span="wide" label="¿Cuáles?" placeholder="Legales, terapéuticos, médicos, etc." />
          <SelectField span="full" label="Modalidad para el restablecimiento de derechos del ICBF, si aplica" options={['Hogar sustituto', 'Hogar de paso', 'Internado', 'Casa hogar', 'Casa de acogida', 'Apoyo y fortalecimiento a la familia', 'Intervención de apoyo', 'Externado', 'Seminternado', 'Centro de emergencia', 'Hogar gestor', 'Acogimiento familiar', 'Acogimiento residencial', 'Medida en medio familiar', 'Otra modalidad / medida']} />
        </div>
        <Callout><b>Control documental:</b> catálogo preliminar de parametrización; debe validarse contra el catálogo vigente del ICBF antes de producción.</Callout>
      </Section>

      <Section title="11. Relaciones con familia extensa y red social" hint="Cuando tienen una dificultad económica, de salud, de labores de cuidado u otras, ¿a quiénes acuden?">
        <div className="grid">
          <TextAreaField label="Respuesta de la familia" />
          <div className="field"><label>Vida social</label><div className="check-stack"><label><input type="checkbox" /> Amigos</label><label><input type="checkbox" /> Vecinos</label><label><input type="checkbox" /> Grupos informales</label><label><input type="checkbox" /> Familia</label></div></div>
          <div className="field"><label>Instituciones y profesionales</label><div className="check-stack"><label><input type="checkbox" /> Salud</label><label><input type="checkbox" /> Justicia</label><label><input type="checkbox" /> Iglesia</label><label><input type="checkbox" /> Otro</label></div></div>
          <div className="field"><label>Ocupación</label><div className="check-stack"><label><input type="checkbox" /> Estudio</label><label><input type="checkbox" /> Trabajo</label></div></div>
          <TextField span="wide" label="Otro, ¿cuál?" />
        </div>
      </Section>

      <Section title="12. Proyectos / aspiraciones de la familia" hint="¿Qué expectativas tiene la familia de este acompañamiento? Selección múltiple + respuesta abierta.">
        <CheckboxGrid cols={3} options={ASPIRACIONES} selected={aspiraciones} onChange={setAspiraciones} />
        <div className="grid" style={{ marginTop: 10 }}>
          <TextAreaField label="Expectativa expresada por la familia" />
          <TextField span="full" label='Si seleccionó "Otra", ¿cuál?' />
        </div>
      </Section>

      <Section title="13. Conclusiones y compromisos" hint="Orientadores estructurados para la decisión. La conclusión narrativa y los acuerdos conservan la valoración profesional y lo construido con la familia.">
        <CheckboxGrid options={CONCLUSIONES} selected={conclusiones} onChange={setConclusiones} />
        <div className="grid" style={{ marginTop: 12 }}>
          <TextAreaField label="Conclusión narrativa" placeholder="Propuestas adecuadas a la expectativa de la familia, respuesta brindada y decisión de continuidad o cierre." />
          <TextAreaField label="Acuerdos y compromisos" placeholder="Qué se acordó, quién participa y qué acción se realizará." />
          <SelectField span="full" label="Ruta de continuidad propuesta" options={RUTA_CONTINUIDAD} />
          <TextField span="full" label='Si corresponde "Otra", especifique' />
        </div>
      </Section>

      <Section title="14. Validación del perfil">
        <Callout variant="warn"><b>Salida documental</b><br />Las selecciones alimentan la trazabilidad y el análisis; la narrativa conserva el componente cualitativo. La información queda preparada para generar posteriormente el F7 institucional.</Callout>
        <FormActions statusText="✓ Perfil estructurado · listo para revisión profesional" onSaveDraft={() => alert('Borrador guardado localmente.')} submitLabel="Validar perfil →" />
      </Section>
    </form>
  );
}
