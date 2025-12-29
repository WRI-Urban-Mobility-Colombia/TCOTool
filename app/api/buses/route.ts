import { NextRequest, NextResponse } from 'next/server';
import { loadBuses } from '@/lib/utils/csvReader';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const typology = searchParams.get('typology') ?? undefined;
    const buses = loadBuses(typology);
    return NextResponse.json({ data: buses });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('API Error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
