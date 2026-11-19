import { Link } from 'react-router-dom';

const MESSAGES = [
  { texte: '🎉 Promotions en cours', lien: '/boutique?enPromo=true' },
  { texte: '🍼 Biberonnerie', lien: '/boutique?famille=BIBERON' },
  { texte: '🧸 Jouets & éveil', lien: '/boutique?famille=JOUET' },
  { texte: '🎁 Kits naissance', lien: '/boutique?q=KIT%20NAISSANCE' },
  { texte: '👕 Vêtements enfant', lien: '/boutique?famille=VETEMENT' },
  { texte: '🚚 Livraison à Abidjan', lien: '/boutique' },
  { texte: '📱 Paiement Wave & Orange Money', lien: '/boutique' },
  { texte: '🏬 Retrait gratuit à Angré', lien: '/qui-sommes-nous' },
];

export default function BandeauDefilant() {
  // La liste est dupliquée pour que le défilement boucle sans coupure.
  const elements = [...MESSAGES, ...MESSAGES];
  return (
    <div className="bandeau-defilant">
      <div className="bandeau-defilant-piste">
        {elements.map((m, i) => (
          <Link key={i} to={m.lien} className="bandeau-defilant-item">
            {m.texte}<span className="bandeau-defilant-point">•</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
