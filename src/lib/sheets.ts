import {
  FyAfFullData,
  FyAfActividad,
  FyAfHorario,
  FyAfArancel,
  FyAfPromocion,
  FyAfContacto,
  FyAfConfiguracion,
} from '@/types/fyaf';
import { OFFICIAL_FALLBACK_DATA } from './data-fallback';
import { INITIAL_MEDIA_SLOTS } from './media-registry';

const SHEET_ID = process.env.GOOGLE_SHEETS_ID || '1a0uzrxAhvXyOn0wjDxwnTWU1EC9BWT3Xr2Q3GFkDvP4';

// Cache en memoria para SSR / API con TTL de 5 minutos
interface CacheEntry {
  data: FyAfFullData;
  timestamp: number;
}

let inMemoryCache: CacheEntry | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

/**
 * Función robusta para parsear CSV respetando comillas y saltos de línea
 */
export function parseCsv(text: string): string[][] {
  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // saltar comilla escapada
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentCell.trim());
      if (currentRow.some((c) => c !== '')) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell !== '' || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c !== '')) {
      lines.push(currentRow);
    }
  }

  return lines;
}

/**
 * Descarga una pestaña de Google Sheets vía gviz/tq
 */
async function fetchSheetTab(tabName: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    tabName
  )}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'DAOM-FyAF-Web/1.0',
    },
    next: { revalidate: 300 }, // 5 min Next.js cache
  });

  if (!res.ok) {
    throw new Error(`Error HTTP ${res.status} al consultar pestaña ${tabName}`);
  }

  const csvText = await res.text();
  if (!csvText || csvText.trim().length === 0) {
    return [];
  }

  return parseCsv(csvText);
}

/**
 * Normaliza y valida la información obtenida de Google Sheets
 */
