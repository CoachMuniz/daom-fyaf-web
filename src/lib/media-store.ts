import fs from 'fs';
import path from 'path';
import { FyAfMediaSlot } from '@/types/fyaf';
import { INITIAL_MEDIA_SLOTS } from './media-registry';

const DATA_DIR = path.join(process.cwd(), 'data');
const MEDIA_STORE_FILE = path.join(DATA_DIR, 'media-store.json');

/**
 * Obtiene el almacenamiento actual de slots multimedia
 */
export function getStoredMediaSlots(): Record<string, FyAfMediaSlot> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(MEDIA_STORE_FILE)) {
      const content = fs.readFileSync(MEDIA_STORE_FILE, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('[MediaStore] Error leyendo media store:', error);
  }
  return { ...INITIAL_MEDIA_SLOTS };
}

/**
 * Guarda las modificaciones de los slots multimedia
 */
export function saveStoredMediaSlots(slots: Record<string, FyAfMediaSlot>): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(MEDIA_STORE_FILE, JSON.stringify(slots, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('[MediaStore] Error guardando media store:', error);
    return false;
  }
}
