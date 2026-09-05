import { NextResponse } from 'next/server';
import { getSpoonacularMealById } from '@/lib/spoonacular';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const meal = await getSpoonacularMealById(params.id);
    if (!meal) {
      return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
    }
    return NextResponse.json(meal);
  } catch {
    return NextResponse.json(
      { error: 'No se pudo consultar Spoonacular' },
      { status: 500 }
    );
  }
}
