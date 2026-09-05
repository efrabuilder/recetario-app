import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMealById, toYoutubeEmbedUrl } from '@/lib/mealdb';
import FavoriteButton from '@/components/FavoriteButton';
import RecipeInstructions from '@/components/RecipeInstructions';

interface RecipePageProps {
  params: { id: string };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const meal = await getMealById(params.id);

  if (!meal) {
    notFound();
  }

  const embedUrl = meal.youtubeUrl ? toYoutubeEmbedUrl(meal.youtubeUrl) : null;

  return (
    <article>
      <Link href="/" className="back-link">
        ← Volver a la búsqueda
      </Link>

      <div className="recipe-detail-header">
        {meal.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={meal.thumbnail}
            alt={meal.name}
            className="recipe-detail-image"
          />
        )}
        <div>
          <div className="recipe-detail-meta">
            {meal.category && <span className="tag-pill">{meal.category}</span>}
            {meal.area && <span className="tag-pill">{meal.area}</span>}
            {meal.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
          <h1>{meal.name}</h1>
          <div className="recipe-detail-actions">
            <FavoriteButton mealId={meal.id} variant="inline" />
            {meal.sourceUrl && (
              <a
                href={meal.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="source-link"
              >
                Ver receta original
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="recipe-detail-body">
        <div>
          <h2>Ingredientes</h2>
          <ul className="ingredient-list">
            {meal.ingredients.map((ing, index) => (
              <li key={`${ing.name}-${index}`}>
                <span>{ing.name}</span>
                <span className="ingredient-measure">{ing.measure}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Preparación</h2>
          {meal.instructions ? (
            <RecipeInstructions text={meal.instructions} />
          ) : (
            <p className="instructions">
              Esta receta no tiene instrucciones cargadas.
            </p>
          )}

          {embedUrl && (
            <div className="video-embed">
              <h2>Video</h2>
              <iframe
                src={embedUrl}
                title={`Video de preparación: ${meal.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
