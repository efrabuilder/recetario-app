import { NextResponse } from 'next/server';
import { getCustomRecipesByNameDebug } from '@/lib/customRecipes';

// ⚠️ VERSIÓN TEMPORAL SOLO PARA DIAGNÓSTICO — expone el error real de
// Supabase en vez de tragarlo. Revertir a la versión normal (custom-search
// route original que ya tenés) una vez identificada la causa.
export async function GET(request: Request): Promise<NextResponse> {
  const query = new URL(request.url).searchParams.get('q') ?? '';

  const result = await getCustomRecipesByNameDebug(query);
  return NextResponse.json(result);
}
