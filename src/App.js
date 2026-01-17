import React, { useState, useRef, useEffect } from 'react';

// Problèmes par niveau de difficulté
const problemsByLevel = {
  debutant: [
    { type: 'vitesse', enonce: "Luna a marché pendant 3 heures et a parcouru 12 km. À quelle vitesse s'est-elle déplacée ?", distance: 12, temps: 3, unite_distance: 'km', unite_temps: 'h', reponse: 4, unite_reponse: 'km/h' },
    { type: 'vitesse', enonce: "Tom a fait du vélo pendant 2 heures et a parcouru 20 km. Quelle était sa vitesse ?", distance: 20, temps: 2, unite_distance: 'km', unite_temps: 'h', reponse: 10, unite_reponse: 'km/h' },
    { type: 'distance', enonce: "Une tortue avance à 2 km/h. Quelle distance parcourt-elle en 4 heures ?", vitesse: 2, temps: 4, unite_vitesse: 'km/h', unite_temps: 'h', reponse: 8, unite_reponse: 'km' },
    { type: 'distance', enonce: "Un escargot se déplace à 0.01 m/s. Quelle distance parcourt-il en 100 secondes ?", vitesse: 0.01, temps: 100, unite_vitesse: 'm/s', unite_temps: 's', reponse: 1, unite_reponse: 'm' },
  ],
  apprenti: [
    { type: 'vitesse', enonce: "Gaspard a marché pendant 2h et a parcouru 16 km. À quelle vitesse est-il allé ?", distance: 16, temps: 2, unite_distance: 'km', unite_temps: 'h', reponse: 8, unite_reponse: 'km/h' },
    { type: 'distance', enonce: "Quelle distance aura parcouru le TGV (300 km/h) au bout de 2h de voyage ?", vitesse: 300, temps: 2, unite_vitesse: 'km/h', unite_temps: 'h', reponse: 600, unite_reponse: 'km' },
    { type: 'vitesse', enonce: "Un cycliste parcourt 45 km en 3 heures. Quelle est sa vitesse moyenne ?", distance: 45, temps: 3, unite_distance: 'km', unite_temps: 'h', reponse: 15, unite_reponse: 'km/h' },
    { type: 'temps', enonce: "Combien de temps met une voiture roulant à 60 km/h pour parcourir 180 km ?", vitesse: 60, distance: 180, unite_vitesse: 'km/h', unite_distance: 'km', reponse: 3, unite_reponse: 'h' },
  ],
  maitre: [
    { type: 'conversion', enonce: "Convertir 15 m/s en km/h", valeur: 15, de: 'm/s', vers: 'km/h', reponse: 54, unite_reponse: 'km/h' },
    { type: 'vitesse_conversion', enonce: "Quelle est la vitesse (en km/h) d'un animal qui court 300 m en 10 s ?", distance: 300, temps: 10, unite_distance: 'm', unite_temps: 's', reponse: 108, unite_reponse: 'km/h' },
    { type: 'distance_conversion', enonce: "Quelle distance (en m) aura parcouru une voiture (80 km/h) qui roule pendant 45 minutes ?", vitesse: 80, temps: 45, unite_vitesse: 'km/h', unite_temps: 'min', reponse: 60000, unite_reponse: 'm' },
    { type: 'temps', enonce: "À quelle heure arrivera un bus parti à 7h00 s'il roule à 80 km/h pour parcourir 40 km ?", vitesse: 80, distance: 40, depart: '7h00', reponse: '7h30', unite_reponse: '' },
  ],
  expert: [
    { type: 'annee_lumiere', enonce: "Combien mesure une année-lumière ? (La lumière voyage à 300 000 000 m/s)", vitesse: 300000000, temps_description: 'un an', reponse: 9467000000000000, unite_reponse: 'm' },
    { type: 'complexe', enonce: "Un avion vole à 900 km/h. Combien de temps lui faut-il pour faire le tour de la Terre (40 000 km) ?", vitesse: 900, distance: 40000, reponse: 44.4, unite_reponse: 'h' },
    { type: 'complexe', enonce: "La Lune est à 384 400 km de la Terre. En combien de temps la lumière (300 000 000 m/s) atteint-elle la Terre depuis la Lune ?", vitesse: 300000000, distance: 384400000, reponse: 1.28, unite_reponse: 's' },
    { type: 'conversion_complexe', enonce: "Un guépard court à 30 m/s. Est-il plus rapide qu'une voiture roulant à 100 km/h ? Justifie ta réponse.", vitesse1: 30, vitesse2: 100, comparaison: true },
  ]
};

