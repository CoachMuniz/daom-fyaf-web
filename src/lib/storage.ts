import fs from 'node:fs';
import path from 'node:path';

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
  getProviderName(): 'supabase' | 'local';
}

/**
 * Local Storage Service para Desarrollo y Fallback local
 */
class LocalStorageService implements IStorageService {
  private baseDir: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  getProviderName(): 'local' {
    return 'local';
  }

  async uploadFile(
    buffer: Buffer,
    filename: string,
    _mimeType: string,
    folder: string = 'media'
  ): Promise<StorageUploadResult> {
    const targetDir = path.join(this.baseDir, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, filename);
    await fs.promises.writeFile(filePath, buffer);

    const storagePath = `${folder}/${filename}`;
    const publicUrl = `/uploads/${folder}/${filename}`;

    return { storagePath, publicUrl };
  }

  async deleteFile(storagePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.baseDir, storagePath);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        return true;
      }
      return false;
    } catch (err) {
      console.error(`Error deleting local file ${storagePath}:`, err);
      return false;
    }
  }
}

/**
 * Supabase Storage Service para Persistencia Permanente en la nube (Render)
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
      const errorText = await response.text();
      throw new Error(`Supabase Storage Upload failed (${response.status}): ${errorText}`);
    }

    const publicUrl = `${this.supabaseUrl}/storage/v1/object/public/${this.bucket}/${objectPath}`;
    return {
      storagePath: objectPath,
      publicUrl,
    };
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

let storageInstance: IStorageService | null = null;

export function getStorageService(): IStorageService {
  if (storageInstance) return storageInstance;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'daom-media';

  if (supabaseUrl && serviceKey) {
    storageInstance = new SupabaseStorageService(supabaseUrl, serviceKey, bucket);
    return storageInstance;
  }

  storageInstance = new LocalStorageService();
  return storageInstance;
}
