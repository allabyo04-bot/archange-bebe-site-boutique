import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import CarteProduit from '../components/CarteProduit';
import { appelApi } from '../lib/api';
import { useTitrePage } from '../lib/titre';

export default function Boutique() {
  useTitrePage('Boutique', 'Découvrez tout le catalogue Archange Bébé : biberons, vêtements, poussettes, accessoires de puériculture et plus.');

  const [searchParams, setSearchParams] = useSearchParams();
  const [produits, setProduits] = useState([]);
  const [familles, setFamilles] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recherche, setRecherche] = useState('');

  const familleId = searchParams.get('familleId') || '';
  const sousFamilleId = searchParams.get('sousFamilleId') || '';
  const enPromo = searchParams.get('enPromo') === 'true';
  const tri = searchParams.get('tri') || 'nom';

  useEffect(() => {
    appelApi('GET', '/familles').then(setFamilles).catch(() => {});
  }, []);

  useEffect(() => {
    setChargement(true);
    const params = new URLSearchParams();
    if (recherche.trim()) params.set('q', recherche.trim());
    if (familleId) params.set('familleId', familleId);
    if (sousFamilleId) params.set('sousFamilleId', sousFamilleId);
    if (enPromo) params.set('enPromo', 'true');
    if (tri) params.set('tri', tri);
    params.set('page', page);

    appelApi('GET', `/produits?${params.toString()}`)
      .then((r) => { setProduits(r.produits); setTotalPages(r.totalPages); })
      .catch(() => {})
      .finally(() => setChargement(false));
  }, [familleId, sousFamilleId, enPromo, tri, page, recherche]);

  const familleSelectionnee = familles.find((f) => String(f.id) === familleId);

  function choisirFamille(id) {
    setPage(1);
    if (id) setSearchParams({ familleId: id }); else setSearchParams({});
  }

  function choisirSousFamille(id) {
    setPage(1);
    const params = { familleId };
    if (id) params.sousFamilleId = id;
    setSearchParams(params);
  }

  function quitterPromo() {
    setPage(1);
    setSearchParams({});
  }

  function changerTri(nouveauTri) {
    setPage(1);
    const params = Object.fromEntries(searchParams);
    if (nouveauTri && nouveauTri !== 'nom') params.tri = nouveauTri; else delete params.tri;
    setSearchParams(params);
  }

  return (
    <Layout>
      <div className="conteneur" style={{ padding: '32px 20px 60px' }}>
        <h1 style={{ fontSize: 28, marginBottom: 20 }}>{enPromo ? 'Nos promotions' : 'Notre boutique'}</h1>

        {enPromo && (
          <div style={styles.bandeauPromo}>
            <span>🎉 Tu regardes uniquement les articles en promotion.</span>
            <button onClick={quitterPromo} style={styles.lienDiscret}>Voir tout le catalogue →</button>
          </div>
        )}

        {!enPromo && (
          <>
            <input
              className="champ"
              placeholder="Rechercher un produit…"
              value={recherche}
              onChange={(e) => { setPage(1); setRecherche(e.target.value); }}
              style={{ maxWidth: 420, marginBottom: 20 }}
            />

            <div style={styles.filtres}>
              <button onClick={() => choisirFamille('')} style={!familleId ? styles.filtreActif : styles.filtre}>Tout</button>
              {familles.map((f) => (
                <button key={f.id} onClick={() => choisirFamille(String(f.id))} style={familleId === String(f.id) ? styles.filtreActif : styles.filtre}>
                  {f.nom}
                </button>
              ))}
            </div>

            {familleSelectionnee?.sousFamilles?.length > 0 && (
              <div style={{ ...styles.filtres, marginTop: 8 }}>
                <button onClick={() => choisirSousFamille('')} style={!sousFamilleId ? styles.filtreActifPetit : styles.filtrePetit}>Toutes</button>
                {familleSelectionnee.sousFamilles.map((sf) => (
                  <button key={sf.id} onClick={() => choisirSousFamille(String(sf.id))} style={sousFamilleId === String(sf.id) ? styles.filtreActifPetit : styles.filtrePetit}>
                    {sf.nom}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {chargement && <p style={{ color: 'var(--brown-soft)', marginTop: 30 }}>Chargement…</p>}
        {!chargement && produits.length === 0 && (
          <p style={{ color: 'var(--brown-soft)', marginTop: 30 }}>
            {enPromo ? "Aucune promotion en cours pour l'instant — reviens bientôt !" : 'Aucun produit trouvé.'}
          </p>
        )}

        {!chargement && produits.length > 0 && (
          <div style={styles.ligneTri}>
            <label style={{ fontSize: 13, color: 'var(--brown-soft)', fontWeight: 600 }}>
              Trier par :{' '}
              <select value={tri} onChange={(e) => changerTri(e.target.value)} style={styles.selectTri}>
                <option value="nom">Nom (A → Z)</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
                <option value="nouveaute">Nouveautés</option>
              </select>
            </label>
          </div>
        )}

        <div style={styles.grille}>
          {produits.map((p) => <CarteProduit key={p.id} produit={p} />)}
        </div>

        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="bouton-secondaire">← Précédent</button>
            <span style={{ color: 'var(--brown-soft)', fontWeight: 700 }}>Page {page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="bouton-secondaire">Suivant →</button>
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  filtres: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  filtre: { padding: '9px 16px', borderRadius: 999, border: '1.5px solid var(--cream-deep)', background: 'var(--white)', cursor: 'pointer', fontWeight: 700, fontSize: 13 },
  filtreActif: { padding: '9px 16px', borderRadius: 999, border: '1.5px solid var(--gold-deep)', background: 'var(--gold-deep)', color: 'var(--white)', cursor: 'pointer', fontWeight: 700, fontSize: 13 },
  filtrePetit: { padding: '6px 12px', borderRadius: 999, border: '1px solid var(--cream-deep)', background: 'transparent', cursor: 'pointer', fontWeight: 600, fontSize: 12, color: 'var(--brown-soft)' },
  filtreActifPetit: { padding: '6px 12px', borderRadius: 999, border: '1px solid var(--bordeaux-deep)', background: 'var(--bordeaux-deep)', color: 'var(--white)', cursor: 'pointer', fontWeight: 600, fontSize: 12 },
  grille: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginTop: 28 },
  pagination: { display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginTop: 40 },
  bandeauPromo: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10,
    background: 'var(--cream-deep)', padding: '14px 18px', borderRadius: 12, fontWeight: 700, marginBottom: 24,
  },
  lienDiscret: { background: 'none', border: 'none', color: 'var(--gold-deep)', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' },
  ligneTri: { display: 'flex', justifyContent: 'flex-end', marginTop: 24 },
  selectTri: { padding: '6px 10px', borderRadius: 8, border: '1px solid var(--cream-deep)', fontSize: 13, fontFamily: 'inherit' },
};
