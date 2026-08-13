import { AMBITOS } from '../data/ambitos.js';

// Agrupa las 13 esferas en 4 capas conceptuales (de lo más cercano a la
// persona hacia el entorno más amplio) más el Proyecto de Vida como cierre
// integrador. Es un ordenamiento pedagógico para presentar el módulo, no
// una taxonomía oficial adicional — cada esfera sigue siendo independiente
// en ambitos.js.
const CAPAS = [
  {
    id: 'persona',
    badge: '1',
    nombre: 'La persona',
    desc: 'Punto de partida: qué recursos internos, intereses y estado de ánimo reconoce la persona en sí misma.',
    esferas: ['A', 'B', 'G'],
  },
  {
    id: 'familia',
    badge: '2',
    nombre: 'La familia',
    desc: 'Cómo funciona el sistema familiar más cercano: comunicación, roles, crianza y capacidad de adaptarse ante la crisis.',
    esferas: ['C', 'E'],
  },
  {
    id: 'redes',
    badge: '3',
    nombre: 'Relaciones y redes',
    desc: 'Con quién cuenta la persona y la familia más allá del hogar: apoyo social, vínculos naturales e institucionales.',
    esferas: ['D', 'F'],
  },
  {
    id: 'contexto',
    badge: '4',
    nombre: 'El contexto',
    desc: 'El entorno más amplio en el que vive la familia: educación, trabajo, condiciones materiales, cultura y territorio.',
    esferas: ['H', 'I', 'J', 'K', 'L'],
  },
  {
    id: 'proyecto',
    badge: 'M',
    nombre: 'Proyecto de vida',
    desc: 'Reúne lo explorado en las 12 esferas anteriores en una sola lectura orientadora sobre hacia dónde quiere ir la persona.',
    esferas: ['M'],
    final: true,
  },
];

export default function EsferasDiagrama() {
  const nombrePorCodigo = {};
  const propositoPorCodigo = {};
  for (const ambito of AMBITOS) {
    nombrePorCodigo[ambito.codigo] = ambito.nombre;
    propositoPorCodigo[ambito.codigo] = ambito.proposito;
  }

  return (
    <div className="esferas-diagrama">
      <div className="esferas-diagrama-intro">
        <h3>¿Cómo se organizan las 13 esferas?</h3>
        <p>
          No son 13 casillas sueltas para llenar: van de lo más cercano a la persona hacia el entorno más amplio que
          la rodea, en cuatro grupos. Lo que se explora en cada uno converge al final en el <b>proyecto de vida</b> —
          la lectura que integra el conjunto en vez de dejarlo disperso entre herramientas sueltas.
        </p>
      </div>
      <div className="esferas-capas">
        {CAPAS.map((capa) => (
          <div key={capa.id} className={capa.final ? 'esferas-capa esferas-capa-final' : 'esferas-capa'}>
            <div className="esferas-capa-head">
              <span className="esferas-capa-num">{capa.badge}</span>
              <div>
                <h4>{capa.nombre}</h4>
                <p>{capa.desc}</p>
              </div>
            </div>
            <div className="esferas-capa-chips">
              {capa.esferas.map((cod) => (
                <a
                  key={cod}
                  href={`#esfera-${cod}`}
                  className="esferas-chip"
                  title={`Ir a ${nombrePorCodigo[cod]} — ${propositoPorCodigo[cod]}`}
                >
                  {cod} · {nombrePorCodigo[cod]}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
