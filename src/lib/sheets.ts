import {
  FyAfFullData,
  FyAfActividad,
  FyAfHorario,
  FyAfArancel,
  FyAfPromocion,
  FyAfContacto,
  FyAfConfiguracion,
  FyAfMediaSlot,
} from '@/types/fyaf';
import { getStoredMediaSlots } from './media-store';
import { INITIAL_MEDIA_SLOTS } from './media-registry';

const SHEET_ID = process.env.GOOGLE_SHEETS_ID || '1a0uzrxAhvXyOn0wjDxwnTWU1EC9BWT3Xr2Q3GFkDvP4';

interface CacheEntry {
  data: FyAfFullData;
  timestamp: number;
}

// Cache corta de 15 segundos para proteger Google Sheets de saturación en ráfagas de tráfico
let verifiedCache: CacheEntry | null = null;
const CACHE_TTL_MS = 15 * 1000; // 15 segundos

/**
 * Función robusta para parsear CSV respetando comillas y saltos de línea dentro de campos
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
 * Descarga una pestaña de Google Sheets vía gviz/tq siempre fresca
 */
export async function fetchSheetTab(tabName: string): Promise<string[][]> {
  // Se incluye cache-busting timestamp para evitar la caché intermedia de Google/CDN
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    tabName
  )}&t=${Date.now()}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'DAOM-FyAF-Web/1.0',
    },
    cache: 'no-store',
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
 * Sanitiza números de teléfono para WhatsApp eliminando formato exponencial o caracteres no numéricos.
 * Mapea correctamente a los números de los responsables de cada área si la planilla vino con float 5.49E+17.
 */
export function sanitizePhoneNumber(raw: string, areaHint: string = ''): string {
  const normArea = areaHint.toLowerCase();

  // Si vino en formato exponencial como 5.49E+17 o vacía, derivar al responsable real
  if (!raw || raw.includes('E+') || raw.includes('e+')) {
    if (normArea.includes('oly') || normArea.includes('levantamiento') || normArea.includes('emelyn')) {
      return '+5491164691525'; // Emelyn / Dirección Técnica OLY
    }
    if (normArea.includes('open') || normArea.includes('box') || normArea.includes('matias')) {
      return '+5491130393030'; // Matías / Administración Open Box
    }
    if (normArea.includes('secretar') || normArea.includes('club') || normArea.includes('amalia')) {
      return '+5491146734406'; // Secretaría Club DAOM
    }
    // CrossFit / General: Brenda
    return '+5491146734466';
  }

  const clean = raw.replace(/[^0-9]/g, '');
  if (clean.length >= 10) {
    return clean.startsWith('54') ? `+${clean}` : `+549${clean}`;
  }
  return '+5491146734466';
}

/**
 * Genera slots multimedia estables y dinámicos para cualquier actividad de la planilla
 */
export function ensureActivityMediaSlots(
  actividades: FyAfActividad[],
  currentSlots: Record<string, FyAfMediaSlot>
): Record<string, FyAfMediaSlot> {
  const updatedSlots = { ...currentSlots };

  actividades.forEach((act) => {
    const slotId = `activity-${act.id_actividad.toLowerCase()}`;
    if (!updatedSlots[slotId]) {
      // Si ya existe slot por mapeo histórico
      if (act.id_actividad === 'FYAF-CF' && updatedSlots['activity-cf']) {
        updatedSlots[slotId] = { ...updatedSlots['activity-cf'], id: slotId };
      } else if (act.id_actividad === 'FYAF-OLY' && updatedSlots['activity-oly']) {
        updatedSlots[slotId] = { ...updatedSlots['activity-oly'], id: slotId };
      } else if (act.id_actividad === 'FYAF-OPEN' && updatedSlots['activity-openbox']) {
        updatedSlots[slotId] = { ...updatedSlots['activity-openbox'], id: slotId };
      } else {
        // Nueva actividad creada en Google Sheets: creamos su slot automáticamente
        updatedSlots[slotId] = {
          id: slotId,
          name: `Banner ${act.nombre}`,
          section: 'actividades',
          url: '/images/hero-gym.jpg',
          type: 'image',
          aspectRatio: '16/9',
          focalPoint: { x: 50, y: 50 },
          zoom: 1,
          alt: `Imagen oficial para ${act.nombre}`,
          isPublished: true,
        };
      }
    }
  });

  return updatedSlots;
}

/**
 * Normaliza y valida estrictamente la información obtenida de Google Sheets
 */
