import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function ConfirmationCommande() {
  const { numero } = useParams();

  return (
    <Layout>
      <div className="conteneur" style={{ padding: '60px 20px', maxWidth: 520, textAlign: 'center' }}>
        <div style={{ fontSize: 50, marginBottom: 10 }}>✅</div>
        <h1 style={{ fontSize: 26, marginBottom: 10 }}>Commande enregistrée !</h1>
        <p style={{ color: 'var(--brown-soft)', marginBottom: 6 }}>
          Numéro de commande : <strong style={{ color: 'var(--brown-ink)' }}>{numero}</strong>
        </p>
        <p style={{ color: 'var(--brown-soft)', marginBottom: 30 }}>
          Nous te contactons très vite pour confirmer la préparation. Merci de ta confiance !
        </p>
        <Link to="/boutique" className="bouton-principal" style={{ display: 'inline-block' }}>Continuer mes achats</Link>
      </div>
    </Layout>
  );
}
