import { useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import { TextField, SelectField, TextAreaField } from '../ui/Field.jsx';
import CheckboxGrid from '../ui/CheckboxGrid.jsx';
import FormActions from '../ui/FormActions.jsx';

const METODOLOGIAS = ['Reunión participativa', 'Círculo de diálogo', 'Taller participativo', 'Conversatorio', 'Cartografía social', 'Trabajo colaborativo por grupos', 'Estudio de casos', 'Actividad lúdico-pedagógica', 'Diálogo de saberes', 'Encuentro experiencial/reflexivo', 'Otra metodología'];

const OBJETIVOS = [
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
];

const ACTIVIDADES = ['Círculo de palabra', 'Dinámica de presentación e integración', 'Lluvia de ideas', 'Cartografía de redes y recursos', 'Análisis de situaciones o casos', 'Trabajo colaborativo en grupos', 'Juego o actividad lúdica', 'Ejercicio de reflexión individual y colectiva', 'Construcción colectiva de acuerdos', 'Socialización y cierre participativo'];

const LOGROS = ['Se fortaleció la participación de las familias.', 'Se identificaron recursos y fortalezas familiares.', 'Se reconocieron redes de apoyo disponibles.', 'Se generaron acuerdos entre los participantes.', 'Se promovió el intercambio de experiencias.', 'Se fortalecieron conocimientos relacionados con el cuidado.', 'Se identificaron estrategias frente a situaciones comunes.', 'Se favoreció la expresión de necesidades y expectativas.', 'Se fortalecieron vínculos entre participantes.', 'Se definieron acciones o compromisos para continuar el proceso.'];

const ACIERTOS = ['La metodología facilitó la participación.', 'El lenguaje utilizado fue claro y comprensible.', 'Se generó un ambiente de confianza.', 'Se logró una participación activa de las familias.', 'Las actividades fueron pertinentes para el grupo.', 'Se aprovechó adecuadamente el tiempo disponible.', 'Se favoreció el intercambio de experiencias.', 'El equipo facilitó adecuadamente el diálogo.', 'Los recursos utilizados fueron pertinentes.', 'Se logró articulación adecuada entre las actividades y el objetivo.'];

const BARRERAS = ['Baja asistencia de las familias convocadas.', 'Dificultades de desplazamiento o acceso al lugar.', 'Limitaciones de tiempo.', 'Dificultades para mantener la participación durante el encuentro.', 'Condiciones físicas o logísticas inadecuadas.', 'Dificultades de comunicación o convocatoria.', 'Disponibilidad limitada de los participantes.', 'Situaciones particulares del territorio que afectaron el desarrollo.', 'Limitaciones de recursos o materiales.', 'Dificultades para desarrollar completamente las actividades previstas.'];

const MEJORAS = ['Fortalecer los mecanismos de convocatoria.', 'Ajustar los horarios de acuerdo con la disponibilidad de las familias.', 'Mejorar las condiciones logísticas del encuentro.', 'Diversificar las metodologías de participación.', 'Fortalecer los mecanismos de seguimiento a los acuerdos.', 'Incorporar actividades más adaptadas a las características del grupo.', 'Mejorar la preparación previa del encuentro.', 'Fortalecer la articulación con actores comunitarios.', 'Optimizar el uso de recursos y materiales.', 'Ajustar los contenidos de futuros encuentros a los aprendizajes obtenidos.'];

export default function F5EncuentrosComunitarios({ etapaCode, etapaNombre }) {
  const [actividades, setActividades] = useState([]);
  const [logros, setLogros] = useState([]);
  const [aciertos, setAciertos] = useState([]);
  const [barreras, setBarreras] = useState([]);
  const [mejoras, setMejoras] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    alert('¡Encuentro comunitario registrado y estructurado con éxito!');
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormatHeader
        eyebrow={`${etapaCode} · ${etapaNombre} · Encuentro comunitario`}
        title="Encuentros Comunitarios de Cuidado"
        description="Módulo parametrizado de registro y catálogo inteligente para los encuentros grupales en los que las familias comparten experiencias y fortalecen sus capacidades de cuidado mutuo."
        metaTitle="F5.GO3.MT5.PP · V2"
        metaSub="Modalidad comunitaria"
      />

      <Section title="Información general">
        <div className="grid">
          <TextField label="Fecha del encuentro" type="date" required />
          <TextField label="Regional" placeholder="Ej. Antioquia" required />
          <TextField label="Centro Zonal" placeholder="Ej. Centro Zonal Norte" required />
          <TextField span="wide" label="Equipo de Acompañamiento Familiar y Comunitario" placeholder="Nombres de los profesionales" required />
          <TextField label="Número de familias participantes" type="number" min="1" required />
          <TextField span="wide" label="Lugar en el que se desarrolla" placeholder="Dirección o espacio comunitario" required />
        </div>
      </Section>

      <Section title="Caracterización y desarrollo del encuentro">
        <div className="grid">
          <SelectField
            span="full" label="Metodología utilizada"
            tip="Es la forma o técnica de trabajo utilizada para desarrollar el encuentro con las familias (taller, círculo de diálogo, conversatorio, etc.)."
            options={METODOLOGIAS} required
          />
          <SelectField span="full" label="Objetivo del encuentro" options={OBJETIVOS} required />
        </div>

        <div style={{ marginTop: 16 }}><CheckboxGrid cols={3} label="Actividades realizadas (selección múltiple)" options={ACTIVIDADES} selected={actividades} onChange={setActividades} /></div>
        <div style={{ marginTop: 16 }}><CheckboxGrid cols={3} label="Logros alcanzados" options={LOGROS} selected={logros} onChange={setLogros} /></div>
        <div style={{ marginTop: 16 }}><CheckboxGrid cols={3} label="Aciertos (aspectos logísticos y de desarrollo que funcionaron bien)" options={ACIERTOS} selected={aciertos} onChange={setAciertos} /></div>
        <div style={{ marginTop: 16 }}>
          <CheckboxGrid
            cols={3} label="Barreras (dificultades presentadas)"
            tip="Son las dificultades logísticas u operativas que se presentaron durante el desarrollo del encuentro."
            options={BARRERAS} selected={barreras} onChange={setBarreras}
          />
        </div>
        <div style={{ marginTop: 16 }}><CheckboxGrid cols={3} label="Oportunidades de mejora (reflexiones y retos)" options={MEJORAS} selected={mejoras} onChange={setMejoras} /></div>

        <FormActions statusText="✓ Formato oficial F5.GO3.MT5.PP parametrizado" onSaveDraft={() => alert('Borrador guardado localmente.')} submitLabel="Generar Registro →" />
      </Section>
    </form>
  );
}
