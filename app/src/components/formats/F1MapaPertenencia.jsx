import { useMemo, useState } from 'react';
import FormatHeader from '../ui/FormatHeader.jsx';
import Section from '../ui/Section.jsx';
import DataTable from '../ui/DataTable.jsx';
import Callout from '../ui/Callout.jsx';
import FormActions from '../ui/FormActions.jsx';
import PatternCard from '../ui/PatternCard.jsx';
import Tooltip from '../ui/Tooltip.jsx';
import { TIPOS_APOYO, leerRed, compararActualPotencial } from '../../lib/lecturaRed.js';
import { GLOSARIO_AMBITOS, GLOSARIO_CIRCULOS, GLOSARIO_APOYOS, GLOSARIO_MAPAS } from '../../data/glosarioMapaPertenencia.js';
import { guardarDatosFormatoOficial } from '../../lib/persistenciaCaso.js';
import { guardarFormatoBeneficiario } from '../../lib/persistenciaBeneficiario.js';
import { useCaso } from '../../context/CasoContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import SelectorCasoAsignado from './SelectorCasoAsignado.jsx';

// Fuente: f1.go3_.mt5_.pp_mapa_pertenencia_actual_potencial_v1.docx
const CUADRANTES = ['Familia', 'Ocupación', 'Instituciones y profesionales', 'Vida Social'];
const CIRCULOS = ['Interior', 'Intermedio', 'Externo'];
const RADIO_POR_CIRCULO = { Interior: 50, Intermedio: 92, Externo: 134 };
const RADIO_ETIQUETA = 150;
const CENTRO = 210; // viewBox cuadrado de 420 · deja margen suficiente para que ninguna etiqueta se corte
const RANGO_ANGULAR = { Familia: [-45, 45], 'Ocupación': [45, 135], 'Instituciones y profesionales': [135, 225], 'Vida Social': [225, 315] };
const COLOR_CUADRANTE = { Familia: '#7ac142', 'Ocupación': '#1a5c50', 'Instituciones y profesionales': '#b8860b', 'Vida Social': '#7a4fb5' };

const COLUMNAS = [
  { key: 'nombre', label: 'Persona / institución', placeholder: 'Nombre' },
  { key: 'cuadrante', label: 'Ámbito', type: 'select', options: CUADRANTES },
  { key: 'circulo', label: 'Cercanía', type: 'select', options: CIRCULOS },
  { key: 'apoyos', label: 'Tipo de apoyo', type: 'checkboxes', options: TIPOS_APOYO },
  { key: 'nota', label: 'Nota (opcional)', placeholder: 'Detalle del vínculo...' },
];
const nuevoVinculo = () => ({ nombre: '', cuadrante: 'Familia', circulo: 'Interior', apoyos: [], nota: '' });

function polar(angleDeg, radius) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CENTRO + radius * Math.cos(rad), y: CENTRO + radius * Math.sin(rad) };
}

function calcularPosiciones(contactos) {
  const grupos = {};
  contactos.forEach((c, i) => {
    const key = `${c.cuadrante}|${c.circulo}`;
    (grupos[key] ||= []).push(i);
  });
  const posiciones = new Array(contactos.length);
  Object.entries(grupos).forEach(([key, idxs]) => {
    const [cuadrante, circulo] = key.split('|');
    const [start, end] = RANGO_ANGULAR[cuadrante] || [0, 90];
    const radius = RADIO_POR_CIRCULO[circulo] || 92;
    idxs.forEach((idx, n) => {
      const angleDeg = start + ((end - start) * (n + 1)) / (idxs.length + 1);
      posiciones[idx] = polar(angleDeg, radius);
    });
  });
  return posiciones;
}

