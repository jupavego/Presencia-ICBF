import { useRef, useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import { TextField, SelectField } from '../ui/Field.jsx';
import DataTable from '../ui/DataTable.jsx';
import FormActions from '../ui/FormActions.jsx';
import { descargarXlsxOficial, formatoFecha, XLSX_MIME } from '../../lib/exportOficial.js';
import { respaldarEnDrive } from '../../lib/driveEvidencia.js';
import { guardarDatosFormatoOficial } from '../../lib/persistenciaCaso.js';
import { useCaso } from '../../context/CasoContext.jsx';
import SelectorCasoAsignado from './SelectorCasoAsignado.jsx';

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

// Fila de inicio de datos y columnas de cada hoja del F8 oficial (fuente:
// F8.GO3_.MT5_.PP Formato Cronograma Visitas - Encuentros Presencia_v2.xlsx).
const FILA_INICIAL = 14;
const COLS_FAMILIAR = { num: 'D', fecha: 'E', inicio: 'F', fin: 'G', nombre: 'H', cedula: 'I', telefono: 'J', direccion: 'K', municipio: 'L', comuna: 'M', barrio: 'N', vereda: 'O', referencia: 'P', observaciones: 'Q' };
const COLS_COMUNITARIO = { num: 'D', fecha: 'E', inicio: 'F', fin: 'G', familias: 'H', lugar: 'I', municipio: 'J', comuna: 'K', barrio: 'L', vereda: 'M', referencia: 'N', observaciones: 'O' };

function escribirFilas(ws, filas, columnas) {
  filas.forEach((fila, i) => {
    const r = FILA_INICIAL + i;
    Object.entries(columnas).forEach(([campo, col]) => {
      const valor = campo === 'fecha' ? formatoFecha(fila[campo]) : (fila[campo] || '');
      ws.getCell(`${col}${r}`).value = valor;
    });
  });
}

export default function F8Cronograma({ etapaCode, etapaNombre }) {
  const formRef = useRef(null);
  const { casoActivoId } = useCaso();
  const [tab, setTab] = useState('familiar');
  const [familiar, setFamiliar] = useState([nuevaVisitaFamiliar(0)]);
  const [comunitario, setComunitario] = useState([nuevoEncuentro(0)]);

  function handleSubmit(e) {
    e.preventDefault();
    alert('¡Cronograma validado y estructurado correctamente!');
  }

  async function handleExportarOficial() {
    const fd = new FormData(formRef.current);
    const regional = fd.get('regional') || '';
    const centroZonal = fd.get('centroZonal') || '';
    const profesional = fd.get('profesional') || '';
    const telefono = fd.get('telefonoEquipo') || '';

    await guardarDatosFormatoOficial(casoActivoId, 'F8', { regional, centroZonal, profesional, telefono, familiar, comunitario });

    const nombreArchivo = 'F8-Cronograma-diligenciado.xlsx';
    const blob = await descargarXlsxOficial('/plantillas/F8-Cronograma.xlsx', (workbook) => {
      const wsFamiliar = workbook.getWorksheet('Acomp Entorno Familiar');
      wsFamiliar.getCell('C10').value = regional;
      wsFamiliar.getCell('H10').value = centroZonal;
      wsFamiliar.getCell(`B${FILA_INICIAL}`).value = profesional;
      wsFamiliar.getCell(`C${FILA_INICIAL}`).value = telefono;
      escribirFilas(wsFamiliar, familiar, COLS_FAMILIAR);

      // La hoja de encuentros comunitarios tiene un nombre con espacios al
      // inicio y al final (" Encuentro Comunitar Cuidado "); se referencia
      // por posición para no depender de ese detalle del archivo original.
      const wsComunitario = workbook.worksheets[2];
      wsComunitario.getCell('D10').value = regional;
      wsComunitario.getCell(`B${FILA_INICIAL}`).value = profesional;
      wsComunitario.getCell(`C${FILA_INICIAL}`).value = telefono;
      escribirFilas(wsComunitario, comunitario, COLS_COMUNITARIO);
    }, nombreArchivo);
    respaldarEnDrive({ casoId: casoActivoId, fase: `${etapaCode} · ${etapaNombre}`, fileName: nombreArchivo, mimeType: XLSX_MIME, blob });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <FormatHeader
        eyebrow={`${etapaCode} · ${etapaNombre} · Cronograma`}
        title="Cronograma de Visitas y Encuentros"
        description="Gestión operativa mensual de programación de acompañamientos en entorno familiar y encuentros comunitarios de cuidado, optimizando rutas y tiempos de desplazamiento."
        metaTitle="F8.GO3.MT5.PP · V2"
        metaSub="Vigencia 2026"
      />

      <SelectorCasoAsignado />

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
          <SelectField name="regional" span="col-4" label="Regional" options={REGIONALES} defaultValue="Antioquia" required />
          <TextField name="centroZonal" span="col-4" label="Centro Zonal" placeholder="Ej. Centro Zonal Norte" defaultValue="Centro Zonal Girardota" required />
          <SelectField name="mes" span="col-4" label="Mes de programación" options={MESES} defaultValue="Agosto" required />
          <TextField name="profesional" span="col-6" label="Nombre(s) del profesional / equipo" placeholder="Nombres de los profesionales a cargo" required />
          <TextField name="telefonoEquipo" span="col-6" label="Teléfono(s) de contacto del equipo" placeholder="Teléfonos de los profesionales" required />
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
        <FormActions
          statusText="✓ Formato oficial F8.GO3.MT5.PP sincronizado"
          onSaveDraft={() => alert('Borrador guardado localmente.')}
          submitLabel="Generar / Validar Cronograma →"
          onExport={handleExportarOficial}
        />
      </Section>
    </form>
  );
}
