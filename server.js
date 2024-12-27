require('dotenv').config(); // Pour charger la clé API depuis le fichier .env
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import des modules Gemini
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialisation de l'API Gemini avec votre clé API
const genAI = new GoogleGenerativeAI(process.env.API_KEY); // Utilisation de la clé API depuis le fichier .env
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Création de l'application Express
const app = express();

// Middleware CORS pour autoriser les requêtes cross-origin
app.use(cors());

// Middleware pour parser les données JSON
app.use(bodyParser.json());

// Route pour convertir du code SwiftUI en React Native ou HTML/CSS/Bootstrap
app.post('/convert', async (req, res) => {
  const { code, target } = req.body;

  // Vérification des paramètres nécessaires
  if (!code || !target) {
    return res.status(400).send('Le code SwiftUI et la cible de conversion sont requis');
  }

  if (!['react-native', 'html-css-bootstrap'].includes(target)) {
    return res.status(400).send("La cible doit être 'react-native' ou 'html-css-bootstrap'");
  }

  try {
    // Préparation de la demande au modèle Gemini
    const prompt = `Convertissez uniquement ce code SwiftUI en pur code ${
      target === 'react' ? 'React' : 'HTML/CSS/Bootstrap'
    } sans autre texte généré par l'IA. Assurez-vous que toutes les interactions avec les services web ou API présents dans le code original soient conservées et opérationnelles :\n\n${code}`;


    const result = await model.generateContent([{ text: prompt }]);

    // Récupération de la réponse générée
    const convertedCode = result.response.text();

    if (!convertedCode) {
      return res.status(500).send('Aucune conversion générée par Gemini');
    }

    // Envoi du code converti au client
    res.json({ convertedCode });
  } catch (error) {
    console.error('Erreur lors de la conversion du code:', error);
    res.status(500).send('Erreur serveur lors de la conversion du code');
  }
});

// Serveur d'écoute sur le port 3000
app.listen(3000, () => {
  console.log('Serveur backend démarré sur http://localhost:3000');
});
