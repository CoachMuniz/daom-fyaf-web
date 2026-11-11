import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getStoredMediaSlots, saveStoredMediaSlots } from '@/lib/media-store';

// Lista de administradores autorizados explícitamente en el servidor
const AUTHORIZED_ADMIN_EMAILS = [
  'matias.muniz@gmail.com',
  'coachmuniz@users.noreply.github.com',
  'administracion@daom.com.ar',
];

const ADMIN_PASSWORD = process.env.ADMIN_PANEL_KEY || 'daom-fyaf-admin-2026';

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  const emailHeader = req.headers.get('x-admin-email') || '';

  // Permitir por clave maestra administrativa o por email explícito en lista blanca
  if (token === ADMIN_PASSWORD) {
    return true;
  }
  if (emailHeader && AUTHORIZED_ADMIN_EMAILS.includes(emailHeader.toLowerCase())) {
    return true;
  }
  return false;
}

export async function GET(req: NextRequest) {
  const slots = getStoredMediaSlots();
  return NextResponse.json({ slots });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Acceso denegado: no autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, slotId, slotData } = body;

    const currentSlots = getStoredMediaSlots();

    if (action === 'update_slot') {
      if (!currentSlots[slotId]) {
        return NextResponse.json({ error: 'Ubicación multimedia no existe' }, { status: 404 });
      }
      currentSlots[slotId] = {
        ...currentSlots[slotId],
        ...slotData,
      };
      saveStoredMediaSlots(currentSlots);
      return NextResponse.json({ success: true, slot: currentSlots[slotId] });
    }

    if (action === 'reset_defaults') {
      const { INITIAL_MEDIA_SLOTS } = await import('@/lib/media-registry');
      saveStoredMediaSlots({ ...INITIAL_MEDIA_SLOTS });
      return NextResponse.json({ success: true, slots: INITIAL_MEDIA_SLOTS });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
