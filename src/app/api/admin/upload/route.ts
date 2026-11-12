import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { isRequestAuthorized } from '@/lib/admin-auth';
import { getStorageService } from '@/lib/storage';

export async function POST(req: NextRequest) {
  if (!isRequestAuthorized(req)) {
    return NextResponse.json(
      { error: 'No autorizado para subir archivos multimedia' },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitizar nombre y normalizar extensión
    const ext = path.extname(file.name).toLowerCase();
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    const fileName = `${baseName}-${Date.now()}${ext}`;

    const storage = await getStorageService();
    const mimeType = file.type || 'application/octet-stream';

    const result = await storage.uploadFile(buffer, fileName, mimeType, 'fyaf');

    return NextResponse.json({
      success: true,
      url: result.publicUrl,
      storagePath: result.storagePath,
      provider: storage.getProviderName(),
      fileName,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
