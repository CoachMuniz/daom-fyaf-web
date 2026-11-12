import { NextRequest, NextResponse } from 'next/server';
import { getStoredMediaSlots } from '@/lib/media-store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Clave no especificada' }, { status: 400 });
    }

    // Intentar leer de Cloudflare KV
    try {
      const { getCloudflareContext } = await import('@opennextjs/cloudflare');
      const ctx = getCloudflareContext();
      const kv = (ctx.env as any)?.FYAF_MEDIA_BLOBS;
      if (kv) {
        const item = await kv.getWithMetadata(key, { type: 'arrayBuffer' });
        if (item && item.value) {
          const contentType = (item.metadata as any)?.contentType || 'application/octet-stream';
          return new NextResponse(item.value, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      }
    } catch {
      // Entorno no Cloudflare
    }

    return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Error recuperando archivo' }, { status: 500 });
  }
}
