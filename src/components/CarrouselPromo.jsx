import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const INTERVALLE_MS = 4500;

export default function CarrouselPromo({ produits }) {
  const [index, setIndex] = useState(0);
  const [enPause, setEnPause] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (enPause || produits.length < 2) return;
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % produits.length);
    }, INTERVALLE_MS);
    return () => clearInterval(intervalRef.current);
  }, [enPause, produits.length]);

  if (!produits || produits.length === 0) return null;

  const produit = produits[index];
  const pourcentageRemise = produit.prixPromo
    ? Math.round((1 - Number(produit.prixPromo) / Number(produit.prixVente)) * 100)
    : null;

  return (
    <div
      style={styles.conteneur}
      onMouseEnter={() => setEnPause(true)}
      onMouseLeave={() => setEnPause(false)}
    >
      <Link to={`/produit/${produit.id}`} style={styles.lien}>
        <div style={styles.slide}>
          {produit.photoUrl ? (
            <img src={produit.photoUrl} alt={produit.designation} style={styles.image} />
          ) : (
            <div style={styles.imagePlaceholder} />
          )}
          <div style={styles.degrade} />
          <div style={styles.contenu}>
            {pourcentageRemise && <span style={styles.badgePromo}>-{pourcentageRemise}%</span>}
            <h2 style={styles.titre}>{produit.designation}</h2>
            <div style={styles.prix}>
              {produit.prixPromo ? (
                <>
                  <span style={styles.prixPromo}>{Number(produit.prixPromo).toLocaleString('fr-FR')} F</span>
                  <span style={styles.prixBarre}>{Number(produit.prixVente).toLocaleString('fr-FR')} F</span>
                </>
              ) : (
                <span style={styles.prixPromo}>{Number(produit.prixVente).toLocaleString('fr-FR')} F</span>
              )}
            </div>
            <span style={styles.boutonVoir}>Découvrir →</span>
          </div>
        </div>
      </Link>

      {produits.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setIndex((i) => (i - 1 + produits.length) % produits.length); }}
            style={{ ...styles.fleche, left: 12 }}
            aria-label="Précédent"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setIndex((i) => (i + 1) % produits.length); }}
            style={{ ...styles.fleche, right: 12 }}
            aria-label="Suivant"
          >
            ›
          </button>
          <div style={styles.points}>
            {produits.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.preventDefault(); setIndex(i); }}
                style={{ ...styles.point, background: i === index ? 'var(--white)' : 'rgba(255,255,255,0.5)' }}
                aria-label={`Aller à la promotion ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  conteneur: { position: 'relative', width: '100%', aspectRatio: '16 / 6', minHeight: 220, overflow: 'hidden', background: 'var(--cream-deep)' },
  lien: { display: 'block', width: '100%', height: '100%', textDecoration: 'none', color: 'inherit' },
  slide: { position: 'relative', width: '100%', height: '100%' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  imagePlaceholder: { width: '100%', height: '100%', background: 'var(--cream-deep)' },
  degrade: { position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(31,46,69,0.75) 0%, rgba(31,46,69,0.25) 55%, rgba(31,46,69,0) 80%)' },
  contenu: { position: 'absolute', left: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, padding: '20px 32px', maxWidth: 440 },
  badgePromo: { alignSelf: 'flex-start', background: 'var(--bordeaux-deep)', color: 'var(--white)', fontWeight: 800, fontSize: 13, padding: '4px 12px', borderRadius: 20 },
  titre: { color: 'var(--white)', fontFamily: 'var(--font-display)', fontSize: 24, margin: 0, lineHeight: 1.2 },
  prix: { display: 'flex', alignItems: 'center', gap: 10 },
  prixPromo: { color: 'var(--white)', fontWeight: 800, fontSize: 22 },
  prixBarre: { color: 'rgba(255,255,255,0.7)', fontSize: 15, textDecoration: 'line-through' },
  boutonVoir: { color: 'var(--white)', fontWeight: 700, fontSize: 14, textDecoration: 'underline', marginTop: 4 },
  fleche: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%',
    border: 'none', background: 'rgba(255,255,255,0.85)', color: 'var(--brown-ink)', fontSize: 22, lineHeight: '36px',
    cursor: 'pointer', padding: 0,
  },
  points: { position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 },
  point: { width: 8, height: 8, borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer' },
};
