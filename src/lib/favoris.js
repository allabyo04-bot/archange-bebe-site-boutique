const CLE_FAVORIS = 'archange_boutique_favoris';
const ECOUTEURS = new Set();

function lire() {
  try {
    const brut = localStorage.getItem(CLE_FAVORIS);
    return brut ? JSON.parse(brut) : [];
  } catch {
    return [];
  }
}

function ecrire(articles) {
  localStorage.setItem(CLE_FAVORIS, JSON.stringify(articles));
  ECOUTEURS.forEach((fn) => fn(articles));
}

export function ecouterFavoris(fn) {
  ECOUTEURS.add(fn);
  return () => ECOUTEURS.delete(fn);
}

export function obtenirFavoris() {
  return lire();
}

export function estFavori(articleId) {
  return lire().some((a) => a.articleId === articleId);
}

export function basculerFavori(article) {
  const favoris = lire();
  const existe = favoris.some((a) => a.articleId === article.id);
  if (existe) {
    ecrire(favoris.filter((a) => a.articleId !== article.id));
  } else {
    ecrire([
      { articleId: article.id, designation: article.designation, prixVente: article.prixVente, prixPromo: article.prixPromo ?? null, photoUrl: article.photoUrl || null },
      ...favoris,
    ]);
  }
}

export function retirerFavori(articleId) {
  ecrire(lire().filter((a) => a.articleId !== articleId));
}
