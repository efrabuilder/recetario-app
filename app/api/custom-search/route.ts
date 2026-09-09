import { NextResponse } from 'next/server';
import { getCustomRecipesByName } from '@/lib/customRecipes';

export async function GET(request: Request): Promise<NextResponse> {
  const query = new URL(request.url).searchParams.get('q') ?? '';

  return getCustomRecipesByName(query)
    .then((meals) => NextResponse.json(meals))
    .catch(() =>
      NextResponse.json(
        { error: 'No se pudieron buscar las recetas propias' },
        { status: 500 }
      )
    );
}
