import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { appelApi, getClient } from '../lib/api';
import { obtenirPanier, totalPanier, viderPanier } from '../lib/panier';

export default function Commande() {
  const navigate = useNavigate();
  const client = getClient();
  const lignes = obtenirPanier();
  const total = totalPanier(lignes);

  const [lieux, setLieux] = useState([]);
  const [modeLivraison, setModeLivraison] = useState('RETRAIT');
  const [lieuRetraitId, setLieuRetraitId] = useState('');
  const [adresseLivraison, setAdresseLivraison] = useState('');
  const [villeLivraison, setVilleLivraison] = useState('');
  const [nomClient, setNomClient] = useState(client?.nomComplet || '');
  const [telephoneClient, setTelephoneClient] = useState(client?.telephone || '');
  const [emailClient, setEmailClient] = useState(client?.email || '');
  const [notes, setNotes] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    appelApi('GET', '/lieux').then(setLieux).catch(() => {});
  }, []);

  useEffect(() => {
    if (lignes.length === 0) navigate('/panier');
  }, []); // eslint-disable-line

  async function validerCommande(e) {
    e.preventDefault();
    setErreur('');

    if (!nomClient.trim() || !telephoneClient.trim()) {
      setErreur('Nom et téléphone sont requis.');
      return;
    }
    if (modeLivraison === 'RETRAIT' && !lieuRetraitId) {
      setErreur('Choisis une boutique de retrait.');
      return;
    }
    if (modeLivraison === 'LIVRAISON' && (!adresseLivraison.trim() || !villeLivraison.trim())) {
      setErreur('Adresse et ville de livraison sont requises.');
      return;
    }

    setEnvoiEnCours(true);
    try {
      const commande = await appelApi('POST', '/commandes', {
        nomClient, telephoneClient, emailClient: emailClient || undefined,
        modeLivraison,
        lieuRetraitId: modeLivraison === 'RETRAIT' ? Number(lieuRetraitId) : undefined,
        adresseLivraison: modeLivraison === 'LIVRAISON' ? adresseLivraison : undefined,
        villeLivraison: modeLivraison === 'LIVRAISON' ? villeLivraison : undefined,
        notes: notes || undefined,
        lignes: lignes.map((l) => ({ articleId: l.articleId, quantite: l.quantite })),
      });
      viderPanier();
      navigate(`/confirmation/${commande.numero}`);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoiEnCours(false);
    }
  }

  if (lignes.length === 0) return null;

  return (
    <Layout>
      <div className="conteneur" style={{ padding: '32px 20px 60px', maxWidth: 640 }}>
        <h1 style={{ fontSize: 28, marginBottom: 24 }}>Finaliser la commande</h1>

        {!client && (
          <p style={{ color: 'var(--brown-soft)', marginBottom: 20, fontSize: 14 }}>
            Tu commandes en tant qu'invité. <Link to="/compte" style={{ color: 'var(--gold-deep)', fontWeight: 700 }}>Se connecter</Link> pour profiter des avantages fidélité.
          </p>
        )}

        <form onSubmit={validerCommande} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {erreur && <div style={styles.bandeauErreur}>{erreur}</div>}

          <label className="etiquette-champ">
            Nom complet
            <input className="champ" value={nomClient} onChange={(e) => setNomClient(e.target.value)} disabled={!!client} />
          </label>
          <label className="etiquette-champ">
            Téléphone
            <input className="champ" value={telephoneClient} onChange={(e) => setTelephoneClient(e.target.value)} disabled={!!client} />
          </label>
          <label className="etiquette-champ">
            Email (optionnel)
            <input className="champ" type="email" value={emailClient} onChange={(e) => setEmailClient(e.target.value)} />
          </label>

          <div style={styles.choixMode}>
            <button type="button" onClick={() => setModeLivraison('RETRAIT')} style={modeLivraison === 'RETRAIT' ? styles.modeActif : styles.mode}>
              🏬 Retrait en boutique
            </button>
            <button type="button" onClick={() => setModeLivraison('LIVRAISON')} style={modeLivraison === 'LIVRAISON' ? styles.modeActif : styles.mode}>
              🚚 Livraison
            </button>
          </div>

          {modeLivraison === 'RETRAIT' && (
            <label className="etiquette-champ">
              Boutique de retrait
              <select className="champ" value={lieuRetraitId} onChange={(e) => setLieuRetraitId(e.target.value)}>
                <option value="">— Choisir —</option>
                {lieux.map((l) => <option key={l.id} value={l.id}>{l.nom}</option>)}
              </select>
            </label>
          )}

          {modeLivraison === 'LIVRAISON' && (
            <>
              <label className="etiquette-champ">
                Adresse de livraison
                <input className="champ" value={adresseLivraison} onChange={(e) => setAdresseLivraison(e.target.value)} placeholder="Quartier, rue, repère…" />
              </label>
              <label className="etiquette-champ">
                Ville
                <input className="champ" value={villeLivraison} onChange={(e) => setVilleLivraison(e.target.value)} placeholder="Ex: Abidjan" />
              </label>
            </>
          )}

          <label className="etiquette-champ">
            Notes (optionnel)
            <textarea className="champ" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>

          <div style={styles.recapTotal}>
            <span>Total à régler {modeLivraison === 'RETRAIT' ? 'au retrait' : 'à la livraison'}</span>
            <strong style={{ color: 'var(--gold-deep)', fontSize: 20 }}>{total.toLocaleString('fr-FR')} F</strong>
          </div>

          <button type="submit" disabled={envoiEnCours} className="bouton-bordeaux" style={{ width: '100%' }}>
            {envoiEnCours ? 'Envoi…' : 'Confirmer ma commande'}
          </button>
        </form>
      </div>
    </Layout>
  );
}

const styles = {
  bandeauErreur: { padding: '10px 14px', borderRadius: 8, background: '#FBE4E1', color: 'var(--error)', fontWeight: 700, fontSize: 14 },
  choixMode: { display: 'flex', gap: 10 },
  mode: { flex: 1, padding: '14px 10px', borderRadius: 12, border: '1.5px solid var(--cream-deep)', background: 'var(--white)', cursor: 'pointer', fontWeight: 700 },
  modeActif: { flex: 1, padding: '14px 10px', borderRadius: 12, border: '1.5px solid var(--gold-deep)', background: 'var(--cream-deep)', cursor: 'pointer', fontWeight: 700 },
  recapTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--cream-deep)', padding: '14px 16px', borderRadius: 12, fontWeight: 700 },
};