// Leyenda interactiva: cada categoría del método explicada con un tooltip,
// para consultar el sentido de cada opción mientras se construye el mapa
// junto con la familia o la persona.
function Leyenda() {
  return (
    <div className="legend">
      <div className="legend-row">
        <span className="legend-label">Ámbitos</span>
        {CUADRANTES.map((a) => (
          <Tooltip key={a} text={GLOSARIO_AMBITOS[a]}>
            <span className="legend-chip"><span className="dot" style={{ background: COLOR_CUADRANTE[a] }} />{a}</span>
          </Tooltip>
        ))}
      </div>
      <div className="legend-row">
        <span className="legend-label">Cercanía</span>
        {CIRCULOS.map((c) => (
          <Tooltip key={c} text={GLOSARIO_CIRCULOS[c]}>
            <span className="legend-chip"><span className="ico">○</span>{c}</span>
          </Tooltip>
        ))}
      </div>
      <div className="legend-row">
        <span className="legend-label">Tipo de apoyo</span>
        {TIPOS_APOYO.map((a) => (
          <Tooltip key={a} text={GLOSARIO_APOYOS[a]}>
            <span className="legend-chip"><span className="ico">?</span>{a}</span>
          </Tooltip>
        ))}
      </div>
      <div className="legend-row">
        <span className="legend-label">Los mapas</span>
        {Object.keys(GLOSARIO_MAPAS).map((m) => (
          <Tooltip key={m} text={GLOSARIO_MAPAS[m]}>
            <span className="legend-chip"><span className="ico">◎</span>{m}</span>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

function MapaSVG({ contactos }) {
  const posiciones = useMemo(() => calcularPosiciones(contactos), [contactos]);
  const borde = CENTRO * 2;
  return (
    <svg viewBox={`0 0 ${borde} ${borde}`} style={{ width: '100%', maxWidth: 460, display: 'block', margin: '0 auto' }}>
      {[
        { r: 134, nombre: 'Externo' },
        { r: 92, nombre: 'Intermedio' },
        { r: 50, nombre: 'Interior' },
      ].map(({ r, nombre }) => (
        <circle key={r} cx={CENTRO} cy={CENTRO} r={r} fill="none" stroke="var(--border)" strokeWidth="1">
          <title>{`Círculo ${nombre}: ${GLOSARIO_CIRCULOS[nombre]}`}</title>
        </circle>
      ))}
      <line x1={CENTRO - 165} y1={CENTRO} x2={CENTRO + 165} y2={CENTRO} stroke="var(--border)" />
      <line x1={CENTRO} y1={CENTRO - 165} x2={CENTRO} y2={CENTRO + 165} stroke="var(--border)" />
      {CUADRANTES.map((q) => {
        const [start, end] = RANGO_ANGULAR[q];
        const { x, y } = polar((start + end) / 2, RADIO_ETIQUETA);
        const lineas = q.length > 16 ? q.split(' y ') : [q];
        return (
          <text key={q} x={x} y={y} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={COLOR_CUADRANTE[q]} style={{ cursor: 'help' }}>
            <title>{`${q}: ${GLOSARIO_AMBITOS[q]}`}</title>
            {lineas.length > 1
              ? lineas.map((linea, i) => <tspan key={linea} x={x} dy={i === 0 ? 0 : 11}>{i === 0 ? `${linea} y` : linea}</tspan>)
              : q}
          </text>
        );
      })}
      {contactos.map((c, i) => {
        const pos = posiciones[i];
        if (!pos || !c.nombre) return null;
        const explicacion = `${c.nombre} · ${c.cuadrante} · Círculo ${c.circulo}${c.apoyos?.length ? ` · Apoyo: ${c.apoyos.join(', ')}` : ''}`;
        return (
          <g key={i} style={{ cursor: 'help' }}>
            <circle cx={pos.x} cy={pos.y} r="6" fill={COLOR_CUADRANTE[c.cuadrante]} stroke="#fff" strokeWidth="1.5">
              <title>{explicacion}</title>
            </circle>
            <text x={pos.x} y={pos.y - 10} textAnchor="middle" fontSize="7" fill="var(--text)">{c.nombre}</text>
          </g>
        );
      })}
    </svg>
  );
}

function LecturaDelMapa({ contactos }) {
  const lectura = leerRed(contactos);
  return (
    <>
      <div className="lectura-perfil">
        <div>
          <b>{lectura.perfil.nombre}</b>
          <span>{lectura.perfil.descripcion}</span>
        </div>
      </div>
      {lectura.total > 0 && (
        <div className="lectura-metrics">
          <div><b>{lectura.total}</b><span>Vínculos registrados</span></div>
          <div><b>{lectura.diversidad.presentes}/{lectura.diversidad.total}</b><span>Ámbitos representados</span></div>
          <div><b>{lectura.proximidad}/100</b><span>Índice de proximidad</span></div>
          <div><b>{lectura.naturaleza.porcentajeNatural}%</b><span>Red natural (no institucional)</span></div>
        </div>
      )}
      {lectura.patrones.length > 0 ? (
        <div className="pattern-list">
          {lectura.patrones.map((p) => <PatternCard key={p.codigo} patron={p} />)}
        </div>
      ) : (
        <Callout>Agregue vínculos con nombre, ámbito y círculo de cercanía para que el motor de lectura genere hallazgos orientadores.</Callout>
      )}
      <Callout variant="warn">
        Estas lecturas son descriptivas, no diagnósticas: deben validarse conversando con la familia o la persona, y con el criterio profesional del Equipo de Acompañamiento.
      </Callout>
    </>
  );
}

function ComparacionActualPotencial({ actual, potencial }) {
  const { brechas, crecimiento, hayDatos } = compararActualPotencial(actual, potencial);
  if (!hayDatos) return null;
  return (
    <Section title="Comparación · mapa actual vs. mapa potencial" hint="Diferencias por ámbito entre lo que la familia percibe hoy y lo que quisiera proyectar.">
      {brechas.length > 0 ? (
        <div className="brecha-list">
          {brechas.map((b) => (
            <div className="brecha-row" key={b.ambito}>
              <span>{b.ambito}</span>
              <span>Actual: {b.actual} · Potencial: {b.potencial}</span>
              <span className={`valor ${b.diferencia > 0 ? 'up' : 'down'}`}>{b.diferencia > 0 ? `+${b.diferencia}` : b.diferencia}</span>
            </div>
          ))}
        </div>
      ) : (
        <Callout>No se registran diferencias por ámbito entre el mapa actual y el potencial todavía.</Callout>
      )}
      <Callout>
        {crecimiento > 0
          ? `El mapa potencial proyecta ${crecimiento} vínculo(s) más que el actual: una pista sobre las redes que la familia quisiera construir o fortalecer.`
          : crecimiento < 0
            ? 'El mapa potencial registra menos vínculos que el actual; puede valer la pena revisar si esto refleja lo que la familia realmente proyecta.'
            : 'El mapa potencial tiene el mismo número de vínculos que el actual.'}
      </Callout>
    </Section>
  );
}

export default function F1MapaPertenencia({ etapaCode, etapaNombre }) {
  const { casoActivoId, codigoAcceso } = useCaso();
  const { session } = useAuth();
  const [tipo, setTipo] = useState('actual');
  const [actual, setActual] = useState([nuevoVinculo()]);
  const [potencial, setPotencial] = useState([nuevoVinculo()]);
  const contactos = tipo === 'actual' ? actual : potencial;
  const setContactos = tipo === 'actual' ? setActual : setPotencial;

  async function handleSubmit(e) {
    e.preventDefault();
    // F1 es el único formato oficial que un beneficiario puede diligenciar
    // sin acompañamiento (ver formatos_metadata en
    // 0003_roles_bolsa_asignacion.sql) — sin sesión, el guardado pasa por
    // el código de acceso en vez de la ruta de staff.
    const { guardado } = session
      ? await guardarDatosFormatoOficial(casoActivoId, 'F1', { actual, potencial })
      : await guardarFormatoBeneficiario(codigoAcceso, 'F1', { actual, potencial });
    alert(guardado ? '¡Mapa de pertenencia guardado con éxito!' : 'No hay un caso activo (o falló el guardado) — el mapa no quedó guardado en el servidor.');
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormatHeader
        eyebrow={`${etapaCode} · ${etapaNombre} · Redes de apoyo`}
        title="Mapa de Pertenencia Actual y Potencial"
        description="Herramienta para identificar el sistema de vinculación más significativo de la familia o la persona: quiénes la acompañan, en qué ámbito de su vida y qué tan cerca los siente."
        metaTitle="F1.GO3.MT5.PP · V1"
        metaSub="Cartografía de redes de apoyo"
      />

      <SelectorCasoAsignado />

      <details className="finstructions">
        <summary>Cómo se construye el mapa (ver guía)</summary>
        <p style={{ margin: '10px 0' }}>La red se organiza en cuatro ámbitos de la vida y en tres círculos de cercanía. Pasa el cursor sobre cada chip de la leyenda —o sobre el propio diagrama— para ver su explicación mientras conversas con la familia o la persona.</p>
        <ul>
          {CIRCULOS.map((c) => <li key={c}><b>{c}:</b> {GLOSARIO_CIRCULOS[c]}</li>)}
        </ul>
        <p style={{ margin: '10px 0' }}>Cada vínculo puede además aportar uno o varios tipos de apoyo:</p>
        <ul>
          {TIPOS_APOYO.map((a) => <li key={a}><b>{a}:</b> {GLOSARIO_APOYOS[a]}</li>)}
        </ul>
        <p style={{ margin: '10px 0 0' }}><b>Mapa actual:</b> {GLOSARIO_MAPAS.Actual} <b>Mapa potencial:</b> {GLOSARIO_MAPAS.Potencial}</p>
      </details>

      <div className="ftabs">
        <button type="button" className={`ftab${tipo === 'actual' ? ' active' : ''}`} onClick={() => setTipo('actual')}>Diagrama 1 · Mapa Actual (lo que percibo)</button>
        <button type="button" className={`ftab${tipo === 'potencial' ? ' active' : ''}`} onClick={() => setTipo('potencial')}>Diagrama 2 · Mapa Potencial (lo que quisiera)</button>
      </div>

      <Section title={tipo === 'actual' ? 'Vínculos del mapa actual' : 'Vínculos del mapa potencial'} hint="Agregue cada persona o institución relevante, ubicándola en su ámbito, círculo de cercanía y el tipo de apoyo que brinda. Pase el cursor sobre cada chip para recordar su significado.">
        <Leyenda />
        <DataTable columns={COLUMNAS} rows={contactos} onChange={setContactos} newRow={nuevoVinculo} />
      </Section>

      <Section title="Visualización del mapa" hint="Se genera automáticamente a partir de los vínculos registrados. Pase el cursor sobre los ámbitos, los círculos o cada punto para ver su explicación.">
        <MapaSVG contactos={contactos} />
      </Section>

      <Section title="Lectura del mapa" hint="Motor de lectura de red: convierte los vínculos registrados en patrones, hipótesis orientadoras y preguntas para conversar con la familia.">
        <LecturaDelMapa contactos={contactos} />
      </Section>

      <ComparacionActualPotencial actual={actual} potencial={potencial} />

      <Section>
        <FormActions statusText="✓ Mapa de pertenencia parametrizado" onSaveDraft={() => alert('Borrador guardado localmente.')} submitLabel="Guardar mapa →" />
      </Section>
    </form>
  );
}
