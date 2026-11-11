import { NextRequest, NextResponse } from 'next/server';
import { getFyAfData } from '@/lib/sheets';

export async function GET(req: NextRequest) {
  try {
    const data = await getFyAfData();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al consultar datos de FyAF', details: error?.message },
      { status: 500 }
    );
  }
}
