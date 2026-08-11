import { useMemo, useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import { TextField, TextAreaField } from '../ui/Field.jsx';
import CheckboxGrid from '../ui/CheckboxGrid.jsx';
import DataTable from '../ui/DataTable.jsx';
import Callout from '../ui/Callout.jsx';
import FormActions from '../ui/FormActions.jsx';

const CATEGORIAS_DISCAPACIDAD = ['Física', 'Visual', 'Auditiva', 'Sordoceguera', 'Psicosocial', 'Intelectual', 'Múltiple'];

const COLUMNAS_INVERSION = [
  { key: 'fecha', label: 'Fecha de la compra', type: 'date' },
  { key: 'soporte', label: 'Documento soporte (N° factura)', placeholder: 'Ej. FE-1234' },
  { key: 'establecimiento', label: 'Nombre del establecimiento', placeholder: 'Comercio o proveedor' },
  { key: 'detalle', label: 'Detalle de producto', placeholder: 'Descripción del bien o servicio' },
  { key: 'valor', label: 'Valor ($)', type: 'number', placeholder: '0.00' },
];
const nuevaCompra = () => ({ fecha: '', soporte: '', establecimiento: '', detalle: '', valor: '' });

export default function F10SeguimientoRecurso({ etapaCode, etapaNombre }) {
  const [categorias, setCategorias] = useState([]);
  const [compras, setCompras] = useState([nuevaCompra()]);

  const total = useMemo(
    () => compras.reduce((sum, c) => sum + (parseFloat(c.valor) || 0), 0),
    [compras]
  );

  function handleSubmit(e) {
    e.preventDefault();
    alert('¡Seguimiento a la inversión del apoyo económico registrado con éxito!');
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormatHeader
        eyebrow={`${etapaCode} · ${etapaNombre} · Uso del recurso`}
        title="Seguimiento a la Inversión del Apoyo Económico"
        description="Registro y verificación de la inversión de recursos económicos otorgados para personas con discapacidad, conforme a los acuerdos del acompañamiento familiar."
        metaTitle="ICBF · Acciones Afirmativas"
        metaSub="Control de legalización"
      />

      <Section title="Datos básicos del seguimiento" hint="Información general del grupo familiar, beneficiario y centro zonal.">
        <div className="grid">
          <TextField span="col-4" label="Fecha del seguimiento" type="date" required />
          <TextField span="col-4" label="N° de solicitud" placeholder="Ej. SOL-2026-001" required />
          <TextField span="col-4" label="Centro Zonal" placeholder="Centro Zonal" required />
          <TextField span="col-6" label="Nombre del responsable del grupo familiar" placeholder="Nombre completo del responsable" required />
          <TextField span="col-6" label="Nombre del titular de la cuenta (si es diferente)" placeholder="Dejar en blanco si coincide con el responsable" />
          <TextField span="col-6" label="Nombre del niño, niña, adolescente o adulto con discapacidad" placeholder="Nombre completo del participante" required />
          <TextField span="col-6" label="Coordinador del Centro Zonal" placeholder="Nombre del coordinador" required />
          <div className="col-12">
            <CheckboxGrid
              cols={4}
              label="Categoría de discapacidad (marque con una X)"
              tip="Tipo de discapacidad que presenta la persona beneficiaria del apoyo económico, según la clasificación usada por el ICBF."
              options={CATEGORIAS_DISCAPACIDAD} selected={categorias} onChange={setCategorias}
            />
          </div>
        </div>
      </Section>

      <Section title="Información sobre la inversión del apoyo económico" hint="Relación detallada de compras, soportes de factura y valores ejecutados.">
        <DataTable columns={COLUMNAS_INVERSION} rows={compras} onChange={setCompras} newRow={nuevaCompra} />
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 24, fontSize: 12, fontWeight: 800 }}>
          <div>TOTAL INVERTIDO: <span style={{ color: 'var(--verde-oscuro)' }}>{total.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 })}</span></div>
          <div>SALDO PENDIENTE: <input type="number" placeholder="0.00" style={{ width: 130, display: 'inline-block', fontSize: 11 }} /></div>
        </div>
      </Section>

      <Section title="Profesionales responsables y normativa de legalización">
        <div className="grid">
          <TextAreaField span="col-12" label="Nombre de los profesionales que realizaron el seguimiento" placeholder="Ingrese los nombres y registros profesionales..." required />
        </div>

        <Callout variant="warn">
          <b>Nota operativa y condiciones de ejecución:</b><br />
          El seguimiento al apoyo económico debe realizarse conforme a los acuerdos establecidos con el Equipo de Acompañamiento Familiar y Comunitario. El responsable del grupo familiar deberá invertir la totalidad del recurso durante los 30 días del mes siguiente a la fecha de entrega. En caso de inversión parcial autorizada, debe responder a la consecución de un producto cuyo costo exceda el apoyo mensual. En ningún caso se podrá acumular por más de tres meses. Si el recurso no es legalizado en su totalidad y sin evidencias, constituirá inejecución sin derecho a pago ni acumulación.
          <div style={{ marginTop: 10, fontWeight: 800, color: 'var(--teal-900)' }}>Requisitos mínimos de legalización:</div>
          <ol>
            <li><b>Requisitos mínimos de la factura:</b> Identificación de emisor y receptor (beneficiario acciones afirmativas), fecha y hora, descripción de bienes/servicios (cantidad y presentación), valor total, forma y medio de pago, discriminación de IVA/Impuesto al Consumo, numeración consecutiva con resolución y fecha de vencimiento, CUFE y código QR.</li>
            <li><b>Documento equivalente:</b> Cuenta de cobro emitida por el vendedor no obligado a facturar.</li>
            <li><b>Transporte:</b> Tirillas de transporte intermunicipal; para transporte urbano (buses, taxi, moto), se legaliza con recibo de caja.</li>
          </ol>
        </Callout>

        <FormActions statusText="✓ Formato de seguimiento a inversión parametrizado" onSaveDraft={() => alert('Borrador guardado localmente.')} submitLabel="Generar Acta de Seguimiento →" />
      </Section>
    </form>
  );
}
