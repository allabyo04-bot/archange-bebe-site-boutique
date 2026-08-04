import Layout from '../components/Layout';

const PAGE_FACEBOOK_URL = 'https://www.facebook.com/archangebebeciv';

export default function Actualites() {
  const urlIntegration = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(PAGE_FACEBOOK_URL)}&tabs=timeline&width=500&height=800&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;

  return (
    <Layout>
      <div className="conteneur" style={{ padding: '32px 20px 60px' }}>
        <div style={styles.enTete}>
          <div>
            <h1 style={{ fontSize: 28, marginBottom: 8 }}>Actualités & vidéos</h1>
            <p style={{ color: 'var(--brown-soft)', maxWidth: 560 }}>
              Retrouve ici les nouveautés, les vidéos, les directs et les publications d'Archange Bébé —
              directement depuis notre page Facebook.
            </p>
          </div>
          <a href={PAGE_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="bouton-bordeaux" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 18 }}>👍</span> Nous suivre sur Facebook
          </a>
        </div>

        <div style={styles.cadreIntegration}>
          <iframe
            title="Page Facebook Archange Bébé"
            src={urlIntegration}
            style={{ border: 'none', width: '100%', maxWidth: 500, height: 800 }}
            scrolling="no"
            allow="encrypted-media"
          />
        </div>

        <p style={{ color: 'var(--brown-soft)', fontSize: 13, marginTop: 16 }}>
          Le contenu ci-dessus est géré directement depuis notre page Facebook — publie une vidéo, un live ou un
          post là-bas, il apparaît automatiquement ici.
        </p>
      </div>
    </Layout>
  );
}

const styles = {
  enTete: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  cadreIntegration: {
    background: 'var(--white)', borderRadius: 'var(--rayon)', boxShadow: 'var(--ombre)',
    padding: 12, display: 'flex', justifyContent: 'center', overflow: 'hidden',
  },
};
