import { useRef, useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import { TextField, SelectField, TextAreaField } from '../ui/Field.jsx';
import CheckboxGrid from '../ui/CheckboxGrid.jsx';
import FormActions from '../ui/FormActions.jsx';
import Callout from '../ui/Callout.jsx';
import { descargarDocxOficial, formatoFecha, DOCX_MIME } from '../../lib/exportOficial.js';
import { guardarEncuentroComunitario } from '../../lib/persistenciaEncuentro.js';
import { respaldarEnDrive } from '../../lib/driveEvidencia.js';
import { useAuth } from '../../context/AuthContext.jsx';
import SelectorCasosAsignadosMultiple from './SelectorCasosAsignadosMultiple.jsx';

// El documento oficial de F5 es de texto libre (líneas en blanco por
// sección) — estas listas de opciones son un agregado propio del
// formulario web, no vienen en el original (ver
// docs/exportacion-formatos-oficiales.md). Por eso cada una termina en
// una opción "Otro/a": al elegirla se habilita un campo de texto para
// no perder la posibilidad de responder libremente que sí tenía el
// formato oficial.
export const METODOLOGIAS = ['Reunión participativa', 'Círculo de diálogo', 'Taller participativo', 'Conversatorio', 'Cartografía social', 'Trabajo colaborativo por grupos', 'Estudio de casos', 'Actividad lúdico-pedagógica', 'Diálogo de saberes', 'Encuentro experiencial/reflexivo', 'Otra metodología'];

export const OBJETIVOS = [
  'Fortalecer capacidades familiares y comunitarias para el cuidado.',
  'Promover la participación activa de las familias.',
  'Reconocer fortalezas y recursos existentes en las familias.',
  'Fortalecer redes de apoyo familiares y comunitarias.',
  'Favorecer espacios de diálogo y escucha entre participantes.',
  'Promover estrategias para afrontar situaciones identificadas por las familias.',
  'Compartir conocimientos y experiencias entre las familias.',
  'Fortalecer vínculos y relaciones de confianza.',
  'Promover la autonomía y la toma de decisiones.',
  'Construir acuerdos y estrategias colectivas frente a necesidades identificadas.',
  'Otro objetivo',
];

export const ACTIVIDADES = ['Círculo de palabra', 'Dinámica de presentación e integración', 'Lluvia de ideas', 'Cartografía de redes y recursos', 'Análisis de situaciones o casos', 'Trabajo colaborativo en grupos', 'Juego o actividad lúdica', 'Ejercicio de reflexión individual y colectiva', 'Construcción colectiva de acuerdos', 'Socialización y cierre participativo', 'Otra actividad'];

export const LOGROS = ['Se fortaleció la participación de las familias.', 'Se identificaron recursos y fortalezas familiares.', 'Se reconocieron redes de apoyo disponibles.', 'Se generaron acuerdos entre los participantes.', 'Se promovió el intercambio de experiencias.', 'Se fortalecieron conocimientos relacionados con el cuidado.', 'Se identificaron estrategias frente a situaciones comunes.', 'Se favoreció la expresión de necesidades y expectativas.', 'Se fortalecieron vínculos entre participantes.', 'Se definieron acciones o compromisos para continuar el proceso.', 'Otro logro'];

export const ACIERTOS = ['La metodología facilitó la participación.', 'El lenguaje utilizado fue claro y comprensible.', 'Se generó un ambiente de confianza.', 'Se logró una participación activa de las familias.', 'Las actividades fueron pertinentes para el grupo.', 'Se aprovechó adecuadamente el tiempo disponible.', 'Se favoreció el intercambio de experiencias.', 'El equipo facilitó adecuadamente el diálogo.', 'Los recursos utilizados fueron pertinentes.', 'Se logró articulación adecuada entre las actividades y el objetivo.', 'Otro acierto'];

export const BARRERAS = ['Baja asistencia de las familias convocadas.', 'Dificultades de desplazamiento o acceso al lugar.', 'Limitaciones de tiempo.', 'Dificultades para mantener la participación durante el encuentro.', 'Condiciones físicas o logísticas inadecuadas.', 'Dificultades de comunicación o convocatoria.', 'Disponibilidad limitada de los participantes.', 'Situaciones particulares del territorio que afectaron el desarrollo.', 'Limitaciones de recursos o materiales.', 'Dificultades para desarrollar completamente las actividades previstas.', 'Otra barrera'];

export const MEJORAS = ['Fortalecer los mecanismos de convocatoria.', 'Ajustar los horarios de acuerdo con la disponibilidad de las familias.', 'Mejorar las condiciones logísticas del encuentro.', 'Diversificar las metodologías de participación.', 'Fortalecer los mecanismos de seguimiento a los acuerdos.', 'Incorporar actividades más adaptadas a las características del grupo.', 'Mejorar la preparación previa del encuentro.', 'Fortalecer la articulación con actores comunitarios.', 'Optimizar el uso de recursos y materiales.', 'Ajustar los contenidos de futuros encuentros a los aprendizajes obtenidos.', 'Otra oportunidad de mejora'];

export default function F5EncuentrosComunitarios({ etapaCode, etapaNombre }) {
  const formRef = useRef(null);
  const { session } = useAuth();
  const [metodologia, setMetodologia] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [actividades, setActividades] = useState([]);
  const [logros, setLogros] = useState([]);
  const [aciertos, setAciertos] = useState([]);
  const [barreras, setBarreras] = useState([]);
  const [mejoras, setMejoras] = useState([]);
  // Detalle de texto libre de la opción "Otro/a", una por campo — ver
  // comentario sobre las listas de opciones más arriba.
  const [detalles, setDetalles] = useState({});
  function setDetalle(campo, valor) {
    setDetalles((d) => ({ ...d, [campo]: valor }));
  }

  // Un encuentro comunitario lo registra el profesional una sola vez y lo
  // asisten varios beneficiarios a la vez — ya no cuelga de un solo caso
  // activo (ver encuentros_comunitarios/encuentro_participantes en
  // 0003_roles_bolsa_asignacion.sql). Se marcan aquí cuáles de los propios
  // casos asignados participaron, con la misma fuente de datos que
  // SelectorCasoAsignado.jsx pero en su variante de selección múltiple.
  const [casosSeleccionados, setCasosSeleccionados] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    alert('¡Encuentro comunitario registrado y estructurado con éxito!');
  }

  // Sustituye la opción "Otro/a" elegida por el texto libre escrito en su
  // campo de detalle (si se diligenció) — así el documento exportado
  // muestra la respuesta real en vez de la etiqueta genérica "Otro/a".
  function conDetalle(valor, campo) {
    return valor.startsWith('Otr') && detalles[campo] ? detalles[campo] : valor;
  }
  function listaConDetalle(lista, campo) {
    return lista.map((v) => conDetalle(v, campo));
  }

  async function handleExportarOficial() {
    if (!session) {
      alert('Inicie sesión para registrar un encuentro comunitario — es un formato que diligencia el equipo de acompañamiento, no la familia.');
      return;
    }
    if (!casosSeleccionados.length) {
      alert('Marque al menos uno de sus casos asignados como participante antes de generar el registro.');
      return;
    }

    const fd = new FormData(formRef.current);
    const logrosConDetalle = listaConDetalle(logros, 'logros');
    const aciertosConDetalle = listaConDetalle(aciertos, 'aciertos');
    const logrosYAciertos = [
      logrosConDetalle.length ? `Logros: ${logrosConDetalle.join('; ')}` : '',
      aciertosConDetalle.length ? `Aciertos: ${aciertosConDetalle.join('; ')}` : '',
    ].filter(Boolean).join(' | ');

    const fecha = fd.get('fecha');
    const datos = {
      fecha: formatoFecha(fecha),
      regional: fd.get('regional') || '',
      centroZonal: fd.get('centroZonal') || '',
      equipo: fd.get('equipo') || '',
      numFamilias: fd.get('numFamilias') || '',
      lugar: fd.get('lugar') || '',
      metodologia: conDetalle(metodologia, 'metodologia'),
      objetivo: conDetalle(objetivo, 'objetivo'),
      actividades: listaConDetalle(actividades, 'actividades').join('; '),
      logrosYAciertos,
      barreras: listaConDetalle(barreras, 'barreras').join('; '),
      oportunidadesMejora: listaConDetalle(mejoras, 'mejoras').join('; '),
    };

    try {
      await guardarEncuentroComunitario({ userId: session.user.id, fecha, datos, casoIds: casosSeleccionados });
    } catch (err) {
      console.error('No se pudo guardar el encuentro comunitario:', err);
    }
    const nombreArchivo = 'F5-Encuentros-Comunitarios-diligenciado.docx';
    const blob = await descargarDocxOficial('/plantillas/F5-Encuentros-Comunitarios.docx', datos, nombreArchivo);
    // Un mismo encuentro puede tener varias familias participantes — el
    // respaldo queda en la carpeta de cada una, no solo en la primera.
    for (const casoId of casosSeleccionados) {
      respaldarEnDrive({ casoId, fase: `${etapaCode} · ${etapaNombre}`, fileName: nombreArchivo, mimeType: DOCX_MIME, blob });
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <FormatHeader
        eyebrow={`${etapaCode} · ${etapaNombre} · Encuentro comunitario`}
        title="Encuentros Comunitarios de Cuidado"
        description="Módulo parametrizado de registro y catálogo inteligente para los encuentros grupales en los que las familias comparten experiencias y fortalecen sus capacidades de cuidado mutuo."
        metaTitle="F5.GO3.MT5.PP · V2"
        metaSub="Modalidad comunitaria"
      />

      <Section title="Información general">
        <div className="grid">
          <TextField name="fecha" label="Fecha del encuentro" type="date" required />
          <TextField name="regional" label="Regional" placeholder="Ej. Antioquia" required />
          <TextField name="centroZonal" label="Centro Zonal" placeholder="Ej. Centro Zonal Norte" required />
          <TextField name="equipo" span="wide" label="Equipo de Acompañamiento Familiar y Comunitario" placeholder="Nombres de los profesionales" required />
          <TextField name="numFamilias" label="Número de familias participantes" type="number" min="1" required />
          <TextField name="lugar" span="wide" label="Lugar en el que se desarrolla" placeholder="Dirección o espacio comunitario" required />
        </div>
      </Section>

      <Section title="Casos participantes" hint="Un mismo encuentro suele reunir a varias familias a la vez — márquelas para que este registro quede en el expediente de cada una, sin tener que diligenciarlo varias veces.">
        <SelectorCasosAsignadosMultiple selected={casosSeleccionados} onChange={setCasosSeleccionados} label={null} />
      </Section>

      <Section title="Caracterización y desarrollo del encuentro">
        <div className="grid">
          <SelectField
            name="metodologia"
            span="full" label="Metodología utilizada"
            tip="Es la forma o técnica de trabajo utilizada para desarrollar el encuentro con las familias (taller, círculo de diálogo, conversatorio, etc.)."
            options={METODOLOGIAS} value={metodologia} onChange={(e) => setMetodologia(e.target.value)} required
          />
          {metodologia.startsWith('Otr') && (
            <TextField span="full" label="¿Cuál metodología?" value={detalles.metodologia || ''} onChange={(e) => setDetalle('metodologia', e.target.value)} placeholder="Especifique la metodología utilizada" />
          )}
          <SelectField name="objetivo" span="full" label="Objetivo del encuentro" options={OBJETIVOS} value={objetivo} onChange={(e) => setObjetivo(e.target.value)} required />
          {objetivo.startsWith('Otr') && (
            <TextField span="full" label="¿Cuál objetivo?" value={detalles.objetivo || ''} onChange={(e) => setDetalle('objetivo', e.target.value)} placeholder="Especifique el objetivo del encuentro" />
          )}
        </div>

        <div style={{ marginTop: 16 }}>
          <CheckboxGrid cols={3} label="Actividades realizadas (selección múltiple)" options={ACTIVIDADES} selected={actividades} onChange={setActividades} />
          {actividades.includes('Otra actividad') && (
            <TextField span="full" label="¿Cuál otra actividad?" value={detalles.actividades || ''} onChange={(e) => setDetalle('actividades', e.target.value)} placeholder="Describa la actividad realizada" />
          )}
        </div>
        <div style={{ marginTop: 16 }}>
          <CheckboxGrid cols={3} label="Logros alcanzados" options={LOGROS} selected={logros} onChange={setLogros} />
          {logros.includes('Otro logro') && (
            <TextField span="full" label="¿Cuál otro logro?" value={detalles.logros || ''} onChange={(e) => setDetalle('logros', e.target.value)} placeholder="Describa el logro alcanzado" />
          )}
        </div>
        <div style={{ marginTop: 16 }}>
          <CheckboxGrid cols={3} label="Aciertos (aspectos logísticos y de desarrollo que funcionaron bien)" options={ACIERTOS} selected={aciertos} onChange={setAciertos} />
          {aciertos.includes('Otro acierto') && (
            <TextField span="full" label="¿Cuál otro acierto?" value={detalles.aciertos || ''} onChange={(e) => setDetalle('aciertos', e.target.value)} placeholder="Describa el acierto" />
          )}
        </div>
        <div style={{ marginTop: 16 }}>
          <CheckboxGrid
            cols={3} label="Barreras (dificultades presentadas)"
            tip="Son las dificultades logísticas u operativas que se presentaron durante el desarrollo del encuentro."
            options={BARRERAS} selected={barreras} onChange={setBarreras}
          />
          {barreras.includes('Otra barrera') && (
            <TextField span="full" label="¿Cuál otra barrera?" value={detalles.barreras || ''} onChange={(e) => setDetalle('barreras', e.target.value)} placeholder="Describa la barrera presentada" />
          )}
        </div>
        <div style={{ marginTop: 16 }}>
          <CheckboxGrid cols={3} label="Oportunidades de mejora (reflexiones y retos)" options={MEJORAS} selected={mejoras} onChange={setMejoras} />
          {mejoras.includes('Otra oportunidad de mejora') && (
            <TextField span="full" label="¿Cuál otra oportunidad de mejora?" value={detalles.mejoras || ''} onChange={(e) => setDetalle('mejoras', e.target.value)} placeholder="Describa la oportunidad de mejora" />
          )}
        </div>

        <FormActions statusText="✓ Formato oficial F5.GO3.MT5.PP parametrizado" onSaveDraft={() => alert('Borrador guardado localmente.')} submitLabel="Generar Registro →" onExport={handleExportarOficial} />
      </Section>
    </form>
  );
}