// Composant principal
export default function VitesseApp() {
  const [niveau, setNiveau] = useState(null);
  const [probleme, setProbleme] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState({ etoiles: 0, problemesResolus: 0, sanAide: 0 });
  const [etape, setEtape] = useState('accueil');
  const [aideUtilisee, setAideUtilisee] = useState(false);
  const messagesEndRef = useRef(null);
  const [historique, setHistorique] = useState([]);
  const [problemeResolu, setProblemeResolu] = useState(false);
  const [etapesValidees, setEtapesValidees] = useState({ si: false, alors: false, donc: false });
  const [audioPlaying, setAudioPlaying] = useState(null);
  const speechSynthRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const lireTexte = (texte, index) => {
    // Arrêter toute lecture en cours
    if (speechSynthRef.current) {
      window.speechSynthesis.cancel();
    }

    // Si on clique sur le message déjà en lecture, on arrête
    if (audioPlaying === index) {
      setAudioPlaying(null);
      return;
    }

    // Créer une nouvelle synthèse vocale
    const utterance = new SpeechSynthesisUtterance(texte);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9; // Vitesse légèrement ralentie pour les enfants
    utterance.pitch = 1;
    
    utterance.onstart = () => {
      setAudioPlaying(index);
    };
    
    utterance.onend = () => {
      setAudioPlaying(null);
      speechSynthRef.current = null;
    };
    
    utterance.onerror = () => {
      setAudioPlaying(null);
      speechSynthRef.current = null;
    };

    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Nettoyer la synthèse vocale quand le composant est démonté
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const niveaux = [
    { id: 'debutant', nom: '🌱 Débutant', description: 'Je découvre les calculs de vitesse', couleur: '#4CAF50' },
    { id: 'apprenti', nom: '📚 Apprenti', description: 'Je commence à maîtriser les formules', couleur: '#2196F3' },
    { id: 'maitre', nom: '⭐ Maître', description: 'Je sais convertir les unités', couleur: '#FF9800' },
    { id: 'expert', nom: '🚀 Expert', description: 'Les problèmes complexes ne me font pas peur !', couleur: '#9C27B0' },
  ];

  const choisirProbleme = (niveauChoisi) => {
    const problemes = problemsByLevel[niveauChoisi];
    const problemeAleatoire = problemes[Math.floor(Math.random() * problemes.length)];
    setProbleme(problemeAleatoire);
    setNiveau(niveauChoisi);
    setEtape('resolution');
    setAideUtilisee(false);
    setProblemeResolu(false);
    setEtapesValidees({ si: false, alors: false, donc: false });
    setMessages([]);
    
    // Arrêter toute lecture audio
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setAudioPlaying(null);
    
    // Message d'introduction
    const messageIntro = niveauChoisi === 'debutant' 
      ? `Super ! Pour résoudre ce problème, on va utiliser la méthode "Si... Alors... Donc..." !\n\n👉 Commence par écrire "Si..." et rappelle les données importantes du problème.`
      : `N'oublie pas la méthode :\n• Si... (rappeler les données)\n• Alors comme... (choisir la formule et calculer)\n• Donc... (donner la réponse avec l'unité)\n\nÀ toi de jouer ! 💪`;
    
    setMessages([{ role: 'assistant', content: messageIntro }]);
  };

  const envoyerMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const nouveauMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, nouveauMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const systemPrompt = `Tu es un assistant d'éducation chaleureux et bienveillant qui aide des élèves de 10-12 ans à résoudre des problèmes de vitesse, distance et durée.

PROBLÈME ACTUEL: ${probleme.enonce}
RÉPONSE ATTENDUE: ${probleme.reponse} ${probleme.unite_reponse}
NIVEAU: ${niveau}
AIDE UTILISÉE: ${aideUtilisee}

MÉTHODE À SUIVRE (Si... Alors... Donc...):
1. Si... [rappeler les données utiles de l'énoncé]
2. Alors comme... [choisir la bonne formule : v=D/t, D=v×t, ou t=D/v] et [faire le calcul]
3. Donc... [donner la réponse avec une phrase complète et l'unité de mesure]

FORMULES:
- Vitesse = Distance ÷ Temps (v = D/t)
- Distance = Vitesse × Temps (D = v × t)
- Temps = Distance ÷ Vitesse (t = D/v)
- Conversion : 1 m/s = 3.6 km/h
- UNITÉS DE VITESSE AUTORISÉES : km/h et m/s uniquement

TON RÔLE:
${niveau === 'debutant' ? `
- Guide l'élève PAS À PAS à travers chaque étape de la méthode
- Si l'élève n'a pas commencé par "Si...", encourage-le gentiment à le faire
- Félicite chaque bonne étape, même partielle
- Donne des indices si l'élève bloque, mais ne donne JAMAIS la réponse directement
- Utilise des émojis pour rendre tes messages plus chaleureux 😊
` : `
- Laisse l'élève plus autonome mais reste disponible pour aider
- Corrige les erreurs avec bienveillance
- Encourage l'élève à vérifier ses unités de mesure
`}

RÈGLES IMPORTANTES:
- Parle avec chaleur, comme un grand frère/grande sœur bienveillant(e)
- Utilise un langage simple adapté à des enfants de 10-12 ans
- Ne donne JAMAIS la réponse complète directement
- Valorise les efforts, même si la réponse n'est pas parfaite

SYSTÈME DE VALIDATION PAR ÉTAPES :
Tu dois valider chaque étape séparément et utiliser des marqueurs spécifiques pour que l'élève gagne des étoiles :

1. Quand l'élève écrit correctement le "Si..." avec les bonnes données (${probleme.type === 'vitesse' ? `distance: ${probleme.distance} ${probleme.unite_distance}, temps: ${probleme.temps} ${probleme.unite_temps}` : probleme.type === 'distance' ? `vitesse: ${probleme.vitesse} ${probleme.unite_vitesse}, temps: ${probleme.temps} ${probleme.unite_temps}` : `les données du problème`}), réponds avec "⭐ ÉTAPE SI VALIDÉE !" puis encourage-le à continuer avec "Alors comme..."

2. Quand l'élève écrit correctement le "Alors comme..." avec la bonne formule et le bon calcul, réponds avec "⭐ ÉTAPE ALORS VALIDÉE !" puis encourage-le à conclure avec "Donc..."

3. Quand l'élève écrit correctement le "Donc..." avec une phrase complète contenant la réponse ${probleme.reponse} ${probleme.unite_reponse}, réponds avec "🎉 BRAVO ! EXERCICE RÉUSSI !" et félicite-le chaleureusement.

ATTENTION :
- N'utilise ces marqueurs QUE quand l'étape est CORRECTE
- Si l'élève fait une erreur, aide-le gentiment sans utiliser les marqueurs
- Ne propose JAMAIS de nouveau problème, les boutons s'afficheront automatiquement à la fin
- L'élève peut écrire plusieurs étapes d'un coup, dans ce cas valide toutes les étapes correctes`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [...messages, nouveauMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
        })
      });

      const data = await response.json();
      const assistantMessage = data.content[0].text;
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
      
      // Vérifier les étapes validées et ajouter des étoiles
      let nouvellesEtoiles = 0;
      
      if (assistantMessage.includes('ÉTAPE SI VALIDÉE') && !etapesValidees.si) {
        setEtapesValidees(prev => ({ ...prev, si: true }));
        nouvellesEtoiles += 1;
      }
      
      if (assistantMessage.includes('ÉTAPE ALORS VALIDÉE') && !etapesValidees.alors) {
        setEtapesValidees(prev => ({ ...prev, alors: true }));
        nouvellesEtoiles += 1;
      }
      
      // Vérifier si le problème est entièrement résolu
      if (assistantMessage.includes('EXERCICE RÉUSSI')) {
        setProblemeResolu(true);
        setEtapesValidees(prev => ({ ...prev, donc: true }));
        nouvellesEtoiles += aideUtilisee ? 1 : 2; // Bonus pour la fin
        setScore(prev => ({
          etoiles: prev.etoiles + nouvellesEtoiles,
          problemesResolus: prev.problemesResolus + 1,
          sanAide: aideUtilisee ? prev.sanAide : prev.sanAide + 1
        }));
        setHistorique(prev => [...prev, { niveau, reussi: true, aideUtilisee }]);
      } else if (nouvellesEtoiles > 0) {
        // Ajouter les étoiles des étapes intermédiaires
        setScore(prev => ({
          ...prev,
          etoiles: prev.etoiles + nouvellesEtoiles
        }));
      }
      
      // Marquer si l'aide a été utilisée (si l'assistant donne un indice)
      if (assistantMessage.includes('indice') || assistantMessage.includes('aide')) {
        setAideUtilisee(true);
      }

    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Oups ! J'ai eu un petit problème technique. 🔧 Peux-tu réessayer ?" 
      }]);
    }

    setIsLoading(false);
  };

  const nouveauProbleme = (niveauSuivant = null) => {
    const niveauActuel = niveauSuivant || niveau;
    choisirProbleme(niveauActuel);
  };

  const niveauSuivant = () => {
    const niveauxOrdre = ['debutant', 'apprenti', 'maitre', 'expert'];
    const indexActuel = niveauxOrdre.indexOf(niveau);
    if (indexActuel < niveauxOrdre.length - 1) {
      choisirProbleme(niveauxOrdre[indexActuel + 1]);
    }
  };

  // Écran d'accueil
  if (etape === 'accueil') {
    return (
      <div style={styles.container}>
        <div style={styles.accueil}>
          <div style={styles.logoContainer}>
            <span style={styles.logo}>🚀</span>
            <h1 style={styles.titre}>Vitesse, Distance & Durée</h1>
            <p style={styles.sousTitre}>Deviens un as des calculs de mouvement !</p>
          </div>
          
          <div style={styles.mascotte}>
            <div style={styles.bulle}>
              <p>Salut ! Je suis là pour t'aider à résoudre des problèmes de vitesse, distance et durée. 
              On va apprendre ensemble la méthode magique :</p>
              <p style={styles.methode}><strong>Si... Alors... Donc...</strong></p>
              <p>Prêt(e) à devenir un(e) champion(ne) ? 🏆</p>
            </div>
          </div>

          <button style={styles.boutonCommencer} onClick={() => setEtape('choix_niveau')}>
            Commencer l'aventure ! ✨
          </button>

          <div style={styles.formules}>
            <h3>🔍 Les formules à connaître :</h3>
            <div style={styles.formulesGrid}>
              <div style={styles.formuleCard}>
                <span style={styles.formuleIcone}>⚡</span>
                <p><strong>Vitesse</strong></p>
                <p style={styles.formuleTexte}>v = D ÷ t</p>
              </div>
              <div style={styles.formuleCard}>
                <span style={styles.formuleIcone}>📏</span>
                <p><strong>Distance</strong></p>
                <p style={styles.formuleTexte}>D = v × t</p>
              </div>
              <div style={styles.formuleCard}>
                <span style={styles.formuleIcone}>⏱️</span>
                <p><strong>Temps</strong></p>
                <p style={styles.formuleTexte}>t = D ÷ v</p>
              </div>
            </div>
          </div>

          <div style={styles.methodeSection}>
            <h3>📝 La méthode magique : Si... Alors... Donc...</h3>
            <div style={styles.methodeExplication}>
              <div style={styles.methodeEtape}>
                <span style={styles.etapeNumero}>1</span>
                <div style={styles.etapeContenu}>
                  <strong style={styles.etapeTitre}>Si...</strong>
                  <p style={styles.etapeDesc}>Je rappelle les données utiles de l'énoncé</p>
                </div>
              </div>
              <div style={styles.methodeEtape}>
                <span style={styles.etapeNumero}>2</span>
                <div style={styles.etapeContenu}>
                  <strong style={styles.etapeTitre}>Alors comme...</strong>
                  <p style={styles.etapeDesc}>Je choisis la bonne formule et je fais le calcul</p>
                </div>
              </div>
              <div style={styles.methodeEtape}>
                <span style={styles.etapeNumero}>3</span>
                <div style={styles.etapeContenu}>
                  <strong style={styles.etapeTitre}>Donc...</strong>
                  <p style={styles.etapeDesc}>Je donne la réponse avec une phrase complète et l'unité !</p>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.exempleSection}>
            <h3>✏️ Exemple corrigé</h3>
            <div style={styles.exempleCard}>
              <div style={styles.exempleEnonce}>
                <span style={styles.exempleIcon}>❓</span>
                <p><strong>Problème :</strong> Gaspard a marché pendant 2h et a parcouru 16 km. À quelle vitesse est-il allé ?</p>
              </div>
              
              <div style={styles.exempleSolution}>
                <div style={styles.solutionLigne}>
                  <span style={styles.solutionLabel}>Si</span>
                  <p>Gaspard a parcouru <span style={styles.donnee}>16 km</span> en <span style={styles.donnee}>2 heures</span>.</p>
                </div>
                
                <div style={styles.solutionLigne}>
                  <span style={styles.solutionLabel}>Alors</span>
                  <p>comme <span style={styles.formuleHighlight}>v = D ÷ t</span> = 16 ÷ 2 = <strong>8 km/h</strong></p>
                </div>
                
                <div style={styles.solutionLigne}>
                  <span style={styles.solutionLabel}>Donc</span>
                  <p><span style={styles.reponseFinale}>Gaspard s'est déplacé à 8 km/h.</span></p>
                </div>
              </div>

              <div style={styles.astuces}>
                <p>💡 <strong>N'oublie pas :</strong></p>
                <p>• Souligne les données importantes dans l'énoncé</p>
                <p>• Unités de vitesse : <strong>km/h</strong> ou <strong>m/s</strong> uniquement</p>
                <p>• Conversion : 1 m/s = 3.6 km/h</p>
                <p>• Fais une phrase complète pour la conclusion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Écran de choix du niveau
  if (etape === 'choix_niveau') {
    return (
      <div style={styles.container}>
        <div style={styles.choixNiveau}>
          <h2 style={styles.titreNiveau}>Choisis ton niveau ! 🎯</h2>
          
          <div style={styles.scoreDisplay}>
            <span>⭐ {score.etoiles} étoiles</span>
            <span>📝 {score.problemesResolus} problèmes résolus</span>
          </div>

          <div style={styles.niveauxGrid}>
            {niveaux.map((n) => (
              <button
                key={n.id}
                style={{...styles.niveauCard, borderColor: n.couleur, '--hover-color': n.couleur}}
                onClick={() => choisirProbleme(n.id)}
              >
                <span style={styles.niveauNom}>{n.nom}</span>
                <span style={styles.niveauDesc}>{n.description}</span>
              </button>
            ))}
          </div>

          <button style={styles.boutonRetour} onClick={() => setEtape('accueil')}>
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Écran de résolution
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.boutonRetourPetit} onClick={() => {
          setEtape('choix_niveau');
          if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
          }
          setAudioPlaying(null);
        }}>
          ← Changer de niveau
        </button>
        <div style={styles.scoreHeader}>
          <span style={styles.etoiles}>⭐ {score.etoiles}</span>
          <span style={styles.badge}>
            {niveaux.find(n => n.id === niveau)?.nom}
          </span>
        </div>
      </div>

      <div style={styles.chatContainer}>
        <div style={styles.enonceFixe}>
          <span style={styles.enonceLabel}>📝 Problème à résoudre :</span>
          <p style={styles.enonceTexte}>{probleme.enonce}</p>
        </div>
        
        <div style={styles.progressionEtapes}>
          <span style={styles.progressionLabel}>Ta progression :</span>
          <div style={{...styles.etapeProgress, ...(etapesValidees.si ? styles.etapeValidee : {})}}>
            {etapesValidees.si ? '✅' : '⬜'} Si...
          </div>
          <div style={{...styles.etapeProgress, ...(etapesValidees.alors ? styles.etapeValidee : {})}}>
            {etapesValidees.alors ? '✅' : '⬜'} Alors...
          </div>
          <div style={{...styles.etapeProgress, ...(etapesValidees.donc ? styles.etapeValidee : {})}}>
            {etapesValidees.donc ? '✅' : '⬜'} Donc...
          </div>
        </div>
        
        <div style={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                ...(msg.role === 'user' ? styles.messageUser : styles.messageAssistant)
              }}
            >
              {msg.role === 'assistant' && <span style={styles.avatar}>🧑‍🏫</span>}
              <div style={{
                ...styles.messageBulle,
                ...(msg.role === 'user' ? styles.bulleUser : styles.bulleAssistant),
                position: 'relative'
              }}>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => lireTexte(msg.content, index)}
                    style={{
                      ...styles.boutonAudio,
                      ...(audioPlaying === index ? styles.boutonAudioActif : {})
                    }}
                    title={audioPlaying === index ? "Arrêter la lecture" : "Écouter le message"}
                    aria-label={audioPlaying === index ? "Arrêter la lecture" : "Écouter le message"}
                  >
                    {audioPlaying === index ? '⏸' : '🔊'}
                  </button>
                )}
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} style={styles.messageLine}>{line}</p>
                ))}
              </div>
              {msg.role === 'user' && <span style={styles.avatar}>👤</span>}
            </div>
          ))}
          {isLoading && (
            <div style={styles.loading}>
              <span style={styles.loadingDot}>●</span>
              <span style={styles.loadingDot}>●</span>
              <span style={styles.loadingDot}>●</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.boutonsCopie}>
          <span style={styles.copieLabel}>📋 Reprendre :</span>
          <button 
            style={styles.boutonCopie}
            onClick={() => {
              const dernierMessageUser = [...messages].reverse().find(m => m.role === 'user');
              if (dernierMessageUser) {
                setInputValue(dernierMessageUser.content);
              }
            }}
            disabled={!messages.some(m => m.role === 'user')}
          >
            Ma dernière réponse
          </button>
          <button 
            style={styles.boutonCopie}
            onClick={() => {
              const dernierMessageAssistant = [...messages].reverse().find(m => m.role === 'assistant');
              if (dernierMessageAssistant) {
                // Extraire les suggestions (lignes commençant par Si, Alors, Donc ou contenant des formules)
                const lignes = dernierMessageAssistant.content.split('\n');
                const suggestions = lignes.filter(l => 
                  l.match(/^(Si |Alors |Donc )/i) || 
                  l.includes('v =') || l.includes('D =') || l.includes('t =') ||
                  l.includes('v=') || l.includes('D=') || l.includes('t=')
                ).join('\n');
                if (suggestions) {
                  setInputValue(suggestions);
                } else {
                  // Si pas de suggestion trouvée, chercher du texte entre guillemets
                  const guillemets = dernierMessageAssistant.content.match(/"([^"]+)"/g);
                  if (guillemets) {
                    setInputValue(guillemets.map(g => g.replace(/"/g, '')).join('\n'));
                  }
                }
              }
            }}
            disabled={messages.length < 2}
          >
            Suggestion de l'assistant
          </button>
        </div>

        <div style={styles.inputContainer}>
          <textarea
            style={styles.input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                envoyerMessage();
              }
            }}
            placeholder="Écris ta réponse ici... (Entrée pour envoyer)"
            rows={3}
          />
          <button 
            style={{...styles.boutonEnvoyer, opacity: isLoading ? 0.5 : 1}}
            onClick={envoyerMessage}
            disabled={isLoading}
          >
            Envoyer 📤
          </button>
        </div>

        <div style={styles.aideRapide}>
          <span style={styles.aideLabel}>💡 Rappels :</span>
          <button style={styles.aideBtn} onClick={() => setInputValue(prev => prev + 'Si ')}>Si...</button>
          <button style={styles.aideBtn} onClick={() => setInputValue(prev => prev + 'Alors comme ')}>Alors comme...</button>
          <button style={styles.aideBtn} onClick={() => setInputValue(prev => prev + 'Donc ')}>Donc...</button>
          <span style={styles.formuleRappel}>v=D/t • D=v×t • t=D/v • 1m/s=3.6km/h</span>
        </div>
      </div>

      {problemeResolu && (
        <div style={styles.victoire}>
          <h3>🎉 Exercice terminé !</h3>
          <p>Tu as gagné <strong>{aideUtilisee ? '4' : '5'} étoiles</strong> sur cet exercice !</p>
          <p style={styles.detailEtoiles}>
            ⭐ Si... + ⭐ Alors... + {aideUtilisee ? '⭐ Donc... + bonus' : '⭐⭐ Donc... + bonus'}
          </p>
          <div style={styles.victoireBoutons}>
            <button style={styles.boutonNouveau} onClick={() => nouveauProbleme()}>
              Même niveau 🔄
            </button>
            {niveau !== 'expert' && (
              <button style={styles.boutonNiveauSup} onClick={niveauSuivant}>
                Niveau supérieur 🚀
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    padding: '20px',
  },
  accueil: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  logoContainer: {
    marginBottom: '30px',
  },
  logo: {
    fontSize: '80px',
    display: 'block',
    animation: 'bounce 2s infinite',
  },
  titre: {
    color: 'white',
    fontSize: '2.5rem',
    marginBottom: '10px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  sousTitre: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '1.2rem',
  },
  mascotte: {
    marginBottom: '30px',
  },
  bulle: {
    background: 'white',
    borderRadius: '20px',
    padding: '25px',
    maxWidth: '500px',
    margin: '0 auto',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    position: 'relative',
  },
  methode: {
    color: '#667eea',
    fontSize: '1.3rem',
    margin: '15px 0',
  },
  boutonCommencer: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    border: 'none',
    padding: '18px 40px',
    fontSize: '1.3rem',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 8px 25px rgba(240,147,251,0.4)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    marginBottom: '40px',
  },
  formules: {
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '20px',
    padding: '25px',
    backdropFilter: 'blur(10px)',
  },
  formulesGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    marginTop: '15px',
  },
  formuleCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '20px',
    minWidth: '150px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  formuleIcone: {
    fontSize: '2rem',
  },
  formuleTexte: {
    fontFamily: 'monospace',
    fontSize: '1.2rem',
    color: '#667eea',
    fontWeight: 'bold',
  },
  methodeSection: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '20px',
    padding: '25px',
    marginTop: '25px',
    textAlign: 'left',
  },
  methodeExplication: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px',
  },
  methodeEtape: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
    padding: '15px 20px',
    borderRadius: '15px',
  },
  etapeNumero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    flexShrink: 0,
  },
  etapeContenu: {
    flex: 1,
  },
  etapeTitre: {
    color: '#667eea',
    fontSize: '1.1rem',
  },
  etapeDesc: {
    color: '#555',
    margin: '5px 0 0 0',
    fontSize: '0.95rem',
  },
  exempleSection: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '20px',
    padding: '25px',
    marginTop: '25px',
    textAlign: 'left',
  },
  exempleCard: {
    marginTop: '15px',
  },
  exempleEnonce: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    background: '#fff3e0',
    padding: '18px',
    borderRadius: '15px',
    borderLeft: '4px solid #ff9800',
  },
  exempleIcon: {
    fontSize: '1.5rem',
    flexShrink: 0,
  },
  exempleSolution: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  solutionLigne: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '12px 18px',
    background: '#f8f9fa',
    borderRadius: '12px',
  },
  solutionLabel: {
    background: '#667eea',
    color: 'white',
    padding: '6px 14px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    flexShrink: 0,
  },
  donnee: {
    background: '#e3f2fd',
    padding: '2px 8px',
    borderRadius: '5px',
    color: '#1976d2',
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  formuleHighlight: {
    background: '#f3e5f5',
    padding: '2px 8px',
    borderRadius: '5px',
    color: '#7b1fa2',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  reponseFinale: {
    background: '#e8f5e9',
    padding: '5px 12px',
    borderRadius: '8px',
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  astuces: {
    marginTop: '20px',
    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    padding: '18px',
    borderRadius: '15px',
    fontSize: '0.95rem',
  },
  choixNiveau: {
    maxWidth: '900px',
    margin: '0 auto',
    textAlign: 'center',
  },
  titreNiveau: {
    color: 'white',
    fontSize: '2rem',
    marginBottom: '20px',
  },
  scoreDisplay: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '30px',
    color: 'white',
    fontSize: '1.1rem',
  },
  niveauxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  niveauCard: {
    background: 'white',
    border: '3px solid',
    borderRadius: '20px',
    padding: '25px',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  niveauNom: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
  },
  niveauDesc: {
    fontSize: '0.9rem',
    color: '#666',
  },
  boutonRetour: {
    background: 'transparent',
    color: 'white',
    border: '2px solid white',
    padding: '12px 25px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    maxWidth: '900px',
    margin: '0 auto 15px',
  },
  boutonRetourPetit: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  scoreHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  etoiles: {
    background: 'rgba(255,255,255,0.2)',
    padding: '8px 15px',
    borderRadius: '15px',
    color: 'white',
    fontWeight: 'bold',
  },
  badge: {
    background: 'white',
    padding: '8px 15px',
    borderRadius: '15px',
    fontWeight: 'bold',
    color: '#667eea',
  },
  chatContainer: {
    maxWidth: '900px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '25px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  enonceFixe: {
    background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)',
    padding: '20px 25px',
    borderBottom: '3px solid rgba(0,0,0,0.1)',
  },
  enonceLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  enonceTexte: {
    color: 'white',
    fontSize: '1.15rem',
    fontWeight: '600',
    margin: '10px 0 0 0',
    lineHeight: '1.5',
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
  },
  progressionEtapes: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    padding: '15px 20px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eaed 100%)',
    borderBottom: '1px solid #e0e0e0',
    flexWrap: 'wrap',
  },
  progressionLabel: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: '0.9rem',
  },
  etapeProgress: {
    padding: '8px 15px',
    borderRadius: '20px',
    background: '#fff',
    border: '2px solid #e0e0e0',
    fontSize: '0.9rem',
    color: '#888',
    transition: 'all 0.3s ease',
  },
  etapeValidee: {
    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    borderColor: '#4CAF50',
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  messagesContainer: {
    height: '400px',
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  message: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  messageUser: {
    flexDirection: 'row-reverse',
  },
  messageAssistant: {
    flexDirection: 'row',
  },
  avatar: {
    fontSize: '2rem',
    flexShrink: 0,
  },
  messageBulle: {
    padding: '15px 20px',
    borderRadius: '20px',
    maxWidth: '70%',
  },
  bulleUser: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderBottomRightRadius: '5px',
  },
  bulleAssistant: {
    background: '#f0f2f5',
    color: '#333',
    borderBottomLeftRadius: '5px',
  },
  messageLine: {
    margin: '5px 0',
    lineHeight: '1.5',
  },
  loading: {
    display: 'flex',
    gap: '5px',
    padding: '20px',
    justifyContent: 'center',
  },
  loadingDot: {
    color: '#667eea',
    animation: 'pulse 1.5s infinite',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    padding: '15px 20px',
    borderTop: '1px solid #eee',
    background: '#fafafa',
  },
  boutonsCopie: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #e8f4fd 0%, #d4e9f7 100%)',
    borderTop: '1px solid #e0e0e0',
    flexWrap: 'wrap',
  },
  copieLabel: {
    fontSize: '0.85rem',
    color: '#555',
    fontWeight: '600',
  },
  boutonCopie: {
    background: 'white',
    border: '2px solid #2196F3',
    color: '#2196F3',
    padding: '8px 15px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  input: {
    flex: 1,
    padding: '15px',
    borderRadius: '15px',
    border: '2px solid #e0e0e0',
    fontSize: '1rem',
    resize: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s',
  },
  boutonEnvoyer: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '15px 25px',
    borderRadius: '15px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
  },
  aideRapide: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 20px',
    background: '#f5f5f5',
    flexWrap: 'wrap',
  },
  aideLabel: {
    fontSize: '0.9rem',
    color: '#666',
  },
  aideBtn: {
    background: '#e8e8e8',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'background 0.2s',
  },
  formuleRappel: {
    marginLeft: 'auto',
    fontSize: '0.85rem',
    color: '#667eea',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  victoire: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'white',
    padding: '25px 40px',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    textAlign: 'center',
    animation: 'slideUp 0.5s ease',
  },
  detailEtoiles: {
    fontSize: '0.9rem',
    color: '#666',
    marginTop: '5px',
  },
  victoireBoutons: {
    display: 'flex',
    gap: '15px',
    marginTop: '15px',
    justifyContent: 'center',
  },
  boutonNouveau: {
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  boutonNiveauSup: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  boutonAudio: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(102, 126, 234, 0.15)',
    color: '#667eea',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 10,
  },
  boutonAudioActif: {
    background: '#667eea',
    color: 'white',
    animation: 'pulse 1.5s infinite',
    boxShadow: '0 4px 8px rgba(102, 126, 234, 0.3)',
  },
};

// Ajouter les animations CSS globalement
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-20px); }
    60% { transform: translateY(-10px); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
  }
  
  @keyframes slideUp {
    from { transform: translate(-50%, 100px); opacity: 0; }
    to { transform: translate(-50%, 0); opacity: 1; }
  }
  
  button:hover:not(:disabled) {
    transform: scale(1.05);
  }
  
  button:disabled {
    opacity: 0.4 !important;
    cursor: not-allowed !important;
    transform: none !important;
  }
  
  textarea:focus {
    outline: none;
    border-color: #667eea !important;
  }
  
  * {
    box-sizing: border-box;
  }
`;
document.head.appendChild(styleSheet);
