import { NextResponse } from 'next/server';
import { getCustomRecipesByName } from '@/lib/customRecipes';

export async function GET(request: Request): Promise<NextResponse> {
  const query = new URL(request.url).searchParams.get('q') ?? '';

  const result = await getCustomRecipesByName(query);
  return NextResponse.json(result);
}
