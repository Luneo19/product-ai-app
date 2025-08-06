# Product AI - Générateur de Produits IA

Une application Next.js qui utilise l'intelligence artificielle pour générer des fiches produit détaillées à partir d'idées simples.

## ✨ Fonctionnalités

- 🤖 **Génération IA** : Créez des fiches produit complètes avec OpenAI GPT-4
- 🎨 **Interface moderne** : Design responsive avec Tailwind CSS
- ⚡ **Performance optimisée** : Built avec Next.js 15
- 🛡️ **Gestion d'erreurs** : Interface robuste avec gestion d'erreurs complète
- 📱 **Responsive** : Fonctionne parfaitement sur tous les appareils

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ 
- Une clé API OpenAI

### Installation

1. **Clonez le projet**
   ```bash
   git clone <votre-repo>
   cd product-ai-app
   ```

2. **Installez les dépendances**
   ```bash
   npm install
   ```

3. **Configurez les variables d'environnement**
   
   Créez un fichier `.env.local` à la racine du projet :
   ```env
   OPENAI_API_KEY=votre_clé_api_openai_ici
   ```
   
   > 💡 Obtenez votre clé API sur [platform.openai.com](https://platform.openai.com/api-keys)

4. **Lancez le serveur de développement**
   ```bash
   npm run dev
   ```

5. **Ouvrez votre navigateur**
   
   Rendez-vous sur [http://localhost:3000](http://localhost:3000)

## 🛠️ Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Crée une version de production
- `npm run start` - Lance la version de production
- `npm run lint` - Vérifie la qualité du code

## 📁 Structure du projet

```
src/
├── app/
│   ├── api/
│   │   └── generate-product/
│   │       └── route.ts          # API route pour OpenAI
│   ├── create/
│   │   └── page.tsx              # Page de création de produits
│   ├── globals.css               # Styles globaux
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Page d'accueil
├── public/                       # Ressources statiques
└── ...
```

## 🎯 Utilisation

1. **Page d'accueil** : Présentation de l'application avec navigation
2. **Créer un produit** : 
   - Entrez une description détaillée de votre idée
   - Cliquez sur "Générer la fiche produit"
   - Récupérez votre fiche produit complète avec :
     - Nom du produit
     - Description détaillée
     - Caractéristiques techniques
     - Prix suggéré
     - Public cible

## 🔧 Technologies utilisées

- **Framework** : Next.js 15
- **Langage** : TypeScript
- **Styles** : Tailwind CSS
- **IA** : OpenAI GPT-4
- **Déploiement** : Optimisé pour Vercel

## 🚨 Dépannage

### Erreur de clé API
Si vous voyez "Clé API OpenAI non configurée", vérifiez que :
- Le fichier `.env.local` existe à la racine
- La variable `OPENAI_API_KEY` est correctement définie
- Vous avez redémarré le serveur après la modification

### Erreurs de build
- Exécutez `npm run lint` pour vérifier les erreurs de code
- Vérifiez que toutes les dépendances sont installées avec `npm install`

## 📄 Licence

Ce projet est sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

**Développé avec ❤️ et l'aide de l'IA**
