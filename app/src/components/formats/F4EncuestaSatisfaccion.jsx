import { useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import { TextField, TextAreaField } from '../ui/Field.jsx';
import Choice from '../ui/Choice.jsx';
import Callout from '../ui/Callout.jsx';
import FormActions from '../ui/FormActions.jsx';

// Fuente: F4.GO3_.MT5_.PP Formato Encuesta de Satisfaccion Presencia para la convivencia v2.xlsx
const ESCALA = ['1 · Totalmente insatisfecho', '2 · Insatisfecho', '3 · Indiferente', '4 · Satisfecho', '5 · Totalmente satisfecho', 'N/A'];

const ITEMS = [
  '¿Qué nivel de satisfacción tienen respecto al acompañamiento brindado por parte de los profesionales de Presencia?',
  '¿Qué nivel de satisfacción tienen con los temas de las actividades realizadas en grupo con otras familias?',
  '¿Qué nivel de satisfacción tienen respecto a los temas y actividades desarrolladas en su casa?',
  '¿Qué nivel de satisfacción sienten desarrollando las actividades en compañía de los integrantes de su familia?',
  '¿Qué nivel de satisfacción tienen sobre las orientaciones brindadas por los profesionales, respecto al acceso a otros servicios?',
  '¿Qué nivel de satisfacción tienen con los mensajes y comunicaciones enviados por los profesionales?',
  '¿Qué nivel de satisfacción tienen con los temas tratados por los profesionales frente a la utilidad para la vida familiar y comunitaria?',
];

function RatingItem({ index, text, value, onChange }) {
  return (
    <div className="full" style={{ marginBottom: 4 }}>
      <label>{index}. {text}</label>
      <div className="choice">
        {ESCALA.map((opt) => (
          <label key={opt}>
            <input type="radio" name={`item-${index}`} value={opt} checked={value === opt} onChange={(e) => onChange(e.target.value)} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

export default function F4EncuestaSatisfaccion({ etapaCode, etapaNombre }) {
  const [entiendeInfo, setEntiendeInfo] = useState('');
  const [aceptaResponder, setAceptaResponder] = useState('');
  const [respuestas, setRespuestas] = useState({});
  const [respuestaSolicitud, setRespuestaSolicitud] = useState('');
  const [fortalecioCapacidades, setFortalecioCapacidades] = useState('');

  function setRespuesta(i, val) {
    setRespuestas((prev) => ({ ...prev, [i]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert('¡Encuesta de satisfacción registrada con éxito!');
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormatHeader
        eyebrow={`${etapaCode} · ${etapaNombre} · Satisfacción`}
        title="Encuesta de Satisfacción"
        description="Percepción de la familia sobre el servicio Presencia para la Convivencia y el Fortalecimiento de Vínculos Familiares y Comunitarios."
        metaTitle="F4.GO3.MT5.PP · V2"
        metaSub="Clasificación de la información: pública"
      />

      <Section title="Datos de ubicación">
        <div className="grid">
          <TextField label="Departamento" required />
          <TextField label="Municipio / Ciudad" required />
        </div>
      </Section>

      <Section title="Datos generales">
        <div className="grid">
          <TextField label="Fecha" type="date" required />
          <TextField span="wide" label="Profesionales responsables" required />
          <TextField span="wide" label="Nombre de quien responde la encuesta" required />
          <TextField label="Número de documento de quien responde" required />
        </div>
      </Section>

      <Section title="Habeas Data">
        <Callout>
          La información personal recogida es confidencial y sólo será utilizada por el ICBF con fines netamente estadísticos, de caracterización y mejora del servicio. Estos datos nunca serán utilizados a nombre propio, ni para un fin diferente al ya mencionado. Esta información se acoge al principio de confidencialidad establecido en la Ley de Habeas Data.
        </Callout>
        <div className="grid" style={{ marginTop: 14 }}>
          <Choice
            span="wide" label="Entiendo la información brindada"
            tip="Confirma que la persona comprendió la explicación sobre el uso confidencial de la información, antes de responder la encuesta."
            name="entiendeInfo" options={['Sí', 'No']} value={entiendeInfo} onChange={setEntiendeInfo}
          />
          <Choice span="wide" label="¿Estaría de acuerdo en responder la siguiente encuesta?" name="aceptaResponder" options={['Sí', 'No']} value={aceptaResponder} onChange={setAceptaResponder} />
        </div>
        <div className="fnote" style={{ marginTop: 10 }}>Solo en caso de que la respuesta anterior haya sido afirmativa, diligenciar la encuesta en familia.</div>
      </Section>

      <Section title="Opinión sobre el servicio de Presencia" hint="Indique su grado de satisfacción con la atención brindada por el ICBF, en una escala de 1 (totalmente insatisfecho) a 5 (totalmente satisfecho).">
        <div className="grid">
          {ITEMS.map((text, i) => (
            <RatingItem key={i} index={i + 1} text={text} value={respuestas[i + 1] || ''} onChange={(v) => setRespuesta(i + 1, v)} />
          ))}
        </div>
      </Section>

      <Section title="Cierre">
        <div className="grid">
          <Choice
            span="full" name="respuestaSolicitud" value={respuestaSolicitud} onChange={setRespuestaSolicitud} options={['Sí', 'No']}
            label="8. ¿Considera que el acompañamiento brindado por los profesionales dio respuesta a la solicitud que los motivó a acudir al ICBF?"
          />
          <Choice
            span="full" name="fortalecioCapacidades" value={fortalecioCapacidades} onChange={setFortalecioCapacidades} options={['Sí', 'No']}
            label="9. ¿Las actividades realizadas les permitieron identificar y fortalecer las capacidades de su familia para mejorar sus relaciones familiares y comunitarias?"
          />
          <TextAreaField
            label="10. ¿Qué sugieren para mejorar el servicio de Presencia para la Convivencia y el Fortalecimiento de Vínculos Familiares y Comunitarios?"
            tip="Espacio abierto para que la familia proponga ideas o cambios que mejorarían la forma en que reciben el servicio."
          />
        </div>
        <Callout>¡Gracias por su colaboración! Los datos proporcionados serán tratados de acuerdo con la Política de Tratamiento de Datos Personales del ICBF y la Ley 1581 de 2012.</Callout>
        <FormActions statusText="✓ Encuesta de satisfacción parametrizada" onSaveDraft={() => alert('Borrador guardado localmente.')} submitLabel="Registrar encuesta →" />
      </Section>
    </form>
  );
}
