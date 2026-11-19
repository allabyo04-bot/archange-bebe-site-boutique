import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { appelApi } from '../lib/api';
import CarteProduit from '../components/CarteProduit';
import CarrouselPromo from '../components/CarrouselPromo';
import { useTitrePage } from '../lib/titre';
import { themeDuJour } from '../lib/saison';

// Icône et couleur de pastille selon le nom de la famille (base de gestion).
const ICONES_FAMILLES = [
  ['BIBERON', '🍼'], ['JOUET', '🧸'], ['VETEMENT', '👕'], ['CHAUSSURE', '👟'], ['COSMETIQUE', '🧴'],
  ['COUCHE', '👶'], ['COTON', '☁️'], ['LITERIE', '🛏️'], ['PISCINE', '🏊'], ['MAMAN', '🤰'],
  ['PUERICULTURE', '🍼'], ['SAC', '👜'], ['SERVIETTE', '🛁'], ['SUCRERIE', '🍬'], ['TRANSPORT', '🚼'],
  ['SCOLAIRE', '🎒'], ['LINGERIE', '🩲'], ['ACCESSOIRE', '🎀'], ['KIT', '🎁'],
];
const COULEURS_PASTILLES = ['#F7C6D9', '#BFD4F2', '#FBE3A6', '#C9EBDD', '#E3D3F5'];

// Photos de la grande bannière (à déposer dans public/hero/). Si une photo manque, elle est simplement ignorée
// et la bannière garde son dégradé de couleurs.
const PHOTOS_BANNIERE = ['/hero/accueil-1.jpg', '/hero/accueil-2.jpg', '/hero/accueil-3.jpg'];
const INTERVALLE_BANNIERE_MS = 6000;

function iconeFamille(nom) {
  const n = nom.toUpperCase();
  const trouve = ICONES_FAMILLES.find(([cle]) => n.includes(cle));
  return trouve ? trouve[1] : '✨';
}

