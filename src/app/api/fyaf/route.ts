import { NextRequest, NextResponse } from 'next/server';
import { getFyAfData } from '@/lib/sheets';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const data = await getFyAfData();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al consultar datos de FyAF', details: error?.message },
      { status: 500 }
    );
  }
}
