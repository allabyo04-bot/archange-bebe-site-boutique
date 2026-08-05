import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { appelApi } from '../lib/api';

const INTERVALLE_SONDAGE_MS = 4000;
const NB_TENTATIVES_MAX = 90; // ~6 minutes

export default function ConfirmationCommande() {
  const { numero } = useParams();
  const [statut, setStatut] = useState(null); // null = chargement, sinon { modePaiement, paiementRecu, jekoPaymentUrl }
  const [lienOuvert, setLienOuvert] = useState(false);
  const [tentatives, setTentatives] = useState(0);
  const [relanceEnCours, setRelanceEnCours] = useState(false);
  const [erreurRelance, setErreurRelance] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    let annule = false;

    async function verifier() {
      try {
        const s = await appelApi('GET', `/commandes/${numero}/statut-paiement`);
        if (!annule) setStatut(s);
        return s;
      } catch {
        return null;
      }
    }

    verifier();

    intervalRef.current = setInterval(async () => {
      const s = await verifier();
      setTentatives((t) => t + 1);
      if (s?.paiementRecu || s?.modePaiement === 'A_LA_LIVRAISON') {
        clearInterval(intervalRef.current);
      }
    }, INTERVALLE_SONDAGE_MS);

    return () => { annule = true; clearInterval(intervalRef.current); };
  }, [numero]);

  useEffect(() => {
    if (statut?.paiementRecu || statut?.modePaiement === 'A_LA_LIVRAISON') {
      clearInterval(intervalRef.current);
    }
  }, [statut]);

  function ouvrirPaiement() {
    if (statut?.jekoPaymentUrl) {
      window.open(statut.jekoPaymentUrl, '_blank', 'noopener,noreferrer');
      setLienOuvert(true);
    }
  }

  async function relancerPaiement() {
    setRelanceEnCours(true);
    setErreurRelance('');
    try {
      const r = await appelApi('POST', `/commandes/${numero}/relancer-paiement`);
      setStatut((prec) => ({ ...prec, jekoPaymentUrl: r.jekoPaymentUrl }));
      window.open(r.jekoPaymentUrl, '_blank', 'noopener,noreferrer');
      setLienOuvert(true);
    } catch (err) {
      setErreurRelance(err.message);
    } finally {
      setRelanceEnCours(false);
    }
  }

  const delaiDepasse = tentatives >= NB_TENTATIVES_MAX;

  return (
    <Layout>
      <div className="conteneur" style={{ padding: '60px 20px', maxWidth: 520, textAlign: 'center' }}>
        {!statut && <p style={{ color: 'var(--brown-soft)' }}>Chargement…</p>}

        {statut && statut.modePaiement === 'A_LA_LIVRAISON' && (
          <>
            <div style={{ fontSize: 50, marginBottom: 10 }}>✅</div>
            <h1 style={{ fontSize: 26, marginBottom: 10 }}>Commande enregistrée !</h1>
            <p style={{ color: 'var(--brown-soft)', marginBottom: 6 }}>
              Numéro de commande : <strong style={{ color: 'var(--brown-ink)' }}>{numero}</strong>
            </p>
            <p style={{ color: 'var(--brown-soft)', marginBottom: 30 }}>
              Nous te contactons très vite pour confirmer la préparation. Merci de ta confiance !
            </p>
            <Link to="/boutique" className="bouton-principal" style={{ display: 'inline-block' }}>Continuer mes achats</Link>
          </>
        )}

        {statut && statut.modePaiement === 'JEKO' && statut.paiementRecu && (
          <>
            <div style={{ fontSize: 50, marginBottom: 10 }}>✅</div>
            <h1 style={{ fontSize: 26, marginBottom: 10 }}>Paiement confirmé !</h1>
            <p style={{ color: 'var(--brown-soft)', marginBottom: 6 }}>
              Numéro de commande : <strong style={{ color: 'var(--brown-ink)' }}>{numero}</strong>
            </p>
            <p style={{ color: 'var(--brown-soft)', marginBottom: 30 }}>
              Ton paiement a bien été reçu. Nous préparons ta commande, merci de ta confiance !
            </p>
            <Link to="/boutique" className="bouton-principal" style={{ display: 'inline-block' }}>Continuer mes achats</Link>
          </>
        )}

        {statut && statut.modePaiement === 'JEKO' && !statut.paiementRecu && !statut.jekoPaymentUrl && (
          <>
            <div style={{ fontSize: 50, marginBottom: 10 }}>⚠️</div>
            <h1 style={{ fontSize: 24, marginBottom: 10 }}>Le paiement n'a pas pu démarrer</h1>
            <p style={{ color: 'var(--brown-soft)', marginBottom: 20 }}>
              Numéro de commande : <strong style={{ color: 'var(--brown-ink)' }}>{numero}</strong><br />
              Ta commande est bien enregistrée. Un souci technique passager a empêché la
              création du lien de paiement.
            </p>
            {erreurRelance && <p style={{ color: 'var(--error)', marginBottom: 12 }}>{erreurRelance}</p>}
            <button onClick={relancerPaiement} disabled={relanceEnCours} className="bouton-bordeaux" style={{ width: '100%', marginBottom: 12 }}>
              {relanceEnCours ? 'Nouvelle tentative…' : 'Réessayer le paiement'}
            </button>
            <p style={{ fontSize: 12, color: 'var(--brown-soft)' }}>
              Si ça persiste, contacte-nous au 0505380826 en précisant ton numéro de commande.
            </p>
          </>
        )}

        {statut && statut.modePaiement === 'JEKO' && !statut.paiementRecu && statut.jekoPaymentUrl && !delaiDepasse && (
          <>
            <div style={{ fontSize: 50, marginBottom: 10 }}>💳</div>
            <h1 style={{ fontSize: 24, marginBottom: 10 }}>Finalise ton paiement</h1>
            <p style={{ color: 'var(--brown-soft)', marginBottom: 20 }}>
              Numéro de commande : <strong style={{ color: 'var(--brown-ink)' }}>{numero}</strong>
            </p>

            {!lienOuvert ? (
              <button onClick={ouvrirPaiement} className="bouton-bordeaux" style={{ width: '100%' }}>
                Ouvrir la page de paiement
              </button>
            ) : (
              <>
                <p style={{ color: 'var(--brown-soft)', marginBottom: 12 }}>
                  ⏳ En attente de la confirmation de ton paiement — cette page se met à jour automatiquement.
                </p>
                <button onClick={ouvrirPaiement} style={{ background: 'none', border: 'none', color: 'var(--gold-deep)', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                  Rouvrir la page de paiement
                </button>
              </>
            )}
          </>
        )}

        {statut && statut.modePaiement === 'JEKO' && !statut.paiementRecu && statut.jekoPaymentUrl && delaiDepasse && (
          <>
            <div style={{ fontSize: 50, marginBottom: 10 }}>⏳</div>
            <h1 style={{ fontSize: 24, marginBottom: 10 }}>Paiement toujours en attente</h1>
            <p style={{ color: 'var(--brown-soft)', marginBottom: 20 }}>
              Numéro de commande : <strong style={{ color: 'var(--brown-ink)' }}>{numero}</strong><br />
              Si tu as déjà payé, ça ne devrait plus tarder — rafraîchis la page dans quelques instants.
              Sinon, tu peux réessayer le paiement ci-dessous.
            </p>
            <button onClick={ouvrirPaiement} className="bouton-bordeaux" style={{ width: '100%', marginBottom: 12 }}>
              Ouvrir la page de paiement
            </button>
            <Link to="/boutique" style={{ color: 'var(--gold-deep)', fontWeight: 700, fontSize: 13 }}>Continuer mes achats</Link>
          </>
        )}
      </div>
    </Layout>
  );
}
