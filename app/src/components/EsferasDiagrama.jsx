import { useState } from 'react';
import { AMBITOS, SECCIONES } from '../data/ambitos.js';

// Diagrama de red compacto: agrupa las 13 esferas en 4 columnas
// conceptuales (de lo más cercano a la persona hacia el entorno más
// amplio) que convergen en un nodo final, el Proyecto de Vida. Es un
// ordenamiento pedagógico para presentar el módulo en un solo vistazo, no
// una taxonomía oficial adicional — cada esfera sigue siendo independiente
// en ambitos.js. Las secciones (nombre/esferas) vienen de SECCIONES en
// ambitos.js, que también usa AmbitosPanel.jsx para agrupar las tarjetas —
// aquí solo se agrega la posición (x) y el color de cada columna, que son
// detalles de este dibujo, no de la agrupación en sí. Los colores replican
// tokens.css (--teal-700, --verde, --info, --amber) porque el SVG no puede
// leer variables CSS por JS.
const PRESENTACION_COLUMNAS = { persona: { x: 90, color: '#1a5c50' }, familia: { x: 300, color: '#7ac142' }, redes: { x: 500, color: '#2d6cdf' }, contexto: { x: 700, color: '#b8860b' } };
const COLUMNAS = SECCIONES.map((seccion) => ({ ...seccion, ...PRESENTACION_COLUMNAS[seccion.id] }));

const HUB = { x: 900, codigo: 'M', nombre: 'Proyecto de vida' };
const CY = 190;
const GAP = 52;
const R = 17;
const HUB_R = 27;
const WIDTH = 990;
const HEIGHT = 340;

// Tamaño de la caja del tooltip (coordenadas del mismo viewBox que el
// diagrama, así no hace falta convertir a píxeles de pantalla).
const TT_W = 240;
const TT_H = 118;

function posicionesY(cantidad) {
  const inicio = -(cantidad - 1) / 2;
  return Array.from({ length: cantidad }, (_, i) => CY + (inicio + i) * GAP);
}

// Si el nodo está muy arriba, el tooltip se abre hacia abajo para no
// salirse del viewBox por encima de los encabezados de columna.
function cajaTooltip(x, y, radio) {
  const abajo = y < 150;
  const boxY = abajo ? y + radio + 12 : y - radio - TT_H - 12;
  const boxX = Math.min(Math.max(x - TT_W / 2, 6), WIDTH - TT_W - 6);
  return { boxX, boxY };
}

export default function EsferasDiagrama() {
  const [hover, setHover] = useState(null); // { cod, x, y, r, color, nombre, proposito }

  const nombrePorCodigo = {};
  const propositoPorCodigo = {};
  for (const ambito of AMBITOS) {
    nombrePorCodigo[ambito.codigo] = ambito.nombre;
    propositoPorCodigo[ambito.codigo] = ambito.proposito;
  }

  function nodoProps(cod, x, y, r, color) {
    return {
      onMouseEnter: () => setHover({ cod, x, y, r, color, nombre: nombrePorCodigo[cod], proposito: propositoPorCodigo[cod] }),
      onMouseLeave: () => setHover((h) => (h?.cod === cod ? null : h)),
      onFocus: () => setHover({ cod, x, y, r, color, nombre: nombrePorCodigo[cod], proposito: propositoPorCodigo[cod] }),
      onBlur: () => setHover((h) => (h?.cod === cod ? null : h)),
    };
  }

  return (
    <div className="esferas-diagrama">
      <div className="esferas-diagrama-intro">
        <h3>¿Cómo se organizan las 13 esferas?</h3>
        <p>
          De lo más cercano a la persona hacia el entorno más amplio, en cuatro grupos que convergen en el{' '}
          <b>proyecto de vida</b>. Pase el cursor sobre un nodo para ver el detalle, o haga clic para ir directo a esa
          herramienta.
        </p>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="esferas-red"
        role="img"
        aria-label="Diagrama de las 13 esferas agrupadas en 4 capas que convergen en el proyecto de vida"
      >
        {COLUMNAS.map((col) =>
          col.esferas.map((cod, i) => {
            const y = posicionesY(col.esferas.length)[i];
            const dx = (HUB.x - col.x) * 0.5;
            const d = `M ${col.x + R} ${y} C ${col.x + R + dx} ${y}, ${HUB.x - HUB_R - dx} ${CY}, ${HUB.x - HUB_R} ${CY}`;
            return <path key={`edge-${cod}`} d={d} className="esferas-edge" style={{ stroke: col.color }} />;
          }),
        )}

        {COLUMNAS.map((col) => {
          const ys = posicionesY(col.esferas.length);
          return (
            <g key={col.id}>
              <text x={col.x} y={24} textAnchor="middle" className="esferas-col-titulo">{col.nombre}</text>
              <text x={col.x} y={40} textAnchor="middle" className="esferas-col-sub">{col.sub}</text>
              {col.esferas.map((cod, i) => (
                <a
                  key={cod}
                  href={`#esfera-${cod}`}
                  className="esferas-nodo-link"
                  aria-label={`${cod} · ${nombrePorCodigo[cod]}`}
                  {...nodoProps(cod, col.x, ys[i], R, col.color)}
                >
                  <circle cx={col.x} cy={ys[i]} r={R} className="esferas-nodo" style={{ stroke: col.color }} />
                  <text x={col.x} y={ys[i] + 4} textAnchor="middle" className="esferas-nodo-txt" style={{ fill: col.color }}>
                    {cod}
                  </text>
                </a>
              ))}
            </g>
          );
        })}

        <a
          href={`#esfera-${HUB.codigo}`}
          className="esferas-nodo-link"
          aria-label={`${HUB.codigo} · ${nombrePorCodigo[HUB.codigo]}`}
          {...nodoProps(HUB.codigo, HUB.x, CY, HUB_R, 'var(--verde-oscuro)')}
        >
          <circle cx={HUB.x} cy={CY} r={HUB_R} className="esferas-hub" />
          <text x={HUB.x} y={CY + 5} textAnchor="middle" className="esferas-hub-txt">{HUB.codigo}</text>
        </a>
        <text x={HUB.x} y={CY + HUB_R + 22} textAnchor="middle" className="esferas-col-titulo">{HUB.nombre}</text>

        {hover && (() => {
          const { boxX, boxY } = cajaTooltip(hover.x, hover.y, hover.r);
          return (
            <foreignObject x={boxX} y={boxY} width={TT_W} height={TT_H} className="esferas-tooltip-fo">
              <div xmlns="http://www.w3.org/1999/xhtml" className="esferas-tooltip" style={{ borderColor: hover.color }}>
                <div className="esferas-tooltip-titulo" style={{ color: hover.color }}>{hover.cod} · {hover.nombre}</div>
                <div className="esferas-tooltip-desc">{hover.proposito}</div>
              </div>
            </foreignObject>
          );
        })()}
      </svg>
    </div>
  );
}
