// Bandeau photo en haut des pages intérieures (même ambiance que la page d'accueil).
export default function BandeauPage({ photo, titre, sousTitre }) {
  return (
    <section className="bandeau-page" style={{ backgroundImage: `url(${photo})` }}>
      <div className="bandeau-page-voile" aria-hidden="true" />
      <div className="conteneur bandeau-page-contenu">
        <h1 className="bandeau-page-titre">{titre}</h1>
        {sousTitre && <p className="bandeau-page-sous-titre">{sousTitre}</p>}
      </div>
    </section>
  );
}
