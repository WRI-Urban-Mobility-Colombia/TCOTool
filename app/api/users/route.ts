import { NextRequest, NextResponse } from 'next/server';
import type { DownloadModalFormData } from '@/app/components/Header/DownloadModal/DownloadModal.types';
import { saveUserToDatabase } from './route.db.utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const userData = (await request.json()) as DownloadModalFormData;
    const isUnknownUser = userData.firstName === 'Desconocido';

    if (!isUnknownUser && (!userData.email || !userData.firstName || !userData.lastName || !userData.sector)) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const result = await saveUserToDatabase({ userData });

    return NextResponse.json({
      success: true,
      message: 'Usuario guardado correctamente',
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('API Error al guardar usuario en base de datos:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
