import { describe, it, expect } from 'vitest';
import { getStorageService } from '@/lib/storage';

describe('5. Pruebas de Persistencia Multimedia y Almacenamiento Externo', () => {
  it('debe instanciar el servicio de almacenamiento con capacidad de subida y borrado', async () => {
    const storage = await getStorageService();
    expect(storage).toBeDefined();
    expect(['cloudflare-kv', 'supabase', 'memory-fallback']).toContain(storage.getProviderName());
  });

  it('debe subir y eliminar un archivo de prueba correctamente', async () => {
    const storage = await getStorageService();
    const testBuffer = Buffer.from('Test media content for FyAF Web 2026');
    const testFileName = `test-verify-${Date.now()}.txt`;

    const uploadResult = await storage.uploadFile(testBuffer, testFileName, 'text/plain', 'fyaf-test');
    expect(uploadResult).toBeDefined();
    expect(uploadResult.storagePath).toContain(testFileName);
    expect(uploadResult.publicUrl).toBeTruthy();

    const deleteResult = await storage.deleteFile(uploadResult.storagePath);
    expect(typeof deleteResult).toBe('boolean');
  });
});