function normalizeSheetData(
  rawActividades: string[][],
  rawHorarios: string[][],
  rawAranceles: string[][],
  rawPromociones: string[][],
  rawContactos: string[][],
  rawConfiguracion: string[][]
): FyAfFullData | null {
  // Si las pestañas críticas vienen vacías o sin filas de datos (>1 por el header), devolvemos null
  if (rawActividades.length <= 1) {
    return null;
  }

  const actHeader = rawActividades[0].map((h) => h.toUpperCase());
  const actRows = rawActividades.slice(1);

  const actividades: FyAfActividad[] = [];
  for (const row of actRows) {
    const id = row[actHeader.indexOf('ID_ACTIVIDAD')] || '';
    const nombre = row[actHeader.indexOf('NOMBRE')] || '';
    const estado = (row[actHeader.indexOf('ESTADO')] || 'INACTIVA').toUpperCase() as any;
    const publicar = (row[actHeader.indexOf('PUBLICAR')] || 'NO').toUpperCase() as any;

    // Regla editorial: Solo incluir si PUBLICAR === 'SI' y ESTADO !== 'INACTIVA'
    if (id && nombre && publicar === 'SI' && estado !== 'INACTIVA') {
      actividades.push({
        id_actividad: id,
        nombre,
        descripcion: row[actHeader.indexOf('DESCRIPCION')] || '',
        tipo: row[actHeader.indexOf('TIPO')] || '',
        direccion_tecnica: row[actHeader.indexOf('DIRECCION_TECNICA')] || '',
        estado,
        publicar,
        url_informacion: row[actHeader.indexOf('URL_INFORMACION')] || '',
        observaciones: row[actHeader.indexOf('OBSERVACIONES')] || '',
      });
    }
  }

  // Horarios
  const horarios: FyAfHorario[] = [];
  if (rawHorarios.length > 1) {
    const hHeader = rawHorarios[0].map((h) => h.toUpperCase());
    for (const row of rawHorarios.slice(1)) {
      const id = row[hHeader.indexOf('ID_HORARIO')] || '';
      const idAct = row[hHeader.indexOf('ID_ACTIVIDAD')] || '';
      const estado = (row[hHeader.indexOf('ESTADO')] || 'INACTIVO').toUpperCase();

      if (id && idAct && (estado === 'ACTIVO' || estado === 'ACTIVA')) {
        horarios.push({
          id_horario: id,
          id_actividad: idAct,
          dia_semana: row[hHeader.indexOf('DIA_SEMANA')] || '',
          hora_inicio: row[hHeader.indexOf('HORA_INICIO')] || '',
          hora_fin: row[hHeader.indexOf('HORA_FIN')] || '',
          modalidad: row[hHeader.indexOf('MODALIDAD')] || 'Presencial',
          sede: row[hHeader.indexOf('SEDE')] || 'Club DAOM',
          cupo: row[hHeader.indexOf('CUPO')] ? parseInt(row[hHeader.indexOf('CUPO')], 10) : undefined,
          estado: 'ACTIVO',
          vigente_desde: row[hHeader.indexOf('VIGENTE_DESDE')] || '',
          vigente_hasta: row[hHeader.indexOf('VIGENTE_HASTA')] || undefined,
          observaciones: row[hHeader.indexOf('OBSERVACIONES')] || undefined,
        });
      }
    }
  }

  // Aranceles
  const aranceles: FyAfArancel[] = [];
  if (rawAranceles.length > 1) {
    const aHeader = rawAranceles[0].map((h) => h.toUpperCase());
    for (const row of rawAranceles.slice(1)) {
      const id = row[aHeader.indexOf('ID_ARANCEL')] || '';
      const idAct = row[aHeader.indexOf('ID_ACTIVIDAD')] || '';
      const estado = (row[aHeader.indexOf('ESTADO')] || 'BORRADOR').toUpperCase() as any;
      const precioStr = row[aHeader.indexOf('PRECIO')] || '0';
      const precio = parseFloat(precioStr.replace(/[^0-9.]/g, '')) || 0;
      const cuotaSocialStr = row[aHeader.indexOf('CUOTA_SOCIAL')] || '';
      const cuotaSocial = cuotaSocialStr ? parseFloat(cuotaSocialStr.replace(/[^0-9.]/g, '')) : undefined;
      const totalStr = row[aHeader.indexOf('TOTAL')] || '';
      const total = totalStr ? parseFloat(totalStr.replace(/[^0-9.]/g, '')) : precio + (cuotaSocial || 0);

      if (id && idAct && (estado === 'VIGENTE' || estado === 'APROBADO' || estado === 'ACTIVO')) {
        aranceles.push({
          id_arancel: id,
          id_actividad: idAct,
          nombre_plan: row[aHeader.indexOf('NOMBRE_PLAN')] || '',
          frecuencia: row[aHeader.indexOf('FRECUENCIA')] || '',
          precio,
          moneda: (row[aHeader.indexOf('MONEDA')] || 'ARS').toUpperCase() as any,
          cuota_social: cuotaSocial,
          total: total > 0 ? total : undefined,
          vigente_desde: row[aHeader.indexOf('VIGENTE_DESDE')] || '',
          vigente_hasta: row[aHeader.indexOf('VIGENTE_HASTA')] || undefined,
          estado,
          observaciones: row[aHeader.indexOf('OBSERVACIONES')] || undefined,
        });
      }
    }
  }

  // Promociones
  const promociones: FyAfPromocion[] = [];
  const now = new Date();
  if (rawPromociones.length > 1) {
    const pHeader = rawPromociones[0].map((h) => h.toUpperCase());
    for (const row of rawPromociones.slice(1)) {
      const id = row[pHeader.indexOf('ID_PROMOCION')] || '';
      const idAct = row[pHeader.indexOf('ID_ACTIVIDAD')] || '';
      const estado = (row[pHeader.indexOf('ESTADO')] || 'BORRADOR').toUpperCase();
      const publicar = (row[pHeader.indexOf('PUBLICAR')] || 'NO').toUpperCase();
      const vigenteHastaStr = row[pHeader.indexOf('VIGENTE_HASTA')];

      // Verificar vencimiento de fecha si existe
      let isExpired = false;
      if (vigenteHastaStr) {
        const hastaDate = new Date(vigenteHastaStr);
        if (!isNaN(hastaDate.getTime()) && hastaDate < now) {
          isExpired = true;
        }
      }

      if (id && idAct && publicar === 'SI' && estado === 'ACTIVA' && !isExpired) {
        promociones.push({
          id_promocion: id,
          id_actividad: idAct,
          nombre: row[pHeader.indexOf('NOMBRE')] || '',
          descripcion: row[pHeader.indexOf('DESCRIPCION')] || '',
          tipo_beneficio: row[pHeader.indexOf('TIPO_BENEFICIO')] || '',
          valor_beneficio: row[pHeader.indexOf('VALOR_BENEFICIO')] || '',
          condiciones: row[pHeader.indexOf('CONDICIONES')] || '',
          vigente_desde: row[pHeader.indexOf('VIGENTE_DESDE')] || '',
          vigente_hasta: vigenteHastaStr || undefined,
          estado: 'ACTIVA',
          publicar: 'SI',
        });
      }
    }
  }

  // Contactos
  const contactos: FyAfContacto[] = [];
  if (rawContactos.length > 1) {
    const cHeader = rawContactos[0].map((h) => h.toUpperCase());
    for (const row of rawContactos.slice(1)) {
      const id = row[cHeader.indexOf('ID_CONTACTO')] || '';
      const estado = (row[cHeader.indexOf('ESTADO')] || 'INACTIVO').toUpperCase();

      if (id && (estado === 'ACTIVO' || estado === 'ACTIVA')) {
        contactos.push({
          id_contacto: id,
          area: row[cHeader.indexOf('AREA')] || '',
          nombre_publico: row[cHeader.indexOf('NOMBRE_PUBLICO')] || '',
          funcion: row[cHeader.indexOf('FUNCION')] || '',
          canal: row[cHeader.indexOf('CANAL')] || 'WhatsApp',
          destino: row[cHeader.indexOf('DESTINO')] || '',
          horario_atencion: row[cHeader.indexOf('HORARIO_ATENCION')] || '',
          permite_derivacion: (row[cHeader.indexOf('PERMITE_DERIVACION')] || 'SI').toUpperCase() as any,
          estado: 'ACTIVO',
          observaciones: row[cHeader.indexOf('OBSERVACIONES')] || undefined,
        });
      }
    }
  }

  // Configuración
  const configuracion: FyAfConfiguracion = { ...OFFICIAL_FALLBACK_DATA.configuracion };
  if (rawConfiguracion.length > 1) {
    const cfgHeader = rawConfiguracion[0].map((h) => h.toUpperCase());
    for (const row of rawConfiguracion.slice(1)) {
      const clave = (row[cfgHeader.indexOf('CLAVE')] || '').toLowerCase().trim();
      const valor = row[cfgHeader.indexOf('VALOR')] || '';
      if (clave && valor) {
        configuracion[clave] = valor;
      }
    }
  }

  return {
    actividades,
    horarios,
    aranceles,
    promociones,
    contactos,
    configuracion,
    mediaSlots: INITIAL_MEDIA_SLOTS,
    source: 'google-sheets',
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Función principal para obtener toda la información del sitio
 * 1. Revisa caché en memoria
 * 2. Si expiró, intenta leer de Google Sheets en paralelo
 * 3. Si la lectura es exitosa y contiene actividades válidas, actualiza caché
 * 4. Si la planilla falla o está en blanco, recurre a caché válida previa o fallback oficial verificado
 */
export async function getFyAfData(): Promise<FyAfFullData> {
  const now = Date.now();

  // Si tenemos caché en memoria vigente, devolverla
  if (inMemoryCache && now - inMemoryCache.timestamp < CACHE_TTL_MS) {
    return inMemoryCache.data;
  }

  try {
    // Intentar leer las 6 pestañas principales en paralelo
    const [act, hor, aran, promo, cont, cfg] = await Promise.all([
      fetchSheetTab('ACTIVIDADES').catch(() => []),
      fetchSheetTab('HORARIOS').catch(() => []),
      fetchSheetTab('ARANCELES').catch(() => []),
      fetchSheetTab('PROMOCIONES').catch(() => []),
      fetchSheetTab('CONTACTOS').catch(() => []),
      fetchSheetTab('CONFIGURACION').catch(() => []),
    ]);

    const normalized = normalizeSheetData(act, hor, aran, promo, cont, cfg);

    if (normalized && normalized.actividades.length > 0) {
      inMemoryCache = {
        data: normalized,
        timestamp: now,
      };
      return normalized;
    }
  } catch (error) {
    console.warn('[FyAF Sheets Sync] Error temporal consultando Google Sheets:', error);
  }

  // Si falló la consulta o la planilla está en blanco (preparación por otro agente):
  // Usar caché previa si existió
  if (inMemoryCache) {
    return {
      ...inMemoryCache.data,
      source: 'verified-cache',
    };
  }

  // De lo contrario, usar la base oficial institucional completa
  return {
    ...OFFICIAL_FALLBACK_DATA,
    source: 'fallback-official',
    lastUpdated: new Date().toISOString(),
  };
}
