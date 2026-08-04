import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { obtenirPanier, modifierQuantite, retirerDuPanier, totalPanier, ecouterPanier } from '../lib/panier';

export default function Panier() {
  const navigate = useNavigate();
  const [lignes, setLignes] = useState(obtenirPanier());

  useEffect(() => ecouterPanier(setLignes), []);

  const total = totalPanier(lignes);

  return (
    <Layout>
      <div className="conteneur" style={{ padding: '32px 20px 60px', maxWidth: 800 }}>
        <h1 style={{ fontSize: 28, marginBottom: 24 }}>Mon panier</h1>

        {lignes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ color: 'var(--brown-soft)', marginBottom: 20 }}>Ton panier est vide.</p>
            <Link to="/boutique" className="bouton-principal">Voir la boutique</Link>
          </div>
        )}

        {lignes.length > 0 && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {lignes.map((l) => (
                <div key={l.articleId} style={styles.ligne}>
                  <div style={styles.imageZone}>
                    {l.photoUrl ? <img src={l.photoUrl} alt={l.designation} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📦'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{l.designation}</div>
                    <div style={{ color: 'var(--gold-deep)', fontWeight: 800 }}>{l.prixVente.toLocaleString('fr-FR')} F</div>
                  </div>
                  <div style={styles.selecteurQte}>
                    <button onClick={() => modifierQuantite(l.articleId, l.quantite - 1)} style={styles.boutonQte}>−</button>
                    <span style={{ fontWeight: 800, minWidth: 20, textAlign: 'center' }}>{l.quantite}</span>
                    <button onClick={() => modifierQuantite(l.articleId, l.quantite + 1)} style={styles.boutonQte}>+</button>
                  </div>
                  <button onClick={() => retirerDuPanier(l.articleId)} style={styles.boutonRetirer}>✕</button>
                </div>
              ))}
            </div>

            <div style={styles.total}>
              <span>Total</span>
              <span style={{ color: 'var(--gold-deep)', fontWeight: 800, fontSize: 22 }}>{total.toLocaleString('fr-FR')} F</span>
            </div>

            <button onClick={() => navigate('/commande')} className="bouton-principal" style={{ width: '100%', marginTop: 20 }}>
              Passer la commande
            </button>
          </>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  ligne: { display: 'flex', alignItems: 'center', gap: 14, background: 'var(--white)', padding: 12, borderRadius: 12, boxShadow: 'var(--ombre)' },
  imageZone: { width: 64, height: 64, borderRadius: 8, background: 'var(--cream-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, fontSize: 22 },
  selecteurQte: { display: 'flex', alignItems: 'center', gap: 10, background: 'var(--cream-deep)', borderRadius: 999, padding: '4px 10px' },
  boutonQte: { width: 24, height: 24, borderRadius: '50%', border: 'none', background: 'var(--white)', fontSize: 15, fontWeight: 800, cursor: 'pointer' },
  boutonRetirer: { border: 'none', background: 'transparent', color: 'var(--error)', fontSize: 16, cursor: 'pointer' },
  total: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 16, borderTop: '2px solid var(--cream-deep)', fontWeight: 700, fontSize: 16 },
};
