import { NextResponse } from 'next/server';
import { getCustomAreas } from '@/lib/customRecipes';

export async function GET(): Promise<NextResponse> {
  return getCustomAreas()
    .then((areas) => NextResponse.json(areas))
    .catch(() =>
      NextResponse.json(
        { error: 'No se pudieron consultar los países propios' },
        { status: 500 }
      )
    );
}
