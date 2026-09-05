// Forma "cruda" tal como la devuelve TheCocktailDB.
export interface RawDrink {
  idDrink: string;
  strDrink: string;
  strCategory: string | null;
  strAlcoholic: string | null;
  strGlass: string | null;
  strInstructions: string | null;
  strDrinkThumb: string | null;
  [key: `strIngredient${number}`]: string | null | undefined;
  [key: `strMeasure${number}`]: string | null | undefined;
}

export interface DrinkIngredient {
  name: string;
  measure: string;
}

export interface DrinkSummary {
  id: string;
  name: string;
  thumbnail: string | null;
  category?: string;
}

export interface DrinkDetail extends DrinkSummary {
  instructions: string | null;
  alcoholic: string | null;
  glass: string | null;
  ingredients: DrinkIngredient[];
}
