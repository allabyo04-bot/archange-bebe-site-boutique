import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { appelApi, getClient } from '../lib/api';

const LABEL_STATUT = {
  EN_ATTENTE: 'En attente',
  CONFIRMEE: 'Confirmée',
  PRETE: 'Prête',
  LIVREE: 'Livrée',
  ANNULEE: 'Annulée',
};

export default function MesCommandes() {
  const client = getClient();
  const [commandes, setCommandes] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (!client) return;
    appelApi('GET', '/compte/mes-commandes').then(setCommandes).catch(() => {}).finally(() => setChargement(false));
  }, []);

  if (!client) return <Navigate to="/compte" replace />;

  return (
    <Layout>
      <div className="conteneur" style={{ padding: '32px 20px 60px', maxWidth: 700 }}>
        <h1 style={{ fontSize: 26, marginBottom: 24 }}>Mes commandes</h1>

        {chargement && <p style={{ color: 'var(--brown-soft)' }}>Chargement…</p>}
        {!chargement && commandes.length === 0 && <p style={{ color: 'var(--brown-soft)' }}>Aucune commande pour l'instant.</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {commandes.map((c) => (
            <div key={c.id} style={styles.carte}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <strong>{c.numero}</strong>
                <span style={styles.badge}>{LABEL_STATUT[c.statut] || c.statut}</span>
              </div>
              <p style={{ color: 'var(--brown-soft)', fontSize: 13, margin: '6px 0' }}>
                {new Date(c.createdAt).toLocaleDateString('fr-FR')} — {c.lignes.length} article(s)
              </p>
              <strong style={{ color: 'var(--gold-deep)' }}>{Number(c.totalCommande).toLocaleString('fr-FR')} F</strong>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  carte: { background: 'var(--white)', borderRadius: 12, padding: 16, boxShadow: 'var(--ombre)' },
  badge: { fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: 'var(--cream-deep)', height: 'fit-content' },
};
