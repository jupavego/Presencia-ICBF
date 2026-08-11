import { useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import { TextField, SelectField } from '../ui/Field.jsx';
import Choice from '../ui/Choice.jsx';
import DataTable from '../ui/DataTable.jsx';
import Callout from '../ui/Callout.jsx';
import FormActions from '../ui/FormActions.jsx';

// Fuente: F3.GO3_.MT5_.PP Formato Acuerdo de Vinculacion v2.docx
const COLUMNAS_MENORES = [
  { key: 'nombre', label: 'Nombre', placeholder: 'Nombre completo' },
  { key: 'documento', label: 'Documento de identidad', placeholder: 'Número de documento' },
];
const nuevoMenor = () => ({ nombre: '', documento: '' });

export default function F3AcuerdoVinculacion({ etapaCode, etapaNombre }) {
  const [tratamientoDatos, setTratamientoDatos] = useState('');
  const [mensajesTexto, setMensajesTexto] = useState('');
  const [fotosMenores, setFotosMenores] = useState('');
  const [audiosMenores, setAudiosMenores] = useState('');
  const [videosMenores, setVideosMenores] = useState('');
  const [fotosTitular, setFotosTitular] = useState('');
  const [audiosTitular, setAudiosTitular] = useState('');
  const [videosTitular, setVideosTitular] = useState('');
  const [menores, setMenores] = useState([nuevoMenor()]);

  function handleSubmit(e) {
    e.preventDefault();
    alert('¡Acuerdo de vinculación registrado con éxito!');
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormatHeader
        eyebrow={`${etapaCode} · ${etapaNombre} · Vinculación al servicio`}
        title="Acuerdo de Vinculación"
        description="Manifestación libre y voluntaria de la familia para vincularse al servicio Presencia, junto con las autorizaciones de tratamiento de datos personales y de uso de imagen exigidas por la normativa vigente."
        metaTitle="F3.GO3.MT5.PP · V2"
        metaSub="Ley 1581 de 2012 · Decreto 1074 de 2015"
      />

      <Section title="Lugar y fecha del acuerdo">
        <div className="grid">
          <TextField label="Ciudad" required />
          <TextField label="Día" type="number" min="1" max="31" required />
          <TextField label="Mes" required />
          <TextField label="Año" type="number" defaultValue="2026" required />
        </div>
      </Section>

      <Section title="Datos del declarante">
        <div className="grid">
          <TextField span="wide" label="Nombre completo" required />
          <SelectField label="Tipo de documento" options={['CC', 'TI', 'CE', 'PPT', 'Registro Civil']} />
          <TextField label="Número de documento" required />
          <TextField label="Expedido en" placeholder="Ciudad de expedición" />
          <TextField span="wide" label="Dirección de residencia" required />
          <TextField label="Ciudad" required />
          <TextField label="Teléfono fijo" />
          <TextField label="Celular" required />
        </div>
      </Section>

      <Section title="Manifestación de vinculación voluntaria" hint="Contenido íntegro del acuerdo, tal como se presenta a la familia.">
        <Callout>
          Manifiesto de forma libre y voluntaria que, luego de recibir la información clara y suficiente sobre el servicio Presencia para la Convivencia y el Fortalecimiento de Vínculos Familiares y Comunitarios del ICBF, en conjunto con los integrantes de mi grupo familiar hemos acordado participar en el proceso de acompañamiento, comprendiendo que el objetivo es promover, mediante procesos de acompañamiento participativo, el fortalecimiento de las capacidades de las familias y comunidades para gestionar sus recursos frente a situaciones de crisis y conflicto, favoreciendo su empoderamiento, la consolidación de redes sociales de cuidado y la toma de decisiones libres y autónomas para el buen vivir.
        </Callout>
        <label style={{ marginTop: 14, marginBottom: 8 }}>En consecuencia, junto con los integrantes de mi familia, estamos de acuerdo en:</label>
        <div className="check-stack">
          <label><input type="checkbox" /> Que el Equipo de Acompañamiento Familiar y Comunitario nos brinde acompañamiento de forma presencial y/o virtual.</label>
          <label><input type="checkbox" /> Participar en las diferentes formas de acompañamiento propuestas por el servicio: Diálogos para el Cuidado y el Buen Vivir, Encuentros Comunitarios de Cuidado y Acompañamiento en el Entorno Familiar.</label>
        </div>
      </Section>

      <Section title="Autorización de tratamiento de datos personales" hint="De conformidad con la Ley 1581 de 2012 y el Decreto 1074 de 2015.">
        <Choice
          label="Autorizo al ICBF para captar la información suministrada en los diferentes formatos e instrumentos en sus bases de datos, manejada con criterios de confidencialidad y uso exclusivamente institucional."
          tip="Es el permiso que otorga la familia para que el ICBF almacene y use la información registrada en los formatos e instrumentos, exclusivamente con fines institucionales."
          name="tratamientoDatos" options={['Sí', 'No']} value={tratamientoDatos} onChange={setTratamientoDatos}
        />
        <div style={{ marginTop: 14 }}>
          <Choice
            label="Autorizo al ICBF a enviar mensajes de texto (SMS/WhatsApp) a través de los números de contacto o correo electrónico suministrados, para recibir información del servicio."
            name="mensajesTexto" options={['Sí', 'No']} value={mensajesTexto} onChange={setMensajesTexto}
          />
        </div>
      </Section>

      <Section title="Autorización — uso de imagen de niñas y niños menores de edad" hint="De conformidad con el Formato de autorización de uso de imagen (Versión 5), código F2.P2.CE. Quien suscribe obra como representante legal de las niñas y los niños relacionados a continuación.">
        <DataTable columns={COLUMNAS_MENORES} rows={menores} onChange={setMenores} newRow={nuevoMenor} minRows={0} />
        <div className="grid" style={{ marginTop: 14 }}>
          <Choice
            span="field" label="Fotos"
            tip="Es el permiso específico para que el ICBF pueda tomar y usar fotografías, audios o videos de las niñas y los niños relacionados en la tabla."
            name="fotosMenores" options={['Sí', 'No']} value={fotosMenores} onChange={setFotosMenores}
          />
          <Choice span="field" label="Audios" name="audiosMenores" options={['Sí', 'No']} value={audiosMenores} onChange={setAudiosMenores} />
          <Choice span="field" label="Videos" name="videosMenores" options={['Sí', 'No']} value={videosMenores} onChange={setVideosMenores} />
        </div>
      </Section>

      <Section title="Autorización — uso de imagen del titular" hint="Cuando el titular es un adulto que autoriza por sí mismo.">
        <div className="grid">
          <TextField span="wide" label="Nombre del titular" />
          <TextField label="Documento de identidad" />
        </div>
        <div className="grid" style={{ marginTop: 14 }}>
          <Choice span="field" label="Fotos" name="fotosTitular" options={['Sí', 'No']} value={fotosTitular} onChange={setFotosTitular} />
          <Choice span="field" label="Audios" name="audiosTitular" options={['Sí', 'No']} value={audiosTitular} onChange={setAudiosTitular} />
          <Choice span="field" label="Videos" name="videosTitular" options={['Sí', 'No']} value={videosTitular} onChange={setVideosTitular} />
        </div>
        <Callout variant="warn">
          La autorización comprende captar, tomar, almacenar y editar imágenes, videos y audios, así como divulgarlos y publicarlos por cualquier medio, con fines de prevención y promoción de derechos de niñas, niños y adolescentes, en el marco del servicio Presencia. Es gratuita y revocable: conocer, actualizar, rectificar o solicitar la supresión del dato puede ejercerse a través de atencionalciudadano@icbf.gov.co o la línea gratuita (57) 01 8000 91 80 80.
        </Callout>
      </Section>

      <Section title="Firmas">
        <div className="grid">
          <TextField span="wide" label="Nombre — firmante 1" />
          <TextField label="Huella (si no cuenta con firma)" placeholder="Marcar si aplica" />
          <TextField span="wide" label="Nombre — firmante 2" />
          <TextField label="Huella (si no cuenta con firma)" placeholder="Marcar si aplica" />
        </div>
        <FormActions statusText="✓ Acuerdo de vinculación parametrizado" onSaveDraft={() => alert('Borrador guardado localmente.')} submitLabel="Registrar acuerdo →" />
      </Section>
    </form>
  );
}
