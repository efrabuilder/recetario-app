import Link from 'next/link';

export default function RecipeNotFound() {
  return (
    <div className="state-message">
      <strong>No encontramos esa receta</strong>
      Puede que el enlace esté roto o la receta ya no exista.
      <div style={{ marginTop: '1rem' }}>
        <Link href="/" className="back-link">
          ← Volver a la búsqueda
        </Link>
      </div>
    </div>
  );
}
