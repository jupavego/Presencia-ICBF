// Sube y lista evidencias de un caso en Google Drive, autenticado como la
// propia cuenta Gmail dedicada vía OAuth2 (no una cuenta de servicio: en
// una cuenta personal las cuentas de servicio no tienen cupo de
// almacenamiento propio — ver intento anterior, error
// "storageQuotaExceeded"). El refresh token se generó una sola vez de
// forma manual (consentimiento de presencia.icbf.antioquia@gmail.com) y
// vive como secreto; esta función lo cambia por un access token nuevo en
// cada llamada. Nunca se llama directo desde el navegador — es el único
// lugar que toca estas credenciales, autenticada con el JWT del usuario
// de Supabase (staff, o un beneficiario con cuenta propia — ver
// 0004_beneficiario_autenticado.sql) o, sin sesión, con un `codigoAcceso`
// válido para ESE caso puntual (mismo mecanismo que ya usan
// crear_caso_beneficiario/obtener_caso_por_codigo).
//
// El folder raíz NO es el creado a mano en la UI de Drive: el scope
// usado (drive.file) solo da acceso a archivos/carpetas que esta misma
// app crea (o que el usuario abre con un selector), así que la función
// crea su propia carpeta raíz la primera vez y la reutiliza después
// (ensureFolder es idempotente — la busca antes de crear).
//
// Estructura de carpetas dentro de la raíz:
//   <Profesional o "Sin asignar"> / <Beneficiario> / <Fase>
//
// Acciones (POST, body JSON):
//   { action: 'upload', casoId, fase, fileName, mimeType, contentBase64, codigoAcceso? }
//   { action: 'list', casoId, codigoAcceso? }
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const OAUTH_CLIENT_ID = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID')!;
const OAUTH_CLIENT_SECRET = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET')!;
const OAUTH_REFRESH_TOKEN = Deno.env.get('GOOGLE_OAUTH_REFRESH_TOKEN')!;
const ROOT_FOLDER_NAME = 'Presencia ICBF - Expedientes 2026';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

// Cambia el refresh token de larga duración por un access token nuevo
// (válido ~1 hora) — flujo estándar OAuth2 "refresh_token grant".
async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET,
      refresh_token: OAUTH_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error('No se pudo autenticar con Google: ' + JSON.stringify(data));
  return data.access_token as string;
}

