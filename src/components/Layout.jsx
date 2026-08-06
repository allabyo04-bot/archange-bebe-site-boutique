import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obtenirPanier, nombreArticlesPanier, ecouterPanier } from '../lib/panier';
import { obtenirFavoris, ecouterFavoris } from '../lib/favoris';
import { getClient, clearSession } from '../lib/api';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [nombreArticles, setNombreArticles] = useState(nombreArticlesPanier(obtenirPanier()));
  const [nombreFavoris, setNombreFavoris] = useState(obtenirFavoris().length);
  const [banniereVisible, setBanniereVisible] = useState(true);
  const client = getClient();

  useEffect(() => {
    return ecouterPanier((lignes) => setNombreArticles(nombreArticlesPanier(lignes)));
  }, []);

  useEffect(() => {
    return ecouterFavoris((favoris) => setNombreFavoris(favoris.length));
  }, []);

  function seDeconnecter() {
    clearSession();
    navigate('/');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {banniereVisible && (
        <div style={styles.banniere}>
          <Link to="/boutique?enPromo=true" style={styles.banniereLien}>
            🎉 Promotions en cours sur une sélection d'articles — profitez-en avant la fin du stock !
          </Link>
          <button onClick={() => setBanniereVisible(false)} style={styles.banniereFermer} aria-label="Fermer">✕</button>
        </div>
      )}

      <header style={styles.entete}>
        <div className="conteneur" style={styles.enteteContenu}>
          <Link to="/" style={styles.logoLien}>
            <img src="/logo-archange-bebe.png" alt="Archange Bébé" style={styles.logoImage} className="logo-entete" />
          </Link>

          <nav style={styles.nav}>
            <Link to="/boutique" style={styles.lienNav}>Boutique</Link>
            <Link to="/actualites" style={styles.lienNav}>Actualités</Link>
            <Link to="/boutique?enPromo=true" style={{ ...styles.lienNav, color: 'var(--bordeaux-deep)' }}>Promotions</Link>
            <Link to="/qui-sommes-nous" style={styles.lienNav}>Qui sommes-nous</Link>
            {client ? (
              <>
                <Link to="/compte" style={styles.lienNav}>Mon compte</Link>
                <button onClick={seDeconnecter} style={styles.lienNavBouton}>Déconnexion</button>
              </>
            ) : (
              <Link to="/compte" style={styles.lienNav}>Se connecter</Link>
            )}
            <Link to="/mes-favoris" style={styles.lienNav} aria-label="Mes favoris">
              🤍{nombreFavoris > 0 && <span style={styles.badgeFavoris}>{nombreFavoris}</span>}
            </Link>
            <Link to="/panier" style={styles.boutonPanier}>
              🛒 Panier{nombreArticles > 0 && <span style={styles.badgePanier}>{nombreArticles}</span>}
            </Link>
          </nav>
        </div>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <a
        href="https://wa.me/2250505380826?text=Bonjour%20Archange%20B%C3%A9b%C3%A9%2C%20j%27ai%20une%20question"
        target="_blank"
        rel="noopener noreferrer"
        style={styles.boutonWhatsApp}
        aria-label="Nous contacter sur WhatsApp"
      >
        💬
      </a>

      <footer style={styles.pied}>
        <div className="conteneur" style={styles.piedContenu}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/logo-archange-bebe.png" alt="Archange Bébé" style={{ width: 60, height: 60, objectFit: 'contain', background: 'var(--white)', borderRadius: 8, padding: 4 }} />
            <div>
              <h4 style={{ color: 'var(--white)', marginBottom: 6 }}>Archange Bébé</h4>
              <p style={{ margin: 0, opacity: 0.85, fontSize: 14 }}>Angré Carrefour Adama Sanogho, après le 22ème</p>
              <p style={{ margin: 0, opacity: 0.85, fontSize: 14 }}>0505380826 / 2722242008</p>
              <Link to="/qui-sommes-nous" style={{ color: 'var(--white)', opacity: 0.85, fontSize: 13, textDecoration: 'underline' }}>Qui sommes-nous ?</Link>
              {' · '}
              <Link to="/mentions-legales" style={{ color: 'var(--white)', opacity: 0.85, fontSize: 13, textDecoration: 'underline' }}>Mentions légales & CGV</Link>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <a
              href="https://www.facebook.com/archangebebeciv"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.lienFacebook}
            >
              👍 Suivez-nous sur Facebook
            </a>
            <div style={{ fontSize: 13, opacity: 0.7 }}>© {new Date().getFullYear()} Archange Bébé — Tous droits réservés</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  boutonWhatsApp: {
    position: 'fixed', bottom: 20, right: 20, width: 56, height: 56, borderRadius: '50%',
    background: '#25D366', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 28, textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.25)', zIndex: 90,
  },
  banniere: {
    background: 'var(--bordeaux-deep)', color: 'var(--white)', padding: '10px 20px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, position: 'relative',
    fontSize: 13, fontWeight: 700, textAlign: 'center',
  },
  banniereLien: { color: 'var(--white)' },
  banniereFermer: {
    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
    background: 'transparent', border: 'none', color: 'var(--white)', opacity: 0.8, cursor: 'pointer', fontSize: 14,
  },
  entete: { background: 'var(--white)', boxShadow: '0 2px 10px rgba(31,46,69,0.06)', position: 'sticky', top: 0, zIndex: 30 },
  enteteContenu: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px', flexWrap: 'wrap', gap: 12 },
  logoLien: { display: 'flex', alignItems: 'center' },
  logoImage: { height: 96, objectFit: 'contain' },
  nav: { display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' },
  lienNav: { fontWeight: 700, fontSize: 14, color: 'var(--brown-ink)' },
  lienNavBouton: { fontWeight: 700, fontSize: 14, color: 'var(--brown-ink)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' },
  boutonPanier: {
    display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14,
    background: 'var(--cream-deep)', padding: '9px 16px', borderRadius: 999, position: 'relative',
  },
  badgePanier: {
    background: 'var(--bordeaux-deep)', color: 'var(--white)', fontSize: 11, fontWeight: 800,
    borderRadius: 999, padding: '1px 7px', marginLeft: 2,
  },
  badgeFavoris: {
    background: 'var(--bordeaux-deep)', color: 'var(--white)', fontSize: 10, fontWeight: 800,
    borderRadius: 999, padding: '1px 6px', marginLeft: 2, verticalAlign: 'top',
  },
  pied: { background: 'var(--brown-deep)', color: 'var(--white)', marginTop: 60, padding: '32px 0' },
  piedContenu: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 },
  lienFacebook: {
    color: 'var(--white)', background: 'rgba(255,255,255,0.12)', padding: '8px 16px',
    borderRadius: 999, fontWeight: 700, fontSize: 13,
  },
};
