import type { Ingredient, NutritionInfo } from '@/types/meal';
import { estimateFromIngredients, evaluateNutrition } from '@/lib/nutritionAnalyzer';

interface NutritionFactsProps {
  nutrition: NutritionInfo | undefined;
  ingredients: Ingredient[];
}

function RealNutrition({ nutrition }: { nutrition: NutritionInfo }) {
  const verdict = evaluateNutrition(nutrition);

  const rows = [
    { label: 'Calorías', value: nutrition.calories },
    { label: 'Carbohidratos', value: nutrition.carbs },
    { label: 'Grasas', value: nutrition.fat },
    { label: 'Proteína', value: nutrition.protein },
    { label: 'Sodio (sal)', value: nutrition.sodium },
  ];

  return (
    <>
      <p className="nutrition-verdict">{verdict.label}</p>
      <ul className="nutrition-list">
        {rows.map((row) => (
          <li key={row.label}>
            <span>{row.label}</span>
            <span className="nutrition-value">{row.value}</span>
          </li>
        ))}
      </ul>
      <ul className="nutrition-analysis-notes">
        {verdict.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <p className="nutrition-note">Valores estimados por porción.</p>
    </>
  );
}

function EstimatedNutrition({ ingredients }: { ingredients: Ingredient[] }) {
  if (ingredients.length === 0) {
    return (
      <p className="nutrition-unavailable">
        No hay ingredientes suficientes para estimar qué tan nutritiva es
        esta receta.
      </p>
    );
  }

  const estimate = estimateFromIngredients(ingredients);

  return (
    <>
      <p className="nutrition-verdict">{estimate.label}</p>
      <p className="nutrition-analysis-summary">{estimate.summary}</p>
      <p className="nutrition-disclaimer">
        Esta receta no trae valores nutricionales reales (viene de TheMealDB).
        Esto es una estimación aproximada según sus ingredientes, no un
        cálculo de calorías o gramos exacto.
      </p>
    </>
  );
}

export default function NutritionFacts({ nutrition, ingredients }: NutritionFactsProps) {
  return (
    <div className="nutrition-facts">
      <h2>Valores nutricionales</h2>
      {nutrition ? (
        <RealNutrition nutrition={nutrition} />
      ) : (
        <EstimatedNutrition ingredients={ingredients} />
      )}
    </div>
  );
}
