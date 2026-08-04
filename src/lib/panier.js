const CLE_PANIER = 'archange_boutique_panier';
const ECOUTEURS = new Set();

function lire() {
  try {
    const brut = localStorage.getItem(CLE_PANIER);
    return brut ? JSON.parse(brut) : [];
  } catch {
    return [];
  }
}

function ecrire(lignes) {
  localStorage.setItem(CLE_PANIER, JSON.stringify(lignes));
  ECOUTEURS.forEach((fn) => fn(lignes));
}

export function ecouterPanier(fn) {
  ECOUTEURS.add(fn);
  return () => ECOUTEURS.delete(fn);
}

export function obtenirPanier() {
  return lire();
}

export function ajouterAuPanier(article, quantite = 1) {
  const lignes = lire();
  // Le prix promo (s'il est actif et inférieur au prix normal) est celui
  // réellement facturé — le panier doit refléter ce que la commande paiera.
  const prixApplique = article.prixPromo != null && Number(article.prixPromo) < Number(article.prixVente)
    ? Number(article.prixPromo)
    : Number(article.prixVente);

  const existante = lignes.find((l) => l.articleId === article.id);
  if (existante) {
    existante.quantite += quantite;
  } else {
    lignes.push({
      articleId: article.id,
      designation: article.designation,
      prixVente: prixApplique,
      photoUrl: article.photoUrl || null,
      quantite,
    });
  }
  ecrire(lignes);
}

export function modifierQuantite(articleId, quantite) {
  let lignes = lire();
  if (quantite <= 0) {
    lignes = lignes.filter((l) => l.articleId !== articleId);
  } else {
    lignes = lignes.map((l) => (l.articleId === articleId ? { ...l, quantite } : l));
  }
  ecrire(lignes);
}

export function retirerDuPanier(articleId) {
  ecrire(lire().filter((l) => l.articleId !== articleId));
}

export function viderPanier() {
  ecrire([]);
}

export function totalPanier(lignes) {
  return lignes.reduce((s, l) => s + l.prixVente * l.quantite, 0);
}

export function nombreArticlesPanier(lignes) {
  return lignes.reduce((s, l) => s + l.quantite, 0);
}
