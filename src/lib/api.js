// IMPORTANT : à définir dans les variables d'environnement Railway (VITE_API_URL),
// avec l'URL réelle du backend Archange Bébé + "/api/boutique" à la fin.
// Exemple : https://archange-bebe-gestion-backend-production.up.railway.app/api/boutique
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/boutique';

const CLE_TOKEN = 'archange_boutique_token';
const CLE_CLIENT = 'archange_boutique_client';

export function getToken() {
  return localStorage.getItem(CLE_TOKEN);
}

export function setSession(token, client) {
  localStorage.setItem(CLE_TOKEN, token);
  localStorage.setItem(CLE_CLIENT, JSON.stringify(client));
}

export function clearSession() {
  localStorage.removeItem(CLE_TOKEN);
  localStorage.removeItem(CLE_CLIENT);
}

export function getClient() {
  const brut = localStorage.getItem(CLE_CLIENT);
  return brut ? JSON.parse(brut) : null;
}

export async function appelApi(methode, chemin, corps) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const reponse = await fetch(`${BASE_URL}${chemin}`, {
    method: methode,
    headers,
    body: corps ? JSON.stringify(corps) : undefined,
  });
  const texte = await reponse.text();
  let data;
  try { data = texte ? JSON.parse(texte) : null; } catch { data = texte; }
  if (!reponse.ok) {
    const message = (data && data.error) || 'Une erreur est survenue.';
    throw new Error(message);
  }
  return data;
}
