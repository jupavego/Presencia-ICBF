import { useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import { TextField, SelectField } from '../ui/Field.jsx';
import DataTable from '../ui/DataTable.jsx';
import FormActions from '../ui/FormActions.jsx';

const COLUMNAS_FAMILIAR = [
  { key: 'num', label: '# Acomp.', width: '50px' },
  { key: 'fecha', label: 'Fecha', type: 'date' },
  { key: 'inicio', label: 'Hora inicio', type: 'time' },
  { key: 'fin', label: 'Hora fin', type: 'time' },
  { key: 'nombre', label: 'Nombres y Apellidos (Jefatura)', placeholder: 'Nombre completo' },
  { key: 'cedula', label: 'N° Cédula', placeholder: 'Cédula' },
  { key: 'telefono', label: 'Teléfono', placeholder: 'Teléfono' },
  { key: 'direccion', label: 'Dirección', tip: 'Dirección del domicilio de la familia donde se realizará la visita de acompañamiento.', placeholder: 'Dirección' },
  { key: 'municipio', label: 'Municipio', placeholder: 'Municipio' },
  { key: 'comuna', label: 'Comuna', placeholder: 'Comuna' },
  { key: 'barrio', label: 'Barrio / Zona', placeholder: 'Barrio' },
  { key: 'vereda', label: 'Vereda', placeholder: 'Vereda' },
  { key: 'referencia', label: 'Punto de referencia', placeholder: 'Referencia' },
  { key: 'observaciones', label: 'Observaciones', placeholder: 'Observaciones' },
];
const nuevaVisitaFamiliar = (n) => ({ num: String(n + 1), fecha: '', inicio: '09:00', fin: '11:00', nombre: '', cedula: '', telefono: '', direccion: '', municipio: 'Girardota', comuna: '', barrio: '', vereda: '', referencia: '', observaciones: '' });

const COLUMNAS_COMUNITARIO = [
  { key: 'num', label: '# Encuentro', width: '60px' },
  { key: 'fecha', label: 'Fecha', type: 'date' },
  { key: 'inicio', label: 'Hora inicio', type: 'time' },
  { key: 'fin', label: 'Hora fin', type: 'time' },
  { key: 'familias', label: '# Familias', type: 'number', width: '70px' },
  { key: 'lugar', label: 'Dirección del lugar', placeholder: 'Lugar / Dirección' },
  { key: 'municipio', label: 'Municipio', placeholder: 'Municipio' },
  { key: 'comuna', label: 'Comuna', placeholder: 'Comuna' },
  { key: 'barrio', label: 'Barrio / Zona', placeholder: 'Barrio' },
  { key: 'vereda', label: 'Vereda', placeholder: 'Vereda' },
  { key: 'referencia', label: 'Punto de referencia', placeholder: 'Referencia' },
  { key: 'observaciones', label: 'Observaciones', placeholder: 'Observaciones' },
];
const nuevoEncuentro = (n) => ({ num: String(n + 1), fecha: '', inicio: '14:00', fin: '16:00', familias: '10', lugar: '', municipio: 'Girardota', comuna: '', barrio: '', vereda: '', referencia: '', observaciones: '' });

const REGIONALES = ['Antioquia', 'Bogotá', 'Atlántico', 'Valle del Cauca', 'Santander'];
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function F8Cronograma({ etapaCode, etapaNombre }) {
  const [tab, setTab] = useState('familiar');
  const [familiar, setFamiliar] = useState([nuevaVisitaFamiliar(0)]);
  const [comunitario, setComunitario] = useState([nuevoEncuentro(0)]);

  function handleSubmit(e) {
    e.preventDefault();
    alert('¡Cronograma validado y estructurado correctamente!');
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormatHeader
        eyebrow={`${etapaCode} · ${etapaNombre} · Cronograma`}
        title="Cronograma de Visitas y Encuentros"
        description="Gestión operativa mensual de programación de acompañamientos en entorno familiar y encuentros comunitarios de cuidado, optimizando rutas y tiempos de desplazamiento."
        metaTitle="F8.GO3.MT5.PP · V2"
        metaSub="Vigencia 2026"
      />

      <details className="finstructions">
        <summary>Instrucciones de diligenciamiento (ver directrices operativas)</summary>
        <ol>
          <li>De acuerdo con la concertación realizada entre la familia y los Profesionales de Acompañamiento, registrar las fechas programadas para el mes.</li>
          <li>Establecer los tiempos de acuerdo con la disponibilidad de las familias y las rutas de recorrido en el territorio para optimizar desplazamientos.</li>
          <li>Señalar claramente las direcciones, municipios, zonas y puntos de referencia del lugar de desarrollo.</li>
          <li>Cargar el cronograma finalizado en la ruta SharePoint compartida con el supervisor del contrato y profesional regional de apoyo.</li>
          <li>En caso de novedad, actualizar con anticipación los cambios en la ruta destinada (nunca en la misma fecha programada).</li>
        </ol>
      </details>

      <Section title="Datos generales de operación" hint="Definición territorial y administrativa del periodo mensual.">
        <div className="grid">
          <SelectField span="col-4" label="Regional" options={REGIONALES} defaultValue="Antioquia" required />
          <TextField span="col-4" label="Centro Zonal" placeholder="Ej. Centro Zonal Norte" defaultValue="Centro Zonal Girardota" required />
          <SelectField span="col-4" label="Mes de programación" options={MESES} defaultValue="Agosto" required />
          <TextField span="col-6" label="Nombre(s) del profesional / equipo" placeholder="Nombres de los profesionales a cargo" required />
          <TextField span="col-6" label="Teléfono(s) de contacto del equipo" placeholder="Teléfonos de los profesionales" required />
        </div>
      </Section>

      <div className="ftabs">
        <button type="button" className={`ftab${tab === 'familiar' ? ' active' : ''}`} onClick={() => setTab('familiar')}>01 · Entorno Familiar</button>
        <button type="button" className={`ftab${tab === 'comunitario' ? ' active' : ''}`} onClick={() => setTab('comunitario')}>02 · Encuentros Comunitarios</button>
      </div>

      {tab === 'familiar' && (
        <Section title="Cronograma · Acompañamiento en Entorno Familiar" hint="Programación detallada de visitas domiciliarias y jefatura del grupo familiar (edad ≥ 14 años).">
          <DataTable columns={COLUMNAS_FAMILIAR} rows={familiar} onChange={setFamiliar} newRow={nuevaVisitaFamiliar} />
        </Section>
      )}

      {tab === 'comunitario' && (
        <Section title="Cronograma · Encuentros Comunitarios de Cuidado" hint="Programación de espacios grupales y comunitarios de participación familiar.">
          <DataTable columns={COLUMNAS_COMUNITARIO} rows={comunitario} onChange={setComunitario} newRow={nuevoEncuentro} />
        </Section>
      )}

      <Section>
        <FormActions statusText="✓ Formato oficial F8.GO3.MT5.PP sincronizado" onSaveDraft={() => alert('Borrador guardado localmente.')} submitLabel="Generar / Validar Cronograma →" />
      </Section>
    </form>
  );
}
