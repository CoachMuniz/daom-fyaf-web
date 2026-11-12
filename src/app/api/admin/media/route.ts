import { NextRequest, NextResponse } from 'next/server';
import { getStoredMediaSlots, saveStoredMediaSlots } from '@/lib/media-store';
import { isRequestAuthorized } from '@/lib/admin-auth';
import { getStorageService } from '@/lib/storage';

export async function GET(req: NextRequest) {
  const slots = await getStoredMediaSlots();
  return NextResponse.json({ slots });
}

export async function POST(req: NextRequest) {
  if (!isRequestAuthorized(req)) {
    return NextResponse.json({ error: 'Acceso denegado: no autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, slotId, slotData, storagePath } = body;

    const currentSlots = await getStoredMediaSlots();

    if (action === 'update_slot') {
      if (!currentSlots[slotId]) {
        return NextResponse.json({ error: 'Ubicación multimedia no existe' }, { status: 404 });
      }
      currentSlots[slotId] = {
        ...currentSlots[slotId],
        ...slotData,
      };
      await saveStoredMediaSlots(currentSlots);
      return NextResponse.json({ success: true, slot: currentSlots[slotId] });
    }

    if (action === 'delete_file') {
      if (!storagePath) {
        return NextResponse.json({ error: 'Ruta de almacenamiento no indicada' }, { status: 400 });
      }
      const storage = await getStorageService();
      const deleted = await storage.deleteFile(storagePath);
      return NextResponse.json({ success: deleted });
    }

    if (action === 'reset_defaults') {
      const { INITIAL_MEDIA_SLOTS } = await import('@/lib/media-registry');
      await saveStoredMediaSlots({ ...INITIAL_MEDIA_SLOTS });
      return NextResponse.json({ success: true, slots: INITIAL_MEDIA_SLOTS });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
