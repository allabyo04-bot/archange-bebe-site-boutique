import { useEffect } from 'react';

const SUFFIXE = ' — Archange Bébé';

// Change le titre de l'onglet (et la balise meta description si fournie) pendant
// que la page est affichée, puis remet le titre par défaut en la quittant.
export function useTitrePage(titre, description) {
  useEffect(() => {
    const titrePrecedent = document.title;
    document.title = titre ? `${titre}${SUFFIXE}` : 'Archange Bébé — Puériculture & mode enfant à Abidjan';

    let balise;
    if (description) {
      balise = document.querySelector('meta[name="description"]');
      if (balise) {
        balise.dataset.valeurPrecedente = balise.content;
        balise.content = description;
      }
    }

    return () => {
      document.title = titrePrecedent;
      if (balise && balise.dataset.valeurPrecedente) {
        balise.content = balise.dataset.valeurPrecedente;
      }
    };
  }, [titre, description]);
}
