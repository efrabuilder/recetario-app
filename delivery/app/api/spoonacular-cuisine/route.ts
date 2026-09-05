import { NextRequest, NextResponse } from 'next/server';
import { isSpoonacularCuisine } from '@/lib/spoonacular';

/**
 * Proxy server-side hacia Spoonacular. Existe para que la API key nunca
 * viaje al navegador: el cliente le pega a esta ruta, y esta ruta es la que
 * le agrega la key a la petición real hacia api.spoonacular.com.
 */
export async function GET(request: NextRequest) {
  const cuisine = request.nextUrl.searchParams.get('cuisine');

  if (!cuisine || !isSpoonacularCuisine(cuisine)) {
    return NextResponse.json({ results: [] });
  }

  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Falta configurar SPOONACULAR_API_KEY en el servidor' },
      { status: 500 }
    );
  }

  const url = `https://api.spoonacular.com/recipes/complexSearch?cuisine=${encodeURIComponent(
    cuisine
  )}&number=20&apiKey=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    return NextResponse.json(
      { error: `Spoonacular respondió ${res.status}` },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json({ results: data.results ?? [] });
}
