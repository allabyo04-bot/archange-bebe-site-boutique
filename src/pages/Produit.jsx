import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { appelApi } from '../lib/api';
import { ajouterAuPanier } from '../lib/panier';

export default function Produit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produit, setProduit] = useState(null);
  const [erreur, setErreur] = useState('');
  const [quantite, setQuantite] = useState(1);
  const [ajoute, setAjoute] = useState(false);

  useEffect(() => {
    setProduit(null);
    appelApi('GET', `/produits/${id}`).then(setProduit).catch((err) => setErreur(err.message));
  }, [id]);

  function gererAjout() {
    ajouterAuPanier(produit, quantite);
    setAjoute(true);
    setTimeout(() => setAjoute(false), 2000);
  }

  if (erreur) {
    return (
      <Layout>
        <div className="conteneur" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--error)', fontWeight: 700 }}>{erreur}</p>
        </div>
      </Layout>
    );
  }

  if (!produit) {
    return (
      <Layout>
        <div className="conteneur" style={{ padding: '60px 20px' }}>
          <p style={{ color: 'var(--brown-soft)' }}>Chargement…</p>
        </div>
      </Layout>
    );
  }

  const enPromo = produit.prixPromo != null && Number(produit.prixPromo) < Number(produit.prixVente);
  const pourcentageRemise = enPromo ? Math.round((1 - Number(produit.prixPromo) / Number(produit.prixVente)) * 100) : 0;

  return (
    <Layout>
      <div className="conteneur" style={{ padding: '32px 20px 60px' }}>
        <button onClick={() => navigate(-1)} className="bouton-secondaire" style={{ marginBottom: 24 }}>← Retour</button>

        <div style={styles.grille} className="grille-produit">
          <div style={styles.imageZone}>
            {produit.photoUrl ? (
              <img src={produit.photoUrl} alt={produit.designation} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: 60, opacity: 0.3 }}>📦</span>
            )}
            {enPromo && <span style={styles.badgePromo}>-{pourcentageRemise}%</span>}
          </div>

          <div>
            {produit.famille && <p style={styles.filDAriane}>{produit.famille.nom}{produit.sousFamille ? ` — ${produit.sousFamille.nom}` : ''}</p>}
            <h1 style={{ fontSize: 28, marginBottom: 10 }}>{produit.designation}</h1>

            {enPromo ? (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={styles.prixPromo}>{Number(produit.prixPromo).toLocaleString('fr-FR')} F</span>
                <span style={styles.prixBarre}>{Number(produit.prixVente).toLocaleString('fr-FR')} F</span>
                <span style={styles.badgePromoInline}>-{pourcentageRemise}%</span>
              </div>
            ) : (
              <div style={styles.prix}>{Number(produit.prixVente).toLocaleString('fr-FR')} F</div>
            )}

            {produit.enStock ? (
              <p style={{ color: 'var(--succes)', fontWeight: 700, marginTop: 8 }}>✓ En stock</p>
            ) : (
              <p style={{ color: 'var(--error)', fontWeight: 700, marginTop: 8 }}>Rupture de stock</p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24 }}>
              <div style={styles.selecteurQte}>
                <button onClick={() => setQuantite((q) => Math.max(1, q - 1))} style={styles.boutonQte}>−</button>
                <span style={{ fontWeight: 800, minWidth: 24, textAlign: 'center' }}>{quantite}</span>
                <button onClick={() => setQuantite((q) => q + 1)} style={styles.boutonQte}>+</button>
              </div>
              <button onClick={gererAjout} disabled={!produit.enStock} className="bouton-principal" style={{ flex: 1 }}>
                {ajoute ? '✓ Ajouté au panier' : 'Ajouter au panier'}
              </button>
            </div>

            <p style={{ color: 'var(--brown-soft)', fontSize: 13, marginTop: 20 }}>Référence : {produit.reference}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  grille: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 },
  imageZone: { aspectRatio: '1 / 1', background: 'var(--cream-deep)', borderRadius: 'var(--rayon)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' },
  badgePromo: { position: 'absolute', top: 14, left: 14, background: 'var(--bordeaux-deep)', color: 'var(--white)', fontSize: 13, fontWeight: 800, padding: '5px 12px', borderRadius: 999 },
  badgePromoInline: { background: '#FBE4E1', color: 'var(--bordeaux-deep)', fontSize: 12, fontWeight: 800, padding: '4px 10px', borderRadius: 999 },
  filDAriane: { color: 'var(--brown-soft)', fontSize: 13, fontWeight: 700, marginBottom: 6 },
  prix: { color: 'var(--gold-deep)', fontWeight: 800, fontSize: 30 },
  prixPromo: { color: 'var(--bordeaux-deep)', fontWeight: 800, fontSize: 30 },
  prixBarre: { color: 'var(--brown-soft)', fontSize: 18, textDecoration: 'line-through' },
  selecteurQte: { display: 'flex', alignItems: 'center', gap: 12, background: 'var(--cream-deep)', borderRadius: 999, padding: '6px 14px' },
  boutonQte: { width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'var(--white)', fontSize: 18, fontWeight: 800, cursor: 'pointer' },
};
