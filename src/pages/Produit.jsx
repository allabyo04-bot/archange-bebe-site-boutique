import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import CarteProduit from '../components/CarteProduit';
import { appelApi } from '../lib/api';
import { ajouterAuPanier } from '../lib/panier';
import { estFavori, basculerFavori } from '../lib/favoris';
import { marquerCommeVu } from '../lib/vus-recemment';
import { useTitrePage } from '../lib/titre';

export default function Produit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produit, setProduit] = useState(null);
  useTitrePage(produit?.designation, produit?.description || undefined);
  const [erreur, setErreur] = useState('');
  const [quantite, setQuantite] = useState(1);
  const [ajoute, setAjoute] = useState(false);
  const [photoActive, setPhotoActive] = useState(null);
  const [favori, setFavori] = useState(false);
  const [similaires, setSimilaires] = useState([]);
  const [avis, setAvis] = useState([]);
  const [moyenneAvis, setMoyenneAvis] = useState(null);
  const [formulaireAvisOuvert, setFormulaireAvisOuvert] = useState(false);
  const [nomAvis, setNomAvis] = useState('');
  const [noteAvis, setNoteAvis] = useState(5);
  const [commentaireAvis, setCommentaireAvis] = useState('');
  const [envoiAvisEnCours, setEnvoiAvisEnCours] = useState(false);
  const [erreurAvis, setErreurAvis] = useState('');
  const [merciAvis, setMerciAvis] = useState(false);

  useEffect(() => {
    setProduit(null);
    setSimilaires([]);
    setAvis([]);
    setMoyenneAvis(null);
    appelApi('GET', `/produits/${id}`).then((data) => {
      setProduit(data);
      setFavori(estFavori(data.id));
      marquerCommeVu(data);
      const photos = data.photos || [];
      const principale = photos.find((p) => p.estPrincipale) || photos[0];
      setPhotoActive(principale ? principale.url : data.photoUrl || null);
    }).catch((err) => setErreur(err.message));
    appelApi('GET', `/produits/${id}/similaires`).then(setSimilaires).catch(() => {});
    chargerAvis();
  }, [id]);

  function chargerAvis() {
    appelApi('GET', `/produits/${id}/avis`).then((r) => {
      setAvis(r.avis);
      setMoyenneAvis(r.moyenne);
    }).catch(() => {});
  }

  function gererAjout() {
    ajouterAuPanier(produit, quantite);
    setAjoute(true);
    setTimeout(() => setAjoute(false), 2000);
  }

  function gererFavori() {
    basculerFavori(produit);
    setFavori((f) => !f);
  }

  async function gererEnvoiAvis(e) {
    e.preventDefault();
    setErreurAvis('');
    if (!nomAvis.trim()) return setErreurAvis('Ton nom est requis.');
    setEnvoiAvisEnCours(true);
    try {
      await appelApi('POST', `/produits/${id}/avis`, {
        nomClient: nomAvis.trim(),
        note: noteAvis,
        commentaire: commentaireAvis.trim() || undefined,
      });
      setMerciAvis(true);
      setFormulaireAvisOuvert(false);
      setNomAvis('');
      setCommentaireAvis('');
      setNoteAvis(5);
      chargerAvis();
    } catch (err) {
      setErreurAvis(err.message);
    } finally {
      setEnvoiAvisEnCours(false);
    }
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
          <div>
            <div style={styles.imageZone}>
              {photoActive ? (
                <img src={photoActive} alt={produit.designation} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 60, opacity: 0.3 }}>📦</span>
              )}
              {enPromo && <span style={styles.badgePromo}>-{pourcentageRemise}%</span>}
            </div>
            {produit.photos && produit.photos.length > 1 && (
              <div style={styles.miniatures}>
                {produit.photos.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => setPhotoActive(photo.url)}
                    style={{
                      ...styles.miniature,
                      outline: photoActive === photo.url ? '2px solid var(--gold-deep)' : '2px solid transparent',
                    }}
                  >
                    <img src={photo.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {produit.famille && <p style={styles.filDAriane}>{produit.famille.nom}{produit.sousFamille ? ` — ${produit.sousFamille.nom}` : ''}</p>}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <h1 style={{ fontSize: 28, marginBottom: 10 }}>{produit.designation}</h1>
              <button onClick={gererFavori} style={styles.boutonFavori} aria-label={favori ? 'Retirer des favoris' : 'Ajouter aux favoris'} title={favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
                {favori ? '❤️' : '🤍'}
              </button>
            </div>

            {moyenneAvis && (
              <p style={{ color: 'var(--brown-soft)', fontSize: 14, marginTop: -4, marginBottom: 4 }}>
                {'★'.repeat(Math.round(moyenneAvis))}{'☆'.repeat(5 - Math.round(moyenneAvis))} {moyenneAvis}/5 ({avis.length} avis)
              </p>
            )}

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
              <p style={{ color: 'var(--succes)', fontWeight: 700, marginTop: 8 }}>
                ✓ En stock
                {produit.stockActuel > 0 && produit.stockActuel <= 3 && (
                  <span style={{ color: 'var(--bordeaux-deep)', fontWeight: 700 }}> — Plus que {produit.stockActuel} en stock !</span>
                )}
              </p>
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

            {produit.description && (
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--cream-deep)' }}>
                <h2 style={{ fontSize: 15, marginBottom: 8 }}>Description</h2>
                <p style={{ color: 'var(--brown-soft)', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{produit.description}</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--cream-deep)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <h2 style={{ fontSize: 20 }}>Avis clients {avis.length > 0 && `(${avis.length})`}</h2>
            {!formulaireAvisOuvert && (
              <button onClick={() => setFormulaireAvisOuvert(true)} className="bouton-secondaire">
                Laisser un avis
              </button>
            )}
          </div>

          {merciAvis && <p style={{ color: 'var(--succes)', fontWeight: 700, marginTop: 12 }}>Merci pour ton avis !</p>}

          {formulaireAvisOuvert && (
            <form onSubmit={gererEnvoiAvis} style={styles.formAvis}>
              {erreurAvis && <p style={{ color: 'var(--error)' }}>{erreurAvis}</p>}
              <label className="etiquette-champ">
                Ton nom *
                <input className="champ" value={nomAvis} onChange={(e) => setNomAvis(e.target.value)} />
              </label>
              <label className="etiquette-champ">
                Note
                <select className="champ" value={noteAvis} onChange={(e) => setNoteAvis(Number(e.target.value))}>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</option>)}
                </select>
              </label>
              <label className="etiquette-champ">
                Commentaire (optionnel)
                <textarea className="champ" rows={3} value={commentaireAvis} onChange={(e) => setCommentaireAvis(e.target.value)} />
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setFormulaireAvisOuvert(false)} className="bouton-secondaire">Annuler</button>
                <button type="submit" disabled={envoiAvisEnCours} className="bouton-principal">
                  {envoiAvisEnCours ? 'Envoi…' : 'Publier mon avis'}
                </button>
              </div>
            </form>
          )}

          {avis.length === 0 ? (
            <p style={{ color: 'var(--brown-soft)', marginTop: 16 }}>Aucun avis pour l'instant — sois le premier à donner ton avis !</p>
          ) : (
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {avis.map((a) => (
                <div key={a.id} style={styles.avisCarte}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <strong>{a.nomClient}</strong>
                    <span style={{ color: 'var(--gold-deep)' }}>{'★'.repeat(a.note)}{'☆'.repeat(5 - a.note)}</span>
                  </div>
                  {a.commentaire && <p style={{ color: 'var(--brown-soft)', fontSize: 14, marginTop: 6 }}>{a.commentaire}</p>}
                  <p style={{ color: 'var(--brown-soft)', fontSize: 12, marginTop: 6, opacity: 0.7 }}>
                    {new Date(a.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {similaires.length > 0 && (
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--cream-deep)' }}>
            <h2 style={{ fontSize: 20, marginBottom: 20 }}>Vous aimerez aussi</h2>
            <div style={styles.grilleSimilaires}>
              {similaires.map((p) => <CarteProduit key={p.id} produit={p} />)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  grille: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 },
  imageZone: { aspectRatio: '1 / 1', background: 'var(--cream-deep)', borderRadius: 'var(--rayon)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' },
  miniatures: { display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  miniature: { width: 56, height: 56, borderRadius: 8, overflow: 'hidden', border: 'none', padding: 0, cursor: 'pointer', background: 'var(--cream-deep)' },
  badgePromo: { position: 'absolute', top: 14, left: 14, background: 'var(--bordeaux-deep)', color: 'var(--white)', fontSize: 13, fontWeight: 800, padding: '5px 12px', borderRadius: 999 },
  badgePromoInline: { background: '#FBE4E1', color: 'var(--bordeaux-deep)', fontSize: 12, fontWeight: 800, padding: '4px 10px', borderRadius: 999 },
  filDAriane: { color: 'var(--brown-soft)', fontSize: 13, fontWeight: 700, marginBottom: 6 },
  prix: { color: 'var(--gold-deep)', fontWeight: 800, fontSize: 30 },
  prixPromo: { color: 'var(--bordeaux-deep)', fontWeight: 800, fontSize: 30 },
  prixBarre: { color: 'var(--brown-soft)', fontSize: 18, textDecoration: 'line-through' },
  selecteurQte: { display: 'flex', alignItems: 'center', gap: 12, background: 'var(--cream-deep)', borderRadius: 999, padding: '6px 14px' },
  boutonQte: { width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'var(--white)', fontSize: 18, fontWeight: 800, cursor: 'pointer' },
  boutonFavori: { background: 'none', border: 'none', fontSize: 26, cursor: 'pointer', padding: 4, lineHeight: 1 },
  formAvis: { display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18, maxWidth: 420, background: 'var(--cream-deep)', padding: 20, borderRadius: 'var(--rayon)' },
  avisCarte: { background: 'var(--cream-deep)', padding: 16, borderRadius: 'var(--rayon)' },
  grilleSimilaires: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 18 },
};
