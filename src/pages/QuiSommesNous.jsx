import Layout from '../components/Layout';

export default function QuiSommesNous() {
  return (
    <Layout bandeau={{ photo: '/hero/page-qui-sommes-nous.jpg', titre: 'Qui sommes-nous ?', sousTitre: 'Pour Le Bonheur Des Boudchou.' }}>
      <div className="conteneur" style={{ padding: '32px 20px 60px', maxWidth: 780 }}>

        <p style={styles.paragraphe}>
          Archange Bébé est une boutique dédiée à la puériculture et à la mode enfant, pensée pour
          accompagner les parents à chaque étape — de la naissance aux premiers pas.
        </p>

        <p style={styles.paragraphe}>
          Nous sélectionnons avec soin des produits de qualité : biberons, vêtements, accessoires de
          soin, jouets et bien plus, pour offrir à votre enfant confort et sécurité, et à vous, la
          tranquillité d'esprit.
        </p>

        <p style={styles.paragraphe}>
          Que vous préfériez venir découvrir nos produits en boutique ou commander en ligne avec
          retrait ou livraison, notre équipe est là pour vous conseiller avec attention et
          bienveillance.
        </p>

        <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 16 }}>Nos engagements</h2>
        <ul style={styles.liste}>
          <li>Des produits vérifiés et de qualité</li>
          <li>Un service client à l'écoute</li>
          <li>La proximité avec les familles</li>
        </ul>

        <h2 style={{ fontSize: 20, marginTop: 36, marginBottom: 16 }}>La boutique en images</h2>
        <div className="galerie-boutique">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <img key={n} src={`/galerie/boutique-${n}.jpg`} alt="Boutique Archange Bébé à Angré" loading="lazy" />
          ))}
        </div>
        <p style={{ ...styles.paragraphe, marginTop: 16 }}>📍 Angré Carrefour Adama Sanogho, après le 22ème · 📞 05 05 38 08 26</p>
      </div>
    </Layout>
  );
}

const styles = {
  paragraphe: { color: 'var(--brown-soft)', fontSize: 15, lineHeight: 1.7, marginBottom: 16 },
  liste: { color: 'var(--brown-soft)', fontSize: 15, lineHeight: 1.9, paddingLeft: 20 },
};
