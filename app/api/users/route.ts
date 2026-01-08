import { NextRequest, NextResponse } from 'next/server';
import type { DownloadModalFormData } from '@/app/components/Header/DownloadModal/DownloadModal.types';
import { getCsvFilePath, ensureCsvFileExists, appendUserToCsv } from './route.utils';
import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const userData = (await request.json()) as DownloadModalFormData;
    const isUnknownUser = userData.firstName === 'Desconocido';

    if (!isUnknownUser && (!userData.email || !userData.firstName || !userData.lastName || !userData.sector)) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const csvPath = getCsvFilePath();

    ensureCsvFileExists(csvPath);

    appendUserToCsv(csvPath, userData);

    return NextResponse.json({ success: true, message: 'Usuario guardado correctamente' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('API Error al guardar usuario:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const data = await req.json();

    await sql`
      INSERT INTO users (
        email,
        first_name,
        last_name,
        job_title,
        organization,
        sector,
        rating,
        comments,
        vehicle_type
      ) VALUES (
        ${data.email},
        ${data.firstName},
        ${data.lastName},
        ${data.jobTitle},
        ${data.organization},
        ${data.sector},
        ${data.rating},
        ${data.comments},
        ${data.vehicleType}
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error guardando usuario:', error);
    return NextResponse.json(
      { success: false, error: 'Error guardando usuario' },
      { status: 500 }
    );
  }
}