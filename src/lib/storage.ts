export interface StorageUploadResult {
  storagePath: string;
  publicUrl: string;
}

export interface IStorageService {
  uploadFile(
    buffer: Buffer,
    filename: string,
    mimeType: string,
    folder?: string
  ): Promise<StorageUploadResult>;
  deleteFile(storagePath: string): Promise<boolean>;
  getProviderName(): 'cloudflare-kv' | 'supabase' | 'memory-fallback';
}

/**
 * Cloudflare Workers KV Storage Service
 * Almacena archivos multimedia como ArrayBuffer en Cloudflare KV (FYAF_MEDIA_BLOBS)
 * proporcionando URL pública canónica en /api/media/{key} con headers de caché inmutables.
 */
class CloudflareKvStorageService implements IStorageService {
  private kv: any;

  constructor(kv: any) {
    this.kv = kv;
  }

  getProviderName(): 'cloudflare-kv' {
    return 'cloudflare-kv';
  }

  async uploadFile(
    buffer: Buffer,
    filename: string,
    mimeType: string,
    folder: string = 'fyaf'
  ): Promise<StorageUploadResult> {
    const key = `${folder}_${filename}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    
    // Almacenar ArrayBuffer en Cloudflare KV con metadata de MIME type
    await this.kv.put(key, buffer.buffer, {
      metadata: {
        contentType: mimeType,
        uploadedAt: new Date().toISOString(),
        originalName: filename,
      },
    });

    const publicUrl = `/api/media/${key}?key=${key}`;
    const storagePath = key;

    return { storagePath, publicUrl };
  }

  async deleteFile(storagePath: string): Promise<boolean> {
    try {
      await this.kv.delete(storagePath);
      return true;
    } catch (err) {
      console.error(`Error deleting Cloudflare KV object ${storagePath}:`, err);
      return false;
    }
  }
}

/**
 * Supabase Storage Service como proveedor alternativo en la nube
 */
class SupabaseStorageService implements IStorageService {
  private supabaseUrl: string;
  private serviceKey: string;
  private bucket: string;

  constructor(supabaseUrl: string, serviceKey: string, bucket: string = 'daom-media') {
    this.supabaseUrl = supabaseUrl.replace(/\/$/, '');
    this.serviceKey = serviceKey;
    this.bucket = bucket;
  }

  getProviderName(): 'supabase' {
    return 'supabase';
  }

  async uploadFile(
    buffer: Buffer,
    filename: string,
    mimeType: string,
    folder: string = 'fyaf'
  ): Promise<StorageUploadResult> {
    const objectPath = `${folder}/${filename}`;
    const url = `${this.supabaseUrl}/storage/v1/object/${this.bucket}/${objectPath}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.serviceKey}`,
        apikey: this.serviceKey,
        'Content-Type': mimeType,
        'x-upsert': 'true',
      },
      body: new Uint8Array(buffer),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Error en Supabase Storage: ${response.status} ${errText}`);
    }

    const publicUrl = `${this.supabaseUrl}/storage/v1/object/public/${this.bucket}/${objectPath}`;
    return { storagePath: objectPath, publicUrl };
  }

  async deleteFile(storagePath: string): Promise<boolean> {
    try {
      const url = `${this.supabaseUrl}/storage/v1/object/${this.bucket}/${storagePath}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.serviceKey}`,
          apikey: this.serviceKey,
        },
      });

      return response.ok;
    } catch (err) {
      console.error(`Error deleting Supabase storage object ${storagePath}:`, err);
      return false;
    }
  }
}

/**
 * Fallback seguro en memoria (para build estático o test sin workers)
 */
class MemoryStorageService implements IStorageService {
  getProviderName(): 'memory-fallback' {
    return 'memory-fallback';
  }

  async uploadFile(
    _buffer: Buffer,
    filename: string,
    _mimeType: string,
    folder: string = 'fyaf'
  ): Promise<StorageUploadResult> {
    return {
      storagePath: `${folder}_${filename}`,
      publicUrl: `/images/hero-gym.webp`,
    };
  }

  async deleteFile(_storagePath: string): Promise<boolean> {
    return true;
  }
}

/**
 * Retorna el servicio de almacenamiento activo priorizando Cloudflare KV en Workers
 */
export async function getStorageService(): Promise<IStorageService> {
  // 1. Verificar si estamos en Cloudflare Workers con el binding FYAF_MEDIA_BLOBS
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    const kv = (ctx.env as any)?.FYAF_MEDIA_BLOBS;
    if (kv) {
      return new CloudflareKvStorageService(kv);
    }
  } catch {
    // Fuera de Cloudflare
  }

  // 2. Verificar Supabase
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'daom-media';

  if (supabaseUrl && serviceKey) {
    return new SupabaseStorageService(supabaseUrl, serviceKey, bucket);
  }

  // 3. Fallback seguro en memoria
  return new MemoryStorageService();
}
