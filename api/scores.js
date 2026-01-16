// API pour gérer les scores des élèves
// Les scores sont stockés en mémoire et dans /tmp (persistant tant que l'instance est active)

const fs = require('fs');
const path = require('path');

// Fichier de stockage temporaire
const SCORES_FILE = '/tmp/vitesse_scores.json';

// Charger les scores depuis le fichier
function loadScores() {
  try {
    if (fs.existsSync(SCORES_FILE)) {
      const data = fs.readFileSync(SCORES_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erreur chargement scores:', error);
  }
  return {};
}

// Sauvegarder les scores dans le fichier
function saveScores(scores) {
  try {
    fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
  } catch (error) {
    console.error('Erreur sauvegarde scores:', error);
  }
}

module.exports = async (req, res) => {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - Récupérer tous les scores (pour l'enseignant)
  if (req.method === 'GET') {
    const scores = loadScores();
    
    // Vérifier si on veut le format CSV
    if (req.query.format === 'csv') {
      const csv = generateCSV(scores);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=scores_vitesse.csv');
      return res.status(200).send(csv);
    }
    
    // Format JSON par défaut
    return res.status(200).json({
      success: true,
      count: Object.keys(scores).length,
      scores: scores,
      lastUpdate: new Date().toISOString()
    });
  }

  // POST - Enregistrer un score
  if (req.method === 'POST') {
    try {
      const { prenom, score, lastUpdate } = req.body;
      
      if (!prenom) {
        return res.status(400).json({ error: 'Prénom requis' });
      }

      const scores = loadScores();
      
      // Créer une clé unique basée sur le prénom (en minuscules pour éviter les doublons)
      const key = prenom.toLowerCase().trim();
      
      // Mettre à jour ou créer l'entrée
      scores[key] = {
        prenom: prenom.trim(),
        etoiles: score?.etoiles || 0,
        problemesResolus: score?.problemesResolus || 0,
        sanAide: score?.sanAide || 0,
        lastUpdate: lastUpdate || new Date().toISOString()
      };

      saveScores(scores);

      return res.status(200).json({ 
        success: true, 
        message: `Score de ${prenom} enregistré`,
        data: scores[key]
      });
    } catch (error) {
      console.error('Erreur POST scores:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
};

// Générer un fichier CSV des scores
function generateCSV(scores) {
  const headers = ['Prénom', 'Étoiles', 'Problèmes résolus', 'Sans aide', 'Dernière activité'];
  const rows = [headers.join(';')];
  
  // Trier par nombre d'étoiles (décroissant)
  const sortedScores = Object.values(scores).sort((a, b) => b.etoiles - a.etoiles);
  
  for (const s of sortedScores) {
    const date = s.lastUpdate ? new Date(s.lastUpdate).toLocaleString('fr-FR') : '';
    rows.push([
      s.prenom,
      s.etoiles,
      s.problemesResolus,
      s.sanAide,
      date
    ].join(';'));
  }
  
  return rows.join('\n');
}
