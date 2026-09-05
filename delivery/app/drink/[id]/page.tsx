import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDrinkById } from '@/lib/cocktaildb';
import FavoriteButton from '@/components/FavoriteButton';
import RecipeInstructions from '@/components/RecipeInstructions';

interface DrinkPageProps {
  params: { id: string };
}

export default async function DrinkPage({ params }: DrinkPageProps) {
  const drink = await getDrinkById(params.id);

  if (!drink) {
    notFound();
  }

  return (
    <article>
      <Link href="/drinks" className="back-link">
        ← Volver a bebidas
      </Link>

      <div className="recipe-detail-header">
        {drink.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={drink.thumbnail}
            alt={drink.name}
            className="recipe-detail-image"
          />
        )}
        <div>
          <div className="recipe-detail-meta">
            {drink.category && <span className="tag-pill">{drink.category}</span>}
            {drink.alcoholic && <span className="tag-pill">{drink.alcoholic}</span>}
            {drink.glass && <span className="tag-pill">{drink.glass}</span>}
          </div>
          <h1>{drink.name}</h1>
          <div className="recipe-detail-actions">
            <FavoriteButton mealId={drink.id} variant="inline" />
          </div>
        </div>
      </div>

      <div className="recipe-detail-body">
        <div>
          <h2>Ingredientes</h2>
          <ul className="ingredient-list">
            {drink.ingredients.map((ing, index) => (
              <li key={`${ing.name}-${index}`}>
                <span>{ing.name}</span>
                <span className="ingredient-measure">{ing.measure}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Preparación</h2>
          {drink.instructions ? (
            <RecipeInstructions text={drink.instructions} />
          ) : (
            <p className="instructions">
              Esta bebida no tiene instrucciones cargadas.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