export default function Accueil() {
  useTitrePage(null, "Archange Bébé, boutique de puériculture et mode enfant à Abidjan. Retrait en boutique ou livraison, paiement en ligne sécurisé.");
  const navigate = useNavigate();
  const theme = themeDuJour();

  const [familles, setFamilles] = useState([]);
  const [nouveautes, setNouveautes] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [kits, setKits] = useState([]);
  const [totalArticles, setTotalArticles] = useState(null);
  const [recherche, setRecherche] = useState('');
  const [photosBanniere, setPhotosBanniere] = useState([]);
  const [indexPhoto, setIndexPhoto] = useState(0);

  // On vérifie quelles photos existent vraiment avant de les afficher.
  useEffect(() => {
    let annule = false;
    Promise.all(PHOTOS_BANNIERE.map((url) => new Promise((ok) => {
      const img = new Image();
      img.onload = () => ok(url);
      img.onerror = () => ok(null);
      img.src = url;
    }))).then((res) => { if (!annule) setPhotosBanniere(res.filter(Boolean)); });
    return () => { annule = true; };
  }, []);

  useEffect(() => {
    if (photosBanniere.length < 2) return;
    const t = setInterval(() => setIndexPhoto((i) => (i + 1) % photosBanniere.length), INTERVALLE_BANNIERE_MS);
    return () => clearInterval(t);
  }, [photosBanniere.length]);

  useEffect(() => {
    appelApi('GET', '/familles').then(setFamilles).catch(() => {});
    appelApi('GET', '/produits?page=1').then((r) => {
      setNouveautes(r.produits.slice(0, 8));
      if (r.total) setTotalArticles(r.total);
    }).catch(() => {});
    appelApi('GET', '/produits?enPromo=true&page=1').then((r) => setPromotions(r.produits.slice(0, 8))).catch(() => {});
    appelApi('GET', '/produits?q=KIT%20NAISSANCE&page=1').then((r) => setKits(r.produits.slice(0, 4))).catch(() => {});
  }, []);

  // Familles affichées : on écarte les noms trop courts (ex. « V ») qui ne parlent pas aux clients.
  const famillesVisibles = familles.filter((f) => f.nom && f.nom.trim().length > 2 && f.nom.trim().toUpperCase() !== 'DIVERS');

  // Collage de la grande bannière : les articles qui ont une photo.
  const photosCollage = [...promotions, ...nouveautes].filter((p) => p.photoUrl)
    .filter((p, i, t) => t.findIndex((x) => x.id === p.id) === i).slice(0, 4);

  function lancerRecherche(e) {
    e.preventDefault();
    const q = recherche.trim();
    navigate(q ? `/boutique?q=${encodeURIComponent(q)}` : '/boutique');
  }

  return (
    <Layout>
      {/* ===== Grande bannière d'accueil ===== */}
      <section className={`hero-accueil hero-${theme.cle}${photosBanniere.length ? ' hero-avec-photo' : ''}${theme.imageCote ? ' hero-avec-cote' : ''}`}>
        {photosBanniere.map((url, i) => (
          <div key={url} className="hero-photo" style={{ backgroundImage: `url(${url})`, opacity: i === indexPhoto ? 1 : 0 }} aria-hidden="true" />
        ))}
        {photosBanniere.length > 0 && <div className="hero-voile" aria-hidden="true" />}
        {photosBanniere.length > 1 && (
          <div className="hero-points">
            {photosBanniere.map((url, i) => (
              <button key={url} type="button" onClick={() => setIndexPhoto(i)} className={i === indexPhoto ? 'actif' : ''} aria-label={`Photo ${i + 1}`} />
            ))}
          </div>
        )}
        <div className="hero-decor" aria-hidden="true">
          {theme.decor.map((d, i) => (
            <span key={i} className="hero-decor-item" style={{ left: `${6 + i * 12}%`, animationDelay: `${i * 1.3}s`, fontSize: 14 + (i % 3) * 8 }}>{d}</span>
          ))}
        </div>

        <div className="conteneur hero-grille">
          <div className="hero-texte">
            <span className="hero-badge">{theme.badge}</span>
            <h1 className="hero-titre">{theme.titre}</h1>
            <p className="hero-slogan">💙 Pour Le Bonheur Des Boudchou 💗</p>
            <p className="hero-paragraphe">{theme.texte}</p>

            <form onSubmit={lancerRecherche} className="hero-recherche">
              <span aria-hidden="true">🔍</span>
              <input
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Ex : couche, biberon, poussette…"
                aria-label="Rechercher un produit"
              />
              <button type="submit">Rechercher</button>
            </form>

            <div className="hero-boutons">
              <Link to="/boutique" className="hero-bouton-plein">🛍️ Voir la boutique</Link>
              <Link to={theme.bouton2.lien} className="hero-bouton-contour">{theme.bouton2.libelle}</Link>
            </div>

            <div className="hero-chiffres">
              {totalArticles && (
                <div><strong>{(Math.floor(totalArticles / 100) * 100).toLocaleString('fr-FR')}+</strong><span>articles</span></div>
              )}
              {famillesVisibles.length > 0 && (
                <div><strong>{famillesVisibles.length}</strong><span>univers</span></div>
              )}
              <div><strong>0–15 ans</strong><span>de la grossesse à l'ado</span></div>
            </div>
          </div>

          {theme.imageCote && (
            <div className="hero-image-cote">
              <img src={theme.imageCote} alt="Vitrine de Noël Archange Bébé" />
            </div>
          )}

          {!theme.imageCote && photosBanniere.length === 0 && photosCollage.length >= 3 && (
            <div className="hero-collage" aria-hidden="true">
              {photosCollage.map((p, i) => (
                <div key={p.id} className={`hero-collage-carte carte-${i}`}>
                  <img src={p.photoUrl} alt="" />
                </div>
              ))}
              <img src="/logo-archange-bebe.png" alt="" className="hero-collage-logo" />
            </div>
          )}
        </div>
      </section>

      {/* ===== Bande de confiance ===== */}
      <section className="conteneur" style={styles.bandeConfiance}>
        <div style={styles.itemConfiance}><span style={styles.iconeConfiance}>🏬</span> Retrait gratuit à Angré</div>
        <div style={styles.itemConfiance}><span style={styles.iconeConfiance}>🚚</span> Livraison à Abidjan</div>
        <div style={styles.itemConfiance}><span style={styles.iconeConfiance}>📱</span> Wave, Orange Money, carte</div>
        <div style={styles.itemConfiance}><span style={styles.iconeConfiance}>🎁</span> Programme de fidélité</div>
      </section>

      {/* ===== Univers en pastilles ===== */}
      {famillesVisibles.length > 0 && (
        <section className="conteneur" style={{ marginTop: 56 }}>
          <div style={styles.enTeteSection}>
            <h2 style={styles.titreSection}>Explorer par <span style={styles.motCouleur}>univers</span></h2>
            <Link to="/boutique" style={styles.lienVoirTout}>Tout voir →</Link>
          </div>
          <div className="pastilles-familles">
            {famillesVisibles.map((f, i) => (
              <Link key={f.id} to={`/boutique?familleId=${f.id}`} className="pastille-famille">
                <span className="pastille-rond" style={{ background: COULEURS_PASTILLES[i % COULEURS_PASTILLES.length] }}>
                  {iconeFamille(f.nom)}
                </span>
                <span className="pastille-nom">{f.nom}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== Promotions en carrousel ===== */}
      {promotions.length > 0 && (
        <section className="conteneur" style={{ marginTop: 56 }}>
          <div style={styles.enTeteSection}>
            <h2 style={styles.titreSection}>🎉 Promotions <span style={styles.motCouleur}>du moment</span></h2>
            <Link to="/boutique?enPromo=true" style={styles.lienVoirTout}>Voir tout →</Link>
          </div>
          <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--ombre)' }}>
            <CarrouselPromo produits={promotions} />
          </div>
        </section>
      )}

      {/* ===== Kits naissance ===== */}
      {kits.length > 0 && (
        <section style={styles.sectionKits}>
          <div className="conteneur">
            <div style={styles.enTeteSection}>
              <div>
                <h2 style={styles.titreSection}>🎁 Kits <span style={styles.motCouleur}>naissance</span></h2>
                <p style={styles.sousTitre}>Tout le nécessaire pour accueillir bébé, réuni dans un seul kit.</p>
              </div>
              <Link to="/boutique?q=KIT%20NAISSANCE" style={styles.lienVoirTout}>Voir tous les kits →</Link>
            </div>
            <div style={styles.grilleProduits}>
              {kits.map((p) => <CarteProduit key={p.id} produit={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ===== Nos produits ===== */}
      {nouveautes.length > 0 && (
        <section className="conteneur" style={{ marginTop: 56, marginBottom: 20 }}>
          <div style={styles.enTeteSection}>
            <h2 style={styles.titreSection}>Nos <span style={styles.motCouleur}>produits</span></h2>
            <Link to="/boutique" style={styles.lienVoirTout}>Voir tout →</Link>
          </div>
          <div style={styles.grilleProduits}>
            {nouveautes.map((p) => <CarteProduit key={p.id} produit={p} />)}
          </div>
        </section>
      )}

      {/* ===== Nous trouver ===== */}
      <section className="conteneur" style={{ marginTop: 64 }}>
        <div className="bloc-nous-trouver">
          <img src="/hero/facade.jpg" alt="Façade de la boutique Archange Bébé à Angré" className="nous-trouver-photo" />
          <div className="nous-trouver-texte">
            <h2 style={styles.titreSection}>Venez nous <span style={styles.motCouleur}>voir</span></h2>
            <p style={{ margin: '10px 0 4px', fontWeight: 700 }}>📍 Angré Carrefour Adama Sanogho, après le 22ème</p>
            <p style={{ margin: '0 0 16px', color: 'var(--brown-soft)' }}>📞 05 05 38 08 26 · 27 22 24 20 08</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href="https://www.google.com/maps/search/?api=1&query=Archange+B%C3%A9b%C3%A9+Angr%C3%A9+Abidjan" target="_blank" rel="noopener noreferrer" className="bouton-principal">🗺️ Itinéraire</a>
              <a href="https://wa.me/2250505380826" target="_blank" rel="noopener noreferrer" className="bouton-secondaire">💬 WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== À propos ===== */}
      <section className="conteneur" style={styles.blocApropos}>
        <img src="/logo-archange-bebe.png" alt="Archange Bébé" style={{ height: 70, margin: '0 auto 12px' }} />
        <p style={styles.texteApropos}>
          Archange Bébé accompagne les parents à chaque étape, de la grossesse jusqu'aux 15 ans de l'enfant :
          puériculture, layette, vêtements, jouets et accessoires, sélectionnés avec soin dans notre boutique d'Angré.
        </p>
        <Link to="/qui-sommes-nous" style={styles.lienVoirTout}>En savoir plus sur nous →</Link>
      </section>
    </Layout>
  );
}

const styles = {
  bandeConfiance: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12,
    marginTop: -30, position: 'relative', zIndex: 5,
  },
  itemConfiance: {
    background: 'var(--white)', borderRadius: 14, padding: '16px 18px', boxShadow: '0 8px 24px rgba(31,46,69,0.12)',
    display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 14,
  },
  iconeConfiance: { fontSize: 22 },
  enTeteSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22, flexWrap: 'wrap', gap: 8 },
  titreSection: { fontSize: 28, margin: 0 },
  motCouleur: { color: 'var(--bordeaux-deep)' },
  sousTitre: { margin: '6px 0 0', color: 'var(--brown-soft)', fontSize: 15 },
  lienVoirTout: { color: 'var(--gold-deep)', fontWeight: 700, fontSize: 14 },
  grilleProduits: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 },
  sectionKits: { marginTop: 64, padding: '48px 0', background: 'linear-gradient(135deg, #FDEEF4, #EAF1FB)' },
  blocApropos: { marginTop: 64, textAlign: 'center', maxWidth: 680, marginLeft: 'auto', marginRight: 'auto' },
  texteApropos: { color: 'var(--brown-soft)', fontSize: 15, lineHeight: 1.7, marginBottom: 10 },
};
