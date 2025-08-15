import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Luneo
                </h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Fonctionnalités
                </a>
                <a href="#pricing" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Tarifs
                </a>
                <a href="/contact" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Contact
                </a>
                <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Connexion
                </Link>
                <Link href="/login" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105">
                  Commencer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-sm">
                ✨ Plateforme SaaS de Nouvelle Génération
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Créez votre
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Empire SaaS
              </span>
              en quelques clics
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              La plateforme la plus avancée pour créer, déployer et monétiser votre SaaS. 
              Architecture cloud-native, billing automatisé, et scalabilité infinie.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/login" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-2xl shadow-purple-500/25">
                🚀 Démarrer Gratuitement
              </Link>
              <a href="#demo" className="bg-white/10 backdrop-blur-sm text-white px-12 py-4 rounded-full text-lg font-semibold border border-white/20 hover:bg-white/20 transition-all duration-200 transform hover:scale-105">
                📺 Voir la Démo
              </a>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">99.9%</div>
                <div className="text-gray-400">Uptime Garanti</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-gray-400">Support Premium</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">5min</div>
                <div className="text-gray-400">Configuration</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">∞</div>
                <div className="text-gray-400">Scalabilité</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Une suite complète d'outils professionnels pour transformer votre vision en réalité
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Billing */}
            <div className="group bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Billing Intelligent</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Système de facturation automatisé avec Stripe. Gestion intelligente des abonnements et paiements récurrents.
              </p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center">
                  <span className="text-purple-400 mr-3">✓</span>
                  Intégration Stripe Enterprise
                </li>
                <li className="flex items-center">
                  <span className="text-purple-400 mr-3">✓</span>
                  Webhooks intelligents
                </li>
                <li className="flex items-center">
                  <span className="text-purple-400 mr-3">✓</span>
                  Facturation multi-devises
                </li>
                <li className="flex items-center">
                  <span className="text-purple-400 mr-3">✓</span>
                  Analytics de revenus
                </li>
              </ul>
            </div>

            {/* Dashboard */}
            <div className="group bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-8 rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">👑</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Dashboard Pro</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Interface d'administration de niveau entreprise avec analytics en temps réel et monitoring avancé.
              </p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center">
                  <span className="text-blue-400 mr-3">✓</span>
                  Analytics temps réel
                </li>
                <li className="flex items-center">
                  <span className="text-blue-400 mr-3">✓</span>
                  Gestion multi-tenants
                </li>
                <li className="flex items-center">
                  <span className="text-blue-400 mr-3">✓</span>
                  Monitoring système
                </li>
                <li className="flex items-center">
                  <span className="text-blue-400 mr-3">✓</span>
                  Rapports automatisés
                </li>
              </ul>
            </div>

            {/* API */}
            <div className="group bg-gradient-to-br from-emerald-900/50 to-teal-900/50 p-8 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">API Enterprise</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                API REST moderne avec authentification JWT, rate limiting intelligent et documentation interactive.
              </p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center">
                  <span className="text-emerald-400 mr-3">✓</span>
                  Documentation interactive
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-400 mr-3">✓</span>
                  Authentification JWT
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-400 mr-3">✓</span>
                  Rate limiting intelligent
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-400 mr-3">✓</span>
                  Webhooks personnalisés
                </li>
              </ul>
            </div>

            {/* Security */}
            <div className="group bg-gradient-to-br from-red-900/50 to-orange-900/50 p-8 rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Sécurité Militaire</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Protection de niveau militaire avec chiffrement AES-256, authentification multi-facteurs et audit complet.
              </p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center">
                  <span className="text-red-400 mr-3">✓</span>
                  Chiffrement AES-256
                </li>
                <li className="flex items-center">
                  <span className="text-red-400 mr-3">✓</span>
                  Row Level Security
                </li>
                <li className="flex items-center">
                  <span className="text-red-400 mr-3">✓</span>
                  Audit logs complets
                </li>
                <li className="flex items-center">
                  <span className="text-red-400 mr-3">✓</span>
                  Conformité GDPR/SOC2
                </li>
              </ul>
            </div>

            {/* Scalability */}
            <div className="group bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-8 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Scalabilité Infinie</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Architecture cloud-native conçue pour évoluer de 10 à 10 millions d'utilisateurs sans interruption.
              </p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center">
                  <span className="text-indigo-400 mr-3">✓</span>
                  Auto-scaling intelligent
                </li>
                <li className="flex items-center">
                  <span className="text-indigo-400 mr-3">✓</span>
                  Load balancing global
                </li>
                <li className="flex items-center">
                  <span className="text-indigo-400 mr-3">✓</span>
                  CDN multi-régions
                </li>
                <li className="flex items-center">
                  <span className="text-indigo-400 mr-3">✓</span>
                  Base de données distribuée
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="group bg-gradient-to-br from-yellow-900/50 to-orange-900/50 p-8 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Support VIP</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Support technique dédié avec temps de réponse garanti et assistance personnalisée 24/7.
              </p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✓</span>
                  Support 24/7 dédié
                </li>
                                 <li className="flex items-center">
                   <span className="text-yellow-400 mr-3">✓</span>
                   Temps de réponse &lt; 30min
                 </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✓</span>
                  Formation personnalisée
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✓</span>
                  Migration assistée
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Plans adaptés à votre ambition
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choisissez le plan qui correspond à votre vision. Pas de frais cachés, juste de la valeur.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Starter</h3>
                <div className="text-5xl font-bold text-gray-300 mb-2">Gratuit</div>
                <p className="text-gray-400">Pour valider votre concept</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-3">✓</span>
                  Jusqu'à 100 clients
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-3">✓</span>
                  Billing Stripe basique
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-3">✓</span>
                  Support email
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-3">✓</span>
                  API REST
                </li>
              </ul>
              <Link href="/login" className="w-full bg-gray-700 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-600 transition-colors text-center block">
                Commencer gratuitement
              </Link>
            </div>

            {/* Pro */}
            <div className="relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-3xl p-8 border border-purple-500/50 backdrop-blur-sm transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Plus Populaire
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Pro</h3>
                <div className="text-5xl font-bold text-purple-400 mb-2">299€</div>
                <p className="text-gray-300">/mois</p>
                <p className="text-gray-400 mt-2">Pour les entreprises en croissance</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <span className="text-purple-400 mr-3">✓</span>
                  Clients illimités
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-purple-400 mr-3">✓</span>
                  Billing avancé
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-purple-400 mr-3">✓</span>
                  Dashboard admin
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-purple-400 mr-3">✓</span>
                  Support prioritaire
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-purple-400 mr-3">✓</span>
                  Analytics avancées
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-purple-400 mr-3">✓</span>
                  Webhooks personnalisés
                </li>
              </ul>
              <Link href="/login" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-center block">
                Commencer l'essai gratuit
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-3xl p-8 border border-blue-500/50 backdrop-blur-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
                <div className="text-5xl font-bold text-blue-400 mb-2">Sur mesure</div>
                <p className="text-gray-300">Pour les grandes entreprises</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <span className="text-blue-400 mr-3">✓</span>
                  Tout du plan Pro
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-blue-400 mr-3">✓</span>
                  Déploiement dédié
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-blue-400 mr-3">✓</span>
                  Support 24/7
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-blue-400 mr-3">✓</span>
                  SLA garanti
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-blue-400 mr-3">✓</span>
                  Formation sur site
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-blue-400 mr-3">✓</span>
                  Intégrations personnalisées
                </li>
              </ul>
              <Link href="/login" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-full font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 text-center block">
                Contactez-nous
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-white mb-8">
            Prêt à transformer votre business ?
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Rejoignez les leaders qui ont déjà choisi Luneo pour créer leur empire SaaS. 
            Votre succès commence ici.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/login" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-2xl shadow-purple-500/25">
              🚀 Commencer maintenant
            </Link>
            <a href="#demo" className="bg-white/10 backdrop-blur-sm text-white px-12 py-4 rounded-full text-lg font-semibold border border-white/20 hover:bg-white/20 transition-all duration-200 transform hover:scale-105">
              📺 Voir la démo
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Luneo
              </h3>
              <p className="text-gray-400 leading-relaxed">
                La plateforme SaaS de nouvelle génération pour créer, déployer et monétiser votre empire digital.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Connexion</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Statut</h4>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-green-400 animate-pulse"></div>
                <span className="text-gray-400">Tous les services opérationnels</span>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Luneo. Tous droits réservés. | 
              <a href="/privacy" className="hover:text-white transition-colors mx-2">Confidentialité</a> | 
              <a href="/terms" className="hover:text-white transition-colors mx-2">Conditions</a> | 
              Conçu avec ❤️ pour les entrepreneurs
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 