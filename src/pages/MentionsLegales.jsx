import Layout from '../components/Layout';

export default function MentionsLegales() {
  return (
    <Layout>
      <div className="conteneur" style={{ padding: '32px 20px 60px', maxWidth: 780 }}>
        <h1 style={{ fontSize: 28, marginBottom: 24 }}>Mentions légales & Conditions générales de vente</h1>

        <h2 style={styles.titreSection}>Éditeur du site</h2>
        <p style={styles.paragraphe}>
          Le site www.archangebebe.com est édité par Archange Bébé, boutique de puériculture et
          mode enfant, sise à Angré Carrefour Adama Sanogho, après le 22ème, Abidjan, Côte d'Ivoire.<br />
          Contact : 0505380826 / 2722242008
        </p>

        <h2 style={styles.titreSection}>Produits et prix</h2>
        <p style={styles.paragraphe}>
          Les prix affichés sont exprimés en Francs CFA (XOF), toutes taxes comprises. Archange
          Bébé se réserve le droit de modifier ses prix à tout moment, les produits étant facturés
          sur la base du tarif en vigueur au moment de la validation de la commande. Les photos et
          descriptions des produits sont fournies à titre indicatif et n'engagent pas contractuellement
          Archange Bébé.
        </p>

        <h2 style={styles.titreSection}>Commande et paiement</h2>
        <p style={styles.paragraphe}>
          Toute commande passée sur le site vaut acceptation des présentes conditions. Le paiement
          peut être effectué en ligne (Wave, Orange Money, MTN Mobile Money, carte bancaire, via
          notre prestataire de paiement sécurisé) ou à la récupération/livraison de la commande,
          selon l'option choisie lors de la validation.
        </p>

        <h2 style={styles.titreSection}>Livraison et retrait</h2>
        <p style={styles.paragraphe}>
          Les commandes peuvent être retirées gratuitement en boutique ou livrées à Abidjan. Les
          délais indiqués sont donnés à titre indicatif et peuvent varier selon la disponibilité
          des produits et la zone de livraison.
        </p>

        <h2 style={styles.titreSection}>Droit de rétractation et retours</h2>
        <p style={styles.paragraphe}>
          Pour toute question relative à un retour, un échange ou une réclamation sur un produit
          reçu, merci de nous contacter directement au 0505380826 avec votre numéro de commande —
          nous étudierons chaque situation au cas par cas.
        </p>

        <h2 style={styles.titreSection}>Données personnelles</h2>
        <p style={styles.paragraphe}>
          Les informations collectées lors de la création d'un compte ou d'une commande (nom,
          téléphone, adresse, email) sont utilisées uniquement pour le traitement de vos commandes
          et notre relation client. Elles ne sont ni revendues ni transmises à des tiers à des fins
          commerciales.
        </p>

        <h2 style={styles.titreSection}>Contact</h2>
        <p style={styles.paragraphe}>
          Pour toute question, réclamation ou demande d'information, contactez-nous au 0505380826 /
          2722242008 ou via notre page Facebook.
        </p>
      </div>
    </Layout>
  );
}

const styles = {
  titreSection: { fontSize: 18, marginTop: 28, marginBottom: 8 },
  paragraphe: { color: 'var(--brown-soft)', fontSize: 15, lineHeight: 1.7, margin: 0 },
};
