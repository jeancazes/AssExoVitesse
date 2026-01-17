// API backend sécurisée pour Vercel
// Ce fichier protège votre clé API Anthropic côté serveur

export default async function handler(req, res) {
  // Autoriser uniquement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Vérifier que la clé API est configurée
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ 
      error: 'Clé API non configurée. Ajoutez ANTHROPIC_API_KEY dans les variables d\'environnement Vercel.' 
    });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Erreur API:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la communication avec Claude',
      details: error.message 
    });
  }
}
