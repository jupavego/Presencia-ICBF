import { useEffect, useState } from 'react';
import { useCaso } from '../context/CasoContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { obtenerUltimoFormatoOficial } from '../lib/persistenciaCaso.js';
import { obtenerUltimoFormatoBeneficiario } from '../lib/persistenciaBeneficiario.js';

// Hidratación compartida por los formatos oficiales (F1, F3, F6, F7, F8,
// F10): trae el `datos` del diligenciamiento más reciente para el caso
// activo, para que el formulario se abra con lo último guardado en vez de
// en blanco cada vez (ver F1MapaPertenencia.jsx y el resto — antes ninguno
// releía formatos_oficiales_datos al montar).
//
// Bifurca igual que ya hace F1MapaPertenencia.jsx al guardar: con sesión
// (staff), select directo permitido por la RLS de la fila del caso
// asignado/admin; sin sesión (beneficiario con código de acceso, solo
// aplica a F1), vía el RPC `obtener_ultimo_formato_por_codigo`.
//
// Devuelve `null` mientras carga o si no hay nada guardado todavía — cada
// formato decide qué hacer con eso (no pisar el estado inicial en blanco).
export function useUltimoFormatoOficial(formatoKey) {
  const { casoActivoId, codigoAcceso } = useCaso();
  const { session } = useAuth();
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    let cancelado = false;
    setDatos(null);

    async function cargar() {
      let resultado = null;
      if (session && casoActivoId) {
        resultado = await obtenerUltimoFormatoOficial(casoActivoId, formatoKey);
      } else if (!session && codigoAcceso) {
        resultado = await obtenerUltimoFormatoBeneficiario(codigoAcceso, formatoKey);
      }
      if (!cancelado) setDatos(resultado);
    }

    if ((session && casoActivoId) || (!session && codigoAcceso)) cargar();
    return () => { cancelado = true; };
  }, [session, casoActivoId, codigoAcceso, formatoKey]);

  return datos;
}
