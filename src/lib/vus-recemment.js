const CLE_VUS = 'archange_boutique_vus_recemment';
const MAX_VUS = 10;

function lire() {
  try {
    const brut = localStorage.getItem(CLE_VUS);
    return brut ? JSON.parse(brut) : [];
  } catch {
    return [];
  }
}

export function obtenirVusRecemment() {
  return lire();
}

export function marquerCommeVu(article) {
  const vus = lire().filter((a) => a.articleId !== article.id);
  vus.unshift({ articleId: article.id, designation: article.designation, prixVente: article.prixVente, prixPromo: article.prixPromo ?? null, photoUrl: article.photoUrl || null });
  localStorage.setItem(CLE_VUS, JSON.stringify(vus.slice(0, MAX_VUS)));
}
