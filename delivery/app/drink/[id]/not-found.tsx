import Link from 'next/link';

export default function DrinkNotFound() {
  return (
    <div className="state-message">
      <strong>No encontramos esa bebida</strong>
      Puede que el enlace esté roto o la bebida ya no exista.
      <div style={{ marginTop: '1rem' }}>
        <Link href="/drinks" className="back-link">
          ← Volver a bebidas
        </Link>
      </div>
    </div>
  );
}
