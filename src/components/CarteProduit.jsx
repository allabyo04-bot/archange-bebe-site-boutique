import { Link } from 'react-router-dom';

export default function CarteProduit({ produit }) {
  const enPromo = produit.prixPromo != null && Number(produit.prixPromo) < Number(produit.prixVente);
  const pourcentageRemise = enPromo
    ? Math.round((1 - Number(produit.prixPromo) / Number(produit.prixVente)) * 100)
    : 0;

  return (
    <Link
      to={`/produit/${produit.id}`}
      style={styles.carte}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 26px rgba(31,46,69,0.14)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--ombre)'; }}
    >
      <div style={styles.imageZone}>
        {produit.photoUrl ? (
          <img src={produit.photoUrl} alt={produit.designation} style={styles.image} />
        ) : (
          <span style={{ fontSize: 32, opacity: 0.3 }}>📦</span>
        )}
        {enPromo && <span style={styles.badgePromo}>-{pourcentageRemise}%</span>}
        {!produit.enStock && <span style={styles.badgeRupture}>Rupture</span>}
      </div>
      <div style={{ padding: '12px 4px 4px' }}>
        <div style={styles.designation}>{produit.designation}</div>
        {enPromo ? (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
            <span style={styles.prixPromo}>{Number(produit.prixPromo).toLocaleString('fr-FR')} F</span>
            <span style={styles.prixBarre}>{Number(produit.prixVente).toLocaleString('fr-FR')} F</span>
          </div>
        ) : (
          <div style={styles.prix}>{Number(produit.prixVente).toLocaleString('fr-FR')} F</div>
        )}
      </div>
    </Link>
  );
}

const styles = {
  carte: { display: 'block', background: 'var(--white)', borderRadius: 'var(--rayon)', overflow: 'hidden', boxShadow: 'var(--ombre)', transition: 'transform 0.15s ease, box-shadow 0.15s ease' },
  imageZone: { aspectRatio: '1 / 1', background: 'var(--white)', borderBottom: '1px solid var(--cream-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  image: { width: '100%', height: '100%', objectFit: 'contain', padding: 12 },
  badgeRupture: { position: 'absolute', top: 8, right: 8, background: 'var(--error)', color: 'var(--white)', fontSize: 11, fontWeight: 800, padding: '3px 9px', borderRadius: 999 },
  badgePromo: { position: 'absolute', top: 8, left: 8, background: 'var(--bordeaux-deep)', color: 'var(--white)', fontSize: 11, fontWeight: 800, padding: '3px 9px', borderRadius: 999 },
  designation: { fontWeight: 700, fontSize: 14, lineHeight: 1.3, minHeight: 36, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
  prix: { color: 'var(--gold-deep)', fontWeight: 800, fontSize: 16, marginTop: 6 },
  prixPromo: { color: 'var(--bordeaux-deep)', fontWeight: 800, fontSize: 16 },
  prixBarre: { color: 'var(--brown-soft)', fontSize: 13, textDecoration: 'line-through' },
};
