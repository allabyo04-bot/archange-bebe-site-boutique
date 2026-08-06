import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { appelApi } from '../lib/api';
import CarteProduit from '../components/CarteProduit';
import CarrouselPromo from '../components/CarrouselPromo';

export default function Accueil() {
  const [familles, setFamilles] = useState([]);
  const [nouveautes, setNouveautes] = useState([]);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    appelApi('GET', '/familles').then(setFamilles).catch(() => {});
    appelApi('GET', '/produits?page=1').then((r) => setNouveautes(r.produits.slice(0, 8))).catch(() => {});
    appelApi('GET', '/produits?enPromo=true&page=1').then((r) => setPromotions(r.produits.slice(0, 8))).catch(() => {});
  }, []);

  return (
    <Layout>
      <section style={styles.hero}>
        <div className="conteneur" style={styles.heroContenu}>
          <div style={{ maxWidth: 540 }}>
            <div><span style={styles.pastilleSlogan}>Pour Le Bonheur Des Boudchou</span></div>
            <span style={styles.heroSurTitre}>Puériculture & mode enfant</span>
            <p style={styles.heroTexte}>
              Découvrez notre sélection en boutique, disponible aussi en ligne — retrait en boutique ou livraison.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
              <Link to="/boutique" className="bouton-principal" style={{ display: 'inline-block' }}>
                Découvrir la boutique
              </Link>
              {promotions.length > 0 && (
                <Link to="/boutique?enPromo=true" className="bouton-bordeaux" style={{ display: 'inline-block' }}>
                  🎉 Voir les promotions
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {promotions.length > 0 && <CarrouselPromo produits={promotions} />}

      <section className="conteneur" style={styles.bandeConfiance}>
        <div style={styles.itemConfiance}><span style={styles.iconeConfiance}>🏬</span> Retrait en boutique gratuit</div>
        <div style={styles.itemConfiance}><span style={styles.iconeConfiance}>🚚</span> Livraison à Abidjan</div>
        <div style={styles.itemConfiance}><span style={styles.iconeConfiance}>✓</span> Produits vérifiés en boutique</div>
        <div style={styles.itemConfiance}><span style={styles.iconeConfiance}>🎁</span> Fidélité dès 10 achats</div>
      </section>

      <section className="conteneur" style={styles.blocApropos}>
        <p style={styles.texteApropos}>
          Archange Bébé est une boutique dédiée à la puériculture et à la mode enfant, pensée pour
          accompagner les parents à chaque étape — de la naissance aux premiers pas.
        </p>
        <Link to="/qui-sommes-nous" style={styles.lienVoirTout}>En savoir plus sur nous →</Link>
      </section>

      {promotions.length > 0 && (
        <section className="conteneur" style={{ marginTop: 48 }}>
          <div style={styles.enTeteSection}>
            <h2 style={styles.titreSection}>🎉 Promotions du moment</h2>
            <Link to="/boutique?enPromo=true" style={styles.lienVoirTout}>Voir tout →</Link>
          </div>
          <div style={styles.grilleProduits}>
            {promotions.map((p) => <CarteProduit key={p.id} produit={p} />)}
          </div>
        </section>
      )}

      {familles.length > 0 && (
        <section className="conteneur" style={{ marginTop: 56 }}>
          <h2 style={styles.titreSection}>Nos univers</h2>
          <div style={styles.grilleFamilles}>
            {familles.slice(0, 8).map((f) => (
              <Link key={f.id} to={`/boutique?familleId=${f.id}`} style={styles.carteFamille}>
                {f.nom}
              </Link>
            ))}
          </div>
        </section>
      )}

      {nouveautes.length > 0 && (
        <section className="conteneur" style={{ marginTop: 56, marginBottom: 60 }}>
          <div style={styles.enTeteSection}>
            <h2 style={styles.titreSection}>Nos produits</h2>
            <Link to="/boutique" style={styles.lienVoirTout}>Voir tout →</Link>
          </div>
          <div style={styles.grilleProduits}>
            {nouveautes.map((p) => (
              <CarteProduit key={p.id} produit={p} />
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}

const styles = {
  hero: { background: 'linear-gradient(135deg, var(--cream-deep), var(--cream))', padding: '64px 0' },
  heroContenu: { display: 'flex', alignItems: 'center' },
  heroSurTitre: { color: 'var(--bordeaux-deep)', fontWeight: 800, fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase' },
  pastilleSlogan: {
    display: 'inline-block', background: 'var(--bordeaux-deep)', color: 'var(--white)',
    fontWeight: 800, fontSize: 16, padding: '10px 24px', borderRadius: 999, marginBottom: 18,
  },
  heroTexte: { fontSize: 16, color: 'var(--brown-soft)', lineHeight: 1.6, marginTop: 14, marginBottom: 20 },
  bandeConfiance: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12,
    marginTop: -28, position: 'relative', zIndex: 5,
  },
  itemConfiance: {
    background: 'var(--white)', borderRadius: 12, padding: '14px 16px', boxShadow: 'var(--ombre)',
    display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 13,
  },
  iconeConfiance: { fontSize: 18 },
  blocApropos: { marginTop: 40, textAlign: 'center', maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' },
  texteApropos: { color: 'var(--brown-soft)', fontSize: 15, lineHeight: 1.7, marginBottom: 10 },
  enTeteSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20, flexWrap: 'wrap', gap: 8 },
  titreSection: { fontSize: 26, margin: 0 },
  lienVoirTout: { color: 'var(--gold-deep)', fontWeight: 700, fontSize: 14 },
  grilleFamilles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 },
  carteFamille: {
    background: 'var(--white)', borderRadius: 12, padding: '20px 16px', textAlign: 'center',
    fontWeight: 700, boxShadow: 'var(--ombre)', border: '1px solid var(--cream-deep)',
  },
  grilleProduits: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 },
};
