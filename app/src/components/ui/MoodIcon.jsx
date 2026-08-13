// Ícono de "carita" minimalista en trazo (mismo estilo que los íconos del
// Sidebar/TopBar: stroke="currentColor", sin relleno), para indicar el
// sentimiento de una opción de escala de acuerdo/desacuerdo sin depender
// de un emoji nativo (que se ve distinto según el sistema operativo y
// desentona con el resto de la interfaz).
const BOCA = {
  'fuerte-desacuerdo': 'M8 16.5c1-2 3-2.8 4-2.8s3 .8 4 2.8',
  desacuerdo: 'M8.5 15.5c.8-1 2.2-1.4 3.5-1.4s2.7.4 3.5 1.4',
  neutral: 'M8.5 15h7',
  acuerdo: 'M8.5 14c.8 1 2.2 1.4 3.5 1.4s2.7-.4 3.5-1.4',
  'fuerte-acuerdo': 'M7.5 13.5c1.2 1.8 3 2.8 4.5 2.8s3.3-1 4.5-2.8',
};

export default function MoodIcon({ mood, size = 16 }) {
  const boca = BOCA[mood];
  if (!boca) return null;
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ verticalAlign: 'middle', marginRight: 4 }}
    >
      <circle cx="12" cy="12" r="9.25" />
      <circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <path d={boca} />
    </svg>
  );
}
