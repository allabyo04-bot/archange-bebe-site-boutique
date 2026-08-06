import { Routes, Route } from 'react-router-dom';
import Accueil from './pages/Accueil';
import Boutique from './pages/Boutique';
import Produit from './pages/Produit';
import Panier from './pages/Panier';
import Commande from './pages/Commande';
import ConfirmationCommande from './pages/ConfirmationCommande';
import Compte from './pages/Compte';
import MesCommandes from './pages/MesCommandes';
import Actualites from './pages/Actualites';
import QuiSommesNous from './pages/QuiSommesNous';
import MentionsLegales from './pages/MentionsLegales';
import MesFavoris from './pages/MesFavoris';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/boutique" element={<Boutique />} />
      <Route path="/produit/:id" element={<Produit />} />
      <Route path="/panier" element={<Panier />} />
      <Route path="/commande" element={<Commande />} />
      <Route path="/confirmation/:numero" element={<ConfirmationCommande />} />
      <Route path="/compte" element={<Compte />} />
      <Route path="/mes-commandes" element={<MesCommandes />} />
      <Route path="/mes-favoris" element={<MesFavoris />} />
      <Route path="/actualites" element={<Actualites />} />
      <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
      <Route path="/mentions-legales" element={<MentionsLegales />} />
    </Routes>
  );
}
