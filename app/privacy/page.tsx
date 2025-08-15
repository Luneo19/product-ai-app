export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Luneo
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="/" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Accueil
                </a>
                <a href="/terms" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Conditions
                </a>
                <a href="/contact" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
          <h1 className="text-4xl font-bold text-white mb-8">Politique de Confidentialité</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p className="text-gray-300 mb-4">
                Luneo ("nous", "notre", "nos") s'engage à protéger votre vie privée. Cette politique de confidentialité 
                explique comment nous collectons, utilisons et protégeons vos informations personnelles lorsque vous 
                utilisez notre plateforme SaaS.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">2. Informations que nous collectons</h2>
              <h3 className="text-xl font-semibold text-purple-400 mb-3">2.1 Informations que vous nous fournissez</h3>
              <ul className="text-gray-300 mb-4 space-y-2">
                <li>• Nom et adresse email lors de l'inscription</li>
                <li>• Informations de facturation et de paiement</li>
                <li>• Contenu que vous créez sur notre plateforme</li>
                <li>• Communications avec notre équipe support</li>
              </ul>

              <h3 className="text-xl font-semibold text-purple-400 mb-3">2.2 Informations collectées automatiquement</h3>
              <ul className="text-gray-300 mb-4 space-y-2">
                <li>• Adresse IP et données de localisation</li>
                <li>• Informations sur votre navigateur et appareil</li>
                <li>• Données d'utilisation et analytics</li>
                <li>• Cookies et technologies similaires</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. Comment nous utilisons vos informations</h2>
              <p className="text-gray-300 mb-4">Nous utilisons vos informations pour :</p>
              <ul className="text-gray-300 mb-4 space-y-2">
                <li>• Fournir et améliorer nos services</li>
                <li>• Traiter les paiements et gérer la facturation</li>
                <li>• Communiquer avec vous concernant votre compte</li>
                <li>• Envoyer des mises à jour et des notifications</li>
                <li>• Assurer la sécurité et prévenir la fraude</li>
                <li>• Respecter nos obligations légales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. Partage de vos informations</h2>
              <p className="text-gray-300 mb-4">
                Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers. 
                Nous pouvons partager vos informations uniquement dans les cas suivants :
              </p>
              <ul className="text-gray-300 mb-4 space-y-2">
                <li>• Avec votre consentement explicite</li>
                <li>• Avec nos prestataires de services (Stripe, Supabase, etc.)</li>
                <li>• Pour respecter des obligations légales</li>
                <li>• Pour protéger nos droits et notre sécurité</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Sécurité des données</h2>
              <p className="text-gray-300 mb-4">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées 
                pour protéger vos informations personnelles contre l'accès non autorisé, la modification, 
                la divulgation ou la destruction.
              </p>
              <ul className="text-gray-300 mb-4 space-y-2">
                <li>• Chiffrement AES-256 pour les données sensibles</li>
                <li>• Authentification multi-facteurs</li>
                <li>• Surveillance continue de la sécurité</li>
                <li>• Sauvegardes sécurisées</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Vos droits</h2>
              <p className="text-gray-300 mb-4">Conformément au RGPD, vous avez les droits suivants :</p>
              <ul className="text-gray-300 mb-4 space-y-2">
                <li>• <strong>Droit d'accès :</strong> Demander une copie de vos données personnelles</li>
                <li>• <strong>Droit de rectification :</strong> Corriger des données inexactes</li>
                <li>• <strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
                <li>• <strong>Droit à la portabilité :</strong> Récupérer vos données dans un format structuré</li>
                <li>• <strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</li>
                <li>• <strong>Droit de limitation :</strong> Limiter le traitement de vos données</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Cookies</h2>
              <p className="text-gray-300 mb-4">
                Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience, 
                analyser l'utilisation de notre site et personnaliser le contenu. Vous pouvez contrôler 
                l'utilisation des cookies via les paramètres de votre navigateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Conservation des données</h2>
              <p className="text-gray-300 mb-4">
                Nous conservons vos informations personnelles aussi longtemps que nécessaire pour fournir 
                nos services et respecter nos obligations légales. Lorsque vous supprimez votre compte, 
                nous supprimons vos données personnelles dans un délai de 30 jours.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. Transferts internationaux</h2>
              <p className="text-gray-300 mb-4">
                Vos informations peuvent être transférées et traitées dans des pays autres que votre 
                pays de résidence. Nous nous assurons que ces transferts respectent les exigences 
                du RGPD et mettons en place des garanties appropriées.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">10. Modifications de cette politique</h2>
              <p className="text-gray-300 mb-4">
                Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. 
                Nous vous informerons de tout changement important par email ou via notre site web.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">11. Contact</h2>
              <p className="text-gray-300 mb-4">
                Si vous avez des questions concernant cette politique de confidentialité ou 
                souhaitez exercer vos droits, contactez-nous :
              </p>
              <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                <p className="text-gray-300">
                  <strong>Email :</strong> privacy@luneo.app<br/>
                  <strong>Adresse :</strong> Luneo SAS, [Adresse complète]<br/>
                  <strong>Téléphone :</strong> [Numéro de téléphone]
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>© 2024 Luneo. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
