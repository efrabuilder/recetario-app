import { NextResponse } from 'next/server';
import { getCustomRecipeById } from '@/lib/customRecipes';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  return getCustomRecipeById(params.id)
    .then((meal) =>
      meal
        ? NextResponse.json(meal)
        : NextResponse.json({ error: 'No encontrada' }, { status: 404 })
    )
    .catch(() =>
      NextResponse.json(
        { error: 'No se pudo consultar la receta' },
        { status: 500 }
      )
    );
}