export function normalizeSheetData(
  rawActividades: string[][],
  rawHorarios: string[][],
  rawAranceles: string[][],
  rawPromociones: string[][],
  rawContactos: string[][],
  rawConfiguracion: string[][],
  rawRedes: string[][]
): FyAfFullData | null {
  // Validación de integridad: Si no hay actividades en la planilla, no sobreescribir con datos rotos
  if (rawActividades.length <= 1) {
    return null;
  }

  const actHeader = rawActividades[0].map((h) => h.toUpperCase());
  const actRows = rawActividades.slice(1);

  // 1. ACTIVIDADES: Filtrar estrictamente por PUBLICAR = 'SI' y ESTADO = 'ACTIVA'
  const actividades: FyAfActividad[] = [];
  for (const row of actRows) {
    const id = row[actHeader.indexOf('ID_ACTIVIDAD')] || '';
    const nombre = row[actHeader.indexOf('NOMBRE')] || '';
    const estado = (row[actHeader.indexOf('ESTADO')] || 'INACTIVA').toUpperCase() as any;
    const publicar = (row[actHeader.indexOf('PUBLICAR')] || 'NO').toUpperCase() as any;

    if (id && nombre && publicar === 'SI' && estado === 'ACTIVA') {
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

  const validActivityIds = new Set(actividades.map((a) => a.id_actividad));

  // 2. HORARIOS: Filtrar estado ACTIVA / ACTIVO, asociar a actividades publicadas y deduplicar turnos idénticos
  const horarios: FyAfHorario[] = [];
  const seenHorarios = new Set<string>();

  if (rawHorarios.length > 1) {
    const hHeader = rawHorarios[0].map((h) => h.toUpperCase());
    for (const row of rawHorarios.slice(1)) {
      const id = row[hHeader.indexOf('ID_HORARIO')] || '';
      const idAct = row[hHeader.indexOf('ID_ACTIVIDAD')] || '';
      const estado = (row[hHeader.indexOf('ESTADO')] || 'INACTIVO').toUpperCase();
      const dia = row[hHeader.indexOf('DIA_SEMANA')] || '';
      const inicio = row[hHeader.indexOf('HORA_INICIO')] || '';
      const fin = row[hHeader.indexOf('HORA_FIN')] || '';

      // Clave única para evitar duplicados en pantalla
      const dedupeKey = `${idAct}_${dia.toLowerCase().trim()}_${inicio}_${fin}`;

      if (
        id &&
        idAct &&
        validActivityIds.has(idAct) &&
        (estado === 'ACTIVO' || estado === 'ACTIVA') &&
        !seenHorarios.has(dedupeKey)
      ) {
        seenHorarios.add(dedupeKey);
        horarios.push({
          id_horario: id,
          id_actividad: idAct,
          dia_semana: dia,
          hora_inicio: inicio,
          hora_fin: fin,
          modalidad: row[hHeader.indexOf('MODALIDAD')] || 'Presencial',
          sede: row[hHeader.indexOf('SEDE')] || 'Sede Club DAOM (Av. Varela 1802)',
          cupo: row[hHeader.indexOf('CUPO')] ? parseInt(row[hHeader.indexOf('CUPO')], 10) : undefined,
          estado: 'ACTIVO',
          vigente_desde: row[hHeader.indexOf('VIGENTE_DESDE')] || '',
          vigente_hasta: row[hHeader.indexOf('VIGENTE_HASTA')] || undefined,
          observaciones: row[hHeader.indexOf('OBSERVACIONES')] || undefined,
        });
      }
    }
  }

  // 3. ARANCELES: Extraer valores reales de la planilla, calculando cuotas y totales reales
  const aranceles: FyAfArancel[] = [];
  if (rawAranceles.length > 1) {
    const aHeader = rawAranceles[0].map((h) => h.toUpperCase());
    for (const row of rawAranceles.slice(1)) {
      const id = row[aHeader.indexOf('ID_ARANCEL')] || '';
      const idAct = row[aHeader.indexOf('ID_ACTIVIDAD')] || '';
      const estado = (row[aHeader.indexOf('ESTADO')] || 'BORRADOR').toUpperCase() as any;

      const precioStr = row[aHeader.indexOf('PRECIO')] || '0';
      const precio = parseFloat(precioStr.replace(/[^0-9.]/g, '')) || 0;

      const totalStr = row[aHeader.indexOf('TOTAL')] || '';
      const total = totalStr ? parseFloat(totalStr.replace(/[^0-9.]/g, '')) : precio;

      const cuotaSocialRaw = row[aHeader.indexOf('CUOTA_SOCIAL')] || '';
      let cuotaSocialNum: number | undefined = undefined;
      if (cuotaSocialRaw.toLowerCase().includes('adherente')) {
        cuotaSocialNum = 30500; // Valor oficial de cuota social adherente en planilla
      } else if (cuotaSocialRaw.toLowerCase().includes('activo')) {
        cuotaSocialNum = 41000; // Valor oficial activo
      } else {
        const parsed = parseFloat(cuotaSocialRaw.replace(/[^0-9.]/g, ''));
        if (!isNaN(parsed) && parsed > 0) cuotaSocialNum = parsed;
      }

      if (id && idAct && validActivityIds.has(idAct) && (estado === 'VIGENTE' || estado === 'APROBADO' || estado === 'ACTIVO')) {
        aranceles.push({
          id_arancel: id,
          id_actividad: idAct,
          nombre_plan: row[aHeader.indexOf('NOMBRE_PLAN')] || '',
          frecuencia: row[aHeader.indexOf('FRECUENCIA')] || '',
          precio,
          moneda: (row[aHeader.indexOf('MONEDA')] || 'ARS').toUpperCase() as any,
          cuota_social: cuotaSocialNum,
          total: total > 0 ? total : undefined,
          vigente_desde: row[aHeader.indexOf('VIGENTE_DESDE')] || '',
          vigente_hasta: row[aHeader.indexOf('VIGENTE_HASTA')] || undefined,
          estado,
          observaciones: row[aHeader.indexOf('OBSERVACIONES')] || undefined,
        });
      }
    }
  }

  // 4. PROMOCIONES: Solo mostrar si PUBLICAR = 'SI', ESTADO = 'ACTIVA' y fecha no vencida
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

      let isExpired = false;
      if (vigenteHastaStr) {
        const hastaDate = new Date(vigenteHastaStr);
        if (!isNaN(hastaDate.getTime()) && hastaDate < now) {
          isExpired = true;
        }
      }

      // Omitir promociones de WL si WL no está publicada en FyAF
      const isTargetValid = idAct === 'todas' || validActivityIds.has(idAct);

      if (id && isTargetValid && publicar === 'SI' && estado === 'ACTIVA' && !isExpired) {
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

  // 5. CONTACTOS: Extraer WhatsApps oficiales
  const contactos: FyAfContacto[] = [];
  if (rawContactos.length > 1) {
    const cHeader = rawContactos[0].map((h) => h.toUpperCase());
    for (const row of rawContactos.slice(1)) {
      const id = row[cHeader.indexOf('ID_CONTACTO')] || '';
      const estado = (row[cHeader.indexOf('ESTADO')] || 'INACTIVO').toUpperCase();
      const rawDestino = row[cHeader.indexOf('DESTINO')] || '';
      const area = row[cHeader.indexOf('AREA')] || '';
      const nombre = row[cHeader.indexOf('NOMBRE')] || '';

      if (id && (estado === 'ACTIVO' || estado === 'ACTIVA')) {
        contactos.push({
          id_contacto: id,
          area,
          nombre_publico: row[cHeader.indexOf('NOMBRE_PUBLICO')] || '',
          funcion: row[cHeader.indexOf('FUNCION')] || '',
          canal: row[cHeader.indexOf('CANAL')] || 'WhatsApp',
          destino: sanitizePhoneNumber(rawDestino, `${area} ${nombre} ${id}`),
          horario_atencion: row[cHeader.indexOf('HORARIO_ATENCION')] || '',
          permite_derivacion: (row[cHeader.indexOf('PERMITE_DERIVACION')] || 'SI').toUpperCase() as any,
          estado: 'ACTIVO',
          observaciones: row[cHeader.indexOf('OBSERVACIONES')] || undefined,
        });
      }
    }
  }

  // 6. REDES SOCIALES: Extraer perfiles oficiales
  const instagramPerfiles: Record<string, string> = {
    'FYAF-CF': 'https://www.instagram.com/daom.cf/',
    'FYAF-OLY': 'https://www.instagram.com/daom.wl/',
    'FYAF-OPEN': 'https://www.instagram.com/daom.cf/',
  };

  if (rawRedes.length > 1) {
    const rHeader = rawRedes[0].map((h) => h.toUpperCase());
    for (const row of rawRedes.slice(1)) {
      const red = (row[rHeader.indexOf('RED')] || '').toLowerCase();
      const idRed = row[rHeader.indexOf('ID_RED')] || '';
      const url = row[rHeader.indexOf('URL_PERFIL')] || '';
      const estado = (row[rHeader.indexOf('ESTADO')] || '').toUpperCase();
      const publicar = (row[rHeader.indexOf('PUBLICAR')] || '').toUpperCase();

      if (red.includes('instagram') && estado === 'ACTIVO' && publicar === 'SI' && url) {
        if (idRed.includes('WL') || idRed.includes('OLY')) {
          instagramPerfiles['FYAF-OLY'] = url;
        } else if (idRed.includes('CF')) {
          instagramPerfiles['FYAF-CF'] = url;
          instagramPerfiles['FYAF-OPEN'] = url;
        }
      }
    }
  }

  // 7. CONFIGURACIÓN: Datos de sede y geolocalización
  const configuracion: FyAfConfiguracion = {
    nombre_oficial: 'Gimnasio de Fuerza y Acondicionamiento Físico (FyAF) - Club DAOM',
    institucion: 'Club DAOM',
    sede_direccion: 'Av. Varela 1802, Flores, CABA (esquina Av. Castañares)',
    coordenadas_lat: '-34.6472889',
    coordenadas_lng: '-58.4489749',
    google_maps_url: 'https://maps.google.com/?q=-34.6472889,-58.4489749',
    url_taplink: 'https://taplink.cc/daom_gym',
    url_sitio_oficial: 'https://www.daom-weightlifting.com',
    zona_horaria: 'America/Argentina/Buenos_Aires',
    moneda_predeterminada: 'ARS',
    whatsapp_default: '+5491146734406',
    instagram_default: instagramPerfiles['FYAF-CF'] || 'https://www.instagram.com/daom.cf/',
    instagram_cf: instagramPerfiles['FYAF-CF'] || 'https://www.instagram.com/daom.cf/',
    instagram_oly: instagramPerfiles['FYAF-OLY'] || 'https://www.instagram.com/daom.wl/',
    instagram_openbox: instagramPerfiles['FYAF-OPEN'] || 'https://www.instagram.com/daom.cf/',
  };

  // Asignar slots multimedia reales
  const storedSlots = getStoredMediaSlots();
  const mediaSlots = ensureActivityMediaSlots(actividades, storedSlots);

  return {
    actividades,
    horarios,
    aranceles,
    promociones,
    contactos,
    configuracion,
    mediaSlots,
    source: 'google-sheets',
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Obtiene los datos oficiales de FyAF:
 * 1. Lee la planilla Google Sheets en vivo
 * 2. Si es válida, actualiza la caché técnica en memoria
 * 3. Si hay falla temporal de conexión, sirve la última caché válida
 * 4. Si nunca hubo caché y falla la red, lanza error para que el cliente lo gestione de forma segura
 */
export async function getFyAfData(): Promise<FyAfFullData> {
  const now = Date.now();

  // Si tenemos caché en memoria vigente (menos de 5 minutos), responder de inmediato
  if (verifiedCache && now - verifiedCache.timestamp < CACHE_TTL_MS) {
    return verifiedCache.data;
  }

  try {
    const [act, hor, aran, promo, cont, cfg, redes] = await Promise.all([
      fetchSheetTab('ACTIVIDADES'),
      fetchSheetTab('HORARIOS'),
      fetchSheetTab('ARANCELES'),
      fetchSheetTab('PROMOCIONES'),
      fetchSheetTab('CONTACTOS'),
      fetchSheetTab('CONFIGURACION'),
      fetchSheetTab('REDES_SOCIALES'),
    ]);

    const normalized = normalizeSheetData(act, hor, aran, promo, cont, cfg, redes);

    if (normalized && normalized.actividades.length > 0) {
      verifiedCache = {
        data: normalized,
        timestamp: now,
      };
      return normalized;
    }
  } catch (error) {
    console.warn('[FyAF Sheets Sync] Error temporal al consultar Google Sheets:', error);
  }

  // Tolerancia ante desconexión temporal: Servir la última caché válida existente
  if (verifiedCache) {
    return {
      ...verifiedCache.data,
      source: 'verified-cache',
    };
  }

  // Si aún no se pobló la caché en memoria y la red falló durante el build estático inicial:
  // Cargar el snapshot verificado de la planilla real de Google Sheets
  try {
    const snapshot = require('./sheets-initial-snapshot.json');
    const normalized = normalizeSheetData(
      parseCsv(snapshot['ACTIVIDADES'] || ''),
      parseCsv(snapshot['HORARIOS'] || ''),
      parseCsv(snapshot['ARANCELES'] || ''),
      parseCsv(snapshot['PROMOCIONES'] || ''),
      parseCsv(snapshot['CONTACTOS'] || ''),
      parseCsv(snapshot['CONFIGURACION'] || ''),
      parseCsv(snapshot['REDES_SOCIALES'] || '')
    );
    if (normalized) {
      verifiedCache = {
        data: {
          ...normalized,
          source: 'verified-cache',
        },
        timestamp: now,
      };
      return verifiedCache.data;
    }
  } catch (err) {
    console.warn('[FyAF Sheets Sync] Error al cargar snapshot inicial verificado:', err);
  }

  throw new Error('No fue posible obtener los datos de Google Sheets y no existe caché previa.');
}
