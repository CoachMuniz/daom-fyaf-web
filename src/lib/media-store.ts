import { FyAfMediaSlot } from '@/types/fyaf';
import { INITIAL_MEDIA_SLOTS } from './media-registry';

const MEDIA_STORE_KEY = 'fyaf:media_slots:v1';
let memoryCache: Record<string, FyAfMediaSlot> = { ...INITIAL_MEDIA_SLOTS };

/**
 * Obtiene el almacenamiento actual de slots multimedia
 * Devuelve síncronamente el estado en memoria para compatibilidad universal (tests y componentes),
 * e hidrata en segundo plano desde Cloudflare KV cuando está en ejecución.
 */
export function getStoredMediaSlots(): Record<string, FyAfMediaSlot> {
  return { ...memoryCache };
}

/**
 * Inicializa/hidrata los slots multimedia desde Cloudflare KV
 */
export async function hydrateMediaSlotsFromKv(): Promise<Record<string, FyAfMediaSlot>> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    const kv = (ctx.env as any)?.FYAF_MEDIA_STORE;
    if (kv) {
      const data = await kv.get(MEDIA_STORE_KEY, 'json');
      if (data && typeof data === 'object') {
        memoryCache = { ...INITIAL_MEDIA_SLOTS, ...data };
        return memoryCache;
      }
    }
  } catch {
    // Entorno no Cloudflare
  }
  return memoryCache;
}

/**
 * Guarda las modificaciones de los slots multimedia de forma persistente en Cloudflare KV
 */
export async function saveStoredMediaSlots(slots: Record<string, FyAfMediaSlot>): Promise<boolean> {
  memoryCache = { ...slots };
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    const kv = (ctx.env as any)?.FYAF_MEDIA_STORE;
    if (kv) {
      await kv.put(MEDIA_STORE_KEY, JSON.stringify(slots));
      return true;
    }
  } catch (err) {
    console.warn('[MediaStore] No se pudo guardar en Cloudflare KV:', err);
  }
  return false;
}
