// Los 10 "usuarios" de la simulación: 5 cuentas reales de profesional ICBF
// (auth.users + profiles) y 5 casos-beneficiario (sin cuenta, con código de
// acceso — así es como modela roles la app, ver README.md "Alcance del
// control de acceso"). Todo lo demo queda marcado para poder deshacerlo con
// `node scripts/seed-demo.mjs --reset`:
//   - cuentas ICBF: correo terminado en DOMINIO_DEMO
//   - casos: numero_peticion con PREFIJO_DEMO
export const DOMINIO_DEMO = '@presencia-icbf.demo';
export const PREFIJO_DEMO = 'DEMO-';

export const PROFESIONALES_ICBF = [
  { key: 'ICBF1', nombre: 'Laura Marcela Higuita Zapata', centroZonal: 'Centro Zonal Norte — Bello' },
  { key: 'ICBF2', nombre: 'Jhon Fredy Bedoya Ramírez', centroZonal: 'Centro Zonal Aburrá Sur — Itagüí' },
  { key: 'ICBF3', nombre: 'Diana Carolina Ospina Muñoz', centroZonal: 'Centro Zonal Oriente — Rionegro' },
  { key: 'ICBF4', nombre: 'Andrés Felipe Correa Villa', centroZonal: 'Centro Zonal Urabá — Apartadó' },
  { key: 'ICBF5', nombre: 'Sandra Milena Zuluaga Peláez', centroZonal: 'Centro Zonal Suroeste — Andes' },
].map((p, i) => ({
  ...p,
  email: `demo.icbf${i + 1}${DOMINIO_DEMO}`,
  password: `Demo${2026 + i}#Icbf!`,
}));

// t = intensidad objetivo (0 = muy vulnerable, 1 = muy consolidado) que usa
// el motor de perfilamiento para sesgar las respuestas simuladas; noise =
// dispersión item a item; atipicoRatio = probabilidad de que un ítem
// puntual "salte" al extremo contrario (patrones divergentes, ver
// perfilamientoEngine.mjs). 'atipico' además ignora `t` por instrumento y
// sortea uno distinto para cada uno de los 25 (incoherencia ENTRE
// instrumentos, no solo dentro de uno).
export const BENEFICIARIOS = [
  {
    key: 'B1',
    nombre: 'María Fernanda Restrepo Osorio',
    municipio: 'Girardota',
    modo: 'intermedio',
    t: 0.55,
    noise: 0.10,
    atipicoRatio: 0,
    fqolAplicaDiscapacidad: false,
    redSocial: 'media',
  },
  {
    key: 'B2',
    nombre: 'Jorge Iván Pérez Ceballos',
    municipio: 'Copacabana',
    modo: 'intermedio_tension',
    t: 0.42,
    noise: 0.16,
    atipicoRatio: 0.06,
    fqolAplicaDiscapacidad: false,
    redSocial: 'media',
  },
  {
    key: 'B3',
    nombre: 'Luz Dary Agudelo Montoya',
    municipio: 'Envigado',
    modo: 'extremo_alto',
    t: 0.90,
    noise: 0.05,
    atipicoRatio: 0,
    fqolAplicaDiscapacidad: false,
    redSocial: 'alta',
  },
  {
    key: 'B4',
    nombre: 'Wilmar Andrés Tabares Loaiza',
    municipio: 'Apartadó',
    modo: 'extremo_bajo',
    t: 0.10,
    noise: 0.08,
    atipicoRatio: 0.05,
    fqolAplicaDiscapacidad: true,
    redSocial: 'baja',
  },
  {
    key: 'B5',
    nombre: 'Yesenia Del Socorro Palacio Mena',
    municipio: 'Turbo',
    modo: 'atipico',
    t: 0.5,
    noise: 0.30,
    atipicoRatio: 0.25,
    fqolAplicaDiscapacidad: false,
    redSocial: 'atipica',
  },
].map((b, i) => ({ ...b, numeroPeticion: `${PREFIJO_DEMO}${b.key}`, asignarA: i }));
