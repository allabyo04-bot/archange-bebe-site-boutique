import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import CarteProduit from '../components/CarteProduit';
import { obtenirFavoris, ecouterFavoris } from '../lib/favoris';

export default function MesFavoris() {
  const [favoris, setFavoris] = useState(obtenirFavoris());

  useEffect(() => {
    return ecouterFavoris(setFavoris);
  }, []);

  return (
    <Layout>
      <div className="conteneur" style={{ padding: '32px 20px 60px' }}>
        <h1 style={{ fontSize: 28, marginBottom: 20 }}>Mes favoris</h1>

        {favoris.length === 0 ? (
          <div>
            <p style={{ color: 'var(--brown-soft)' }}>
              Tu n'as pas encore de favoris — clique sur le cœur 🤍 sur une fiche produit pour l'ajouter ici.
            </p>
            <Link to="/boutique" className="bouton-principal" style={{ display: 'inline-block', marginTop: 16 }}>
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div style={styles.grille}>
            {favoris.map((f) => (
              <CarteProduit key={f.articleId} produit={{ ...f, id: f.articleId, enStock: true }} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  grille: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginTop: 28 },
};
