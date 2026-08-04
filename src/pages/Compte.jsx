import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { appelApi, setSession, getClient } from '../lib/api';

export default function Compte() {
  const navigate = useNavigate();
  const clientConnecte = getClient();
  const [mode, setMode] = useState('connexion'); // 'connexion' | 'inscription'

  const [nomComplet, setNomComplet] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [enCours, setEnCours] = useState(false);

  async function soumettre(e) {
    e.preventDefault();
    setErreur('');
    setEnCours(true);
    try {
      const chemin = mode === 'connexion' ? '/compte/connexion' : '/compte/inscription';
      const corps = mode === 'connexion'
        ? { telephone, motDePasse }
        : { nomComplet, telephone, email: email || undefined, motDePasse };
      const reponse = await appelApi('POST', chemin, corps);
      setSession(reponse.token, reponse.client);
      navigate('/mes-commandes');
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnCours(false);
    }
  }

  if (clientConnecte) {
    return (
      <Layout>
        <div className="conteneur" style={{ padding: '32px 20px 60px', maxWidth: 480 }}>
          <h1 style={{ fontSize: 26, marginBottom: 10 }}>Bonjour, {clientConnecte.nomComplet.split(' ')[0]} 👋</h1>
          <p style={{ color: 'var(--brown-soft)', marginBottom: 20 }}>
            {clientConnecte.pointsFidelite > 0
              ? `Tu as ${clientConnecte.pointsFidelite} point(s) de fidélité.`
              : "Cumule tes achats pour débloquer un cadeau fidélité (10 achats d'au moins 30 000 F)."}
          </p>
          <Link to="/mes-commandes" className="bouton-principal" style={{ display: 'inline-block' }}>Voir mes commandes</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="conteneur" style={{ padding: '32px 20px 60px', maxWidth: 420 }}>
        <div style={styles.onglets}>
          <button onClick={() => setMode('connexion')} style={mode === 'connexion' ? styles.ongletActif : styles.onglet}>Se connecter</button>
          <button onClick={() => setMode('inscription')} style={mode === 'inscription' ? styles.ongletActif : styles.onglet}>Créer un compte</button>
        </div>

        <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20 }}>
          {erreur && <div style={styles.bandeauErreur}>{erreur}</div>}

          {mode === 'inscription' && (
            <label className="etiquette-champ">
              Nom complet
              <input className="champ" value={nomComplet} onChange={(e) => setNomComplet(e.target.value)} required />
            </label>
          )}
          <label className="etiquette-champ">
            Téléphone
            <input className="champ" value={telephone} onChange={(e) => setTelephone(e.target.value)} required />
          </label>
          {mode === 'inscription' && (
            <label className="etiquette-champ">
              Email (optionnel)
              <input className="champ" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
          )}
          <label className="etiquette-champ">
            Mot de passe
            <input className="champ" type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required minLength={6} />
          </label>

          <button type="submit" disabled={enCours} className="bouton-principal" style={{ marginTop: 6 }}>
            {enCours ? 'Un instant…' : mode === 'connexion' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>
      </div>
    </Layout>
  );
}

const styles = {
  onglets: { display: 'flex', gap: 8, background: 'var(--cream-deep)', padding: 5, borderRadius: 999 },
  onglet: { flex: 1, padding: '10px 0', borderRadius: 999, border: 'none', background: 'transparent', fontWeight: 700, cursor: 'pointer', color: 'var(--brown-soft)' },
  ongletActif: { flex: 1, padding: '10px 0', borderRadius: 999, border: 'none', background: 'var(--white)', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(31,46,69,0.1)' },
  bandeauErreur: { padding: '10px 14px', borderRadius: 8, background: '#FBE4E1', color: 'var(--error)', fontWeight: 700, fontSize: 14 },
};
