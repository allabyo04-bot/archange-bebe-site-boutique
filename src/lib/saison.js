// Thème de la page d'accueil choisi automatiquement selon la date du jour.
// Aucune intervention nécessaire : le site change tout seul de décor selon la période.

const THEMES = {
  noel: {
    cle: 'noel',
    badge: '🎄 Noël approche',
    titre: 'Un Noël magique pour vos Boudchou',
    texte: "Jouets, layette, puériculture et idées cadeaux : préparez les fêtes en douceur. En boutique à Angré ou livré chez vous.",
    bouton2: { libelle: '🎁 Idées cadeaux', lien: '/boutique?famille=JOUET' },
    decor: ['❄️', '⭐', '🎁', '❄️', '✨', '🎄', '❄️', '⭐'],
    imageCote: '/hero/noel-vitrine.jpg',
  },
  meres: {
    cle: 'meres',
    badge: '💐 Fête des mères',
    titre: 'Gâtez les mamans et futures mamans',
    texte: "Notre sélection « Pour maman » et tout le nécessaire pour accueillir bébé avec sérénité.",
    bouton2: { libelle: '💐 Pour maman', lien: '/boutique?famille=POUR%20MAMAN' },
    decor: ['💗', '🌸', '✨', '💐', '💗', '⭐', '🌸', '💗'],
  },
  rentree: {
    cle: 'rentree',
    badge: '🎒 Rentrée scolaire',
    titre: 'Une rentrée réussie pour les petits',
    texte: "Sacs, fournitures, chaussures et vêtements : tout pour bien démarrer l'année.",
    bouton2: { libelle: '🎒 Spécial rentrée', lien: '/boutique?famille=ART%20SCOLAIRE' },
    decor: ['✏️', '⭐', '🎒', '📚', '✨', '⭐', '✏️', '🎒'],
  },
  normal: {
    cle: 'normal',
    badge: '👶 Puériculture & mode enfant · Abidjan',
    titre: 'Tout pour le bonheur de vos Boudchou',
    texte: "De la grossesse aux 15 ans de l'enfant : puériculture, layette, jouets et accessoires, en boutique à Angré ou livrés chez vous.",
    bouton2: { libelle: '🎁 Nos kits naissance', lien: '/boutique?q=KIT%20NAISSANCE' },
    decor: ['💙', '⭐', '💗', '✨', '💙', '⭐', '💗', '✨'],
  },
};

export function themeDuJour(date = new Date()) {
  const m = date.getMonth() + 1; // 1 à 12
  const j = date.getDate();
  if ((m === 11 && j >= 15) || m === 12 || (m === 1 && j <= 6)) return THEMES.noel;
  if (m === 5) return THEMES.meres;
  if ((m === 8 && j >= 15) || m === 9) return THEMES.rentree;
  return THEMES.normal;
}