function escapeDriveQueryValue(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function findFolder(name: string, parentId: string, token: string) {
  const q = `name = '${escapeDriveQueryValue(name)}' and '${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)&supportsAllDrives=true&includeItemsFromAllDrives=true`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error('Drive (buscar carpeta): ' + JSON.stringify(data));
  return data.files?.[0]?.id as string | undefined;
}

async function createFolder(name: string, parentId: string, token: string) {
  const res = await fetch('https://www.googleapis.com/drive/v3/files?supportsAllDrives=true', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, mimeType: 'application/vnd.google-apps.folder', parents: [parentId] }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Drive (crear carpeta): ' + JSON.stringify(data));
  return data.id as string;
}

async function ensureFolder(name: string, parentId: string, token: string) {
  const existing = await findFolder(name, parentId, token);
  if (existing) return existing;
  return createFolder(name, parentId, token);
}

async function ensurePath(segments: string[], rootId: string, token: string) {
  let parent = rootId;
  for (const seg of segments) {
    parent = await ensureFolder(seg, parent, token);
  }
  return parent;
}

async function uploadFile(folderId: string, fileName: string, mimeType: string, bytes: Uint8Array, token: string) {
  const boundary = 'presencia_' + crypto.randomUUID();
  const encoder = new TextEncoder();
  const metadata = JSON.stringify({ name: fileName, parents: [folderId] });
  const pre = encoder.encode(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n` +
      `--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`,
  );
  const post = encoder.encode(`\r\n--${boundary}--`);
  const body = new Uint8Array(pre.length + bytes.length + post.length);
  body.set(pre, 0);
  body.set(bytes, pre.length);
  body.set(post, pre.length + bytes.length);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,createdTime&supportsAllDrives=true',
    { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': `multipart/related; boundary=${boundary}` }, body },
  );
  const data = await res.json();
  if (!res.ok) throw new Error('Drive (subir archivo): ' + JSON.stringify(data));
  return data;
}

async function listChildren(folderId: string, token: string) {
  const q = `'${folderId}' in parents and trashed = false`;
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,webViewLink,createdTime,mimeType)&orderBy=createdTime desc&supportsAllDrives=true&includeItemsFromAllDrives=true`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error('Drive (listar): ' + JSON.stringify(data));
  return (data.files ?? []) as Array<{ id: string; name: string; webViewLink: string; createdTime: string; mimeType: string }>;
}

const FOLDER_MIME = 'application/vnd.google-apps.folder';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Método no soportado' }, 405);

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { global: { headers: { Authorization: authHeader } } });

    const body = await req.json();
    const { action, casoId, codigoAcceso } = body ?? {};
    if (!casoId) return json({ error: 'Falta casoId' }, 400);

    // Autorización — dos caminos posibles, probados en orden. No se
    // ramifica según si vino un header Authorization: el cliente de
    // supabase-js manda uno siempre (la anon key, si no hay sesión), así
    // que lo que importa es si `getUser()` resuelve un usuario real, no
    // si el header está presente.
    //  1. Con sesión real (staff, o beneficiario con cuenta): se intenta
    //     leer el caso con el JWT del que llama. Para staff, la RLS de
    //     `casos` deja ver cualquiera; para un beneficiario con cuenta,
    //     solo el suyo (creado_por = auth.uid(), vía
    //     0004_beneficiario_autenticado.sql) — si no es su caso, la
    //     consulta no devuelve nada y se sigue al paso 2 por si acaso
    //     mandó también un código válido.
    //  2. Sin sesión resuelta (invitado): solo se acepta si el body trae
    //     un `codigoAcceso` que resuelva, vía obtener_caso_por_codigo
    //     (security definer, ya otorgada a anon), exactamente al
    //     `casoId` pedido — nunca se confía en un `casoId` suelto sin
    //     validar contra el código.
    let caso: { id: string; nombre_participante: string | null; numero_peticion: string | null; asignado_a: string | null } | null = null;

    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      const { data: casoRow } = await supabase
        .from('casos')
        .select('id, nombre_participante, numero_peticion, asignado_a')
        .eq('id', casoId)
        .maybeSingle();
      caso = casoRow ?? null;
    }

    if (!caso && codigoAcceso) {
      const { data: casoPorCodigo } = await supabase.rpc('obtener_caso_por_codigo', { p_codigo: codigoAcceso });
      if (casoPorCodigo && casoPorCodigo.id === casoId) caso = casoPorCodigo;
    }

    if (!caso) return json({ error: 'No autorizado para este caso' }, 401);

    let profesionalNombre = 'Sin asignar';
    if (caso.asignado_a) {
      // RPC en vez de select directo a `profiles`: esa tabla es staff-only
      // desde 0004_beneficiario_autenticado.sql, y quien sube evidencia
      // puede ser un beneficiario (con cuenta o con código) — esta función
      // (0005_nombre_staff_rpc.sql) solo expone el nombre, nada más.
      const { data: nombreProf } = await supabase.rpc('obtener_nombre_staff', { p_id: caso.asignado_a });
      profesionalNombre = nombreProf || 'Profesional sin nombre';
    }
    const beneficiarioNombre = caso.nombre_participante || caso.numero_peticion || String(caso.id).slice(0, 8);

    const token = await getAccessToken();
    const rootFolderId = await ensureFolder(ROOT_FOLDER_NAME, 'root', token);

    if (action === 'upload') {
      const { fase, fileName, mimeType, contentBase64 } = body;
      if (!fase || !fileName || !mimeType || !contentBase64) return json({ error: 'Faltan datos del archivo (fase, fileName, mimeType, contentBase64)' }, 400);
      const folderId = await ensurePath([profesionalNombre, beneficiarioNombre, fase], rootFolderId, token);
      const bytes = Uint8Array.from(atob(contentBase64), (c) => c.charCodeAt(0));
      const file = await uploadFile(folderId, fileName, mimeType, bytes, token);
      return json({ file });
    }

    if (action === 'list') {
      const folderId = await ensurePath([profesionalNombre, beneficiarioNombre], rootFolderId, token);
      const children = await listChildren(folderId, token);
      const faseFolders = children.filter((f) => f.mimeType === FOLDER_MIME);
      const sueltos = children.filter((f) => f.mimeType !== FOLDER_MIME);
      const fases = await Promise.all(
        faseFolders.map(async (f) => ({ fase: f.name, files: await listChildren(f.id, token) })),
      );
      return json({ sueltos, fases });
    }

    return json({ error: `Acción no reconocida: ${action}` }, 400);
  } catch (err) {
    console.error(err);
    return json({ error: String((err as Error)?.message || err) }, 500);
  }
});
