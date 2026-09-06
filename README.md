# Recetario

App de recetas construida con Next.js (App Router) + TypeScript, que consume
la API pública de [TheMealDB](https://www.themealdb.com/api.php).

## Qué hace

- **Buscar** recetas por nombre, o filtrarlas por categoría o región.
- **Ver el detalle** de una receta: ingredientes con medidas, instrucciones,
  video de YouTube embebido (cuando la receta lo trae) y link a la fuente
  original.
- **Guardar favoritas**: se guardan en `localStorage`, así que persisten
  entre visitas sin necesidad de backend ni cuenta de usuario.

## Por qué este stack

Pensado como proyecto de portafolio para demostrar:

- Consumo de una API REST externa (`fetch`, tipado de respuestas, manejo de
  errores y estados vacíos).
- Filtrado combinado (búsqueda por nombre / categoría / región).
- Persistencia simple en el cliente (favoritos con `localStorage`) sin
  necesidad de una base de datos.

## Cómo correrlo localmente

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

No hace falta ninguna API key para lo básico: los endpoints usados de
TheMealDB (`search.php`, `filter.php`, `lookup.php`, `categories.php`,
`list.php`) son de acceso libre en su nivel de desarrollador (`v1/1`).

Para sumar más países y valores nutricionales, la app combina hasta cuatro
fuentes. Todas son opcionales excepto TheMealDB: si no configurás las
variables de una fuente, esa fuente simplemente no aporta resultados y el
resto de la app sigue funcionando igual.

| Fuente      | Variables de entorno                    | Qué aporta |
|-------------|------------------------------------------|------------|
| TheMealDB   | (ninguna)                                 | Catálogo base, sin nutrición |
| Spoonacular | `SPOONACULAR_API_KEY`                     | Recetas por país + nutrición |
| Edamam      | `EDAMAM_APP_ID`, `EDAMAM_APP_KEY`         | Más países + nutrición |
| Recetas propias | `SUPABASE_URL`, `SUPABASE_ANON_KEY`   | Recetas curadas a mano para países que ninguna de las APIs cubre bien |

Las recetas propias viven en una tabla `custom_recipes` de Supabase con este
esquema:

```sql
create table custom_recipes (
  id text primary key,
  name text not null,
  thumbnail text,
  category text,
  area text not null,
  instructions text,
  tags text[] default '{}',
  source_url text,
  ingredients jsonb not null default '[]',
  nutrition jsonb
);
```

`ingredients` es un arreglo de `{ "name": string, "measure": string }` y
`nutrition` (opcional) un objeto `{ calories, carbs, fat, protein, sodium }`,
todos como texto ya formateado (ej. `"420 kcal"`).

## Estructura

```
app/
  page.tsx              Home: búsqueda + filtros + grilla
  recipe/[id]/page.tsx  Detalle de una receta
  favorites/page.tsx    Recetas guardadas (localStorage)
components/             Piezas de UI (tarjeta, grilla, filtros, header...)
lib/
  mealdb.ts             Funciones tipadas que envuelven la API de TheMealDB
  favorites.ts          Lectura/escritura de favoritos en localStorage
hooks/
  useFavorites.ts       Hook que sincroniza el estado de favoritos en la UI
types/meal.ts           Tipos TypeScript para las respuestas de la API
```

## Posibles siguientes pasos

- Filtro combinado por ingrediente (`filter.php?i=`).
- Paginación o "cargar más" en vez de traer todo el listado de una vez.
- Modo oscuro.
- Compartir una receta favorita por link.
