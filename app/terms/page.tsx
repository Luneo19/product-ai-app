export default function TermsOfService() {
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
                <a href="/privacy" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Confidentialité
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
          <h1 className="text-4xl font-bold text-white mb-8">Conditions d'Utilisation</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptation des conditions</h2>
              <p className="text-gray-300 mb-4">
                En accédant et en utilisant la plateforme Luneo ("Service"), vous acceptez d'être lié par 
                ces conditions d'utilisation ("Conditions"). Si vous n'acceptez pas ces conditions, 
                veuillez ne pas utiliser notre Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">2. Description du service</h2>
              <p className="text-gray-300 mb-4">
                Luneo est une plateforme SaaS qui permet de créer, gérer et monétiser des applications SaaS. 
                Nos services incluent :
              </p>
              <ul className="text-gray-300 mb-4 space-y-2">
                <li>• Système de facturation automatisé</li>
                <li>• Gestion multi-tenants</li>
                <li>• API REST et webhooks</li>
                <li>• Dashboard d'administration</li>
                <li>• Support technique</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. Inscription et compte</h2>
              <h3 className="text-xl font-semibold text-purple-400 mb-3">3.1 Création de compte</h3>
              <p className="text-gray-300 mb-4">
                Pour utiliser nos services, vous devez créer un compte en fournissant des informations 
                exactes, complètes et à jour. Vous êtes responsable de maintenir la confidentialité 
                de vos identifiants de connexion.
              </p>

              <h3 className="text-xl font-semibold text-purple-400 mb-3">3.2 Responsabilité du compte</h3>
              <p className="text-gray-300 mb-4">
                Vous êtes entièrement responsable de toutes les activités qui se produisent sous votre compte. 
                Vous devez nous notifier immédiatement de toute utilisation non autorisée de votre compte.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. Utilisation acceptable</h2>
              <p className="text-gray-300 mb-4">Vous vous engagez à utiliser notre Service uniquement à des fins légales et autorisées :</p>
              
              <h3 className="text-xl font-semibold text-purple-400 mb-3">4.1 Utilisations autorisées</h3>
              <ul className="text-gray-300 mb-4 space-y-2">
                <li>• Créer et gérer vos propres applications SaaS</li>
                <li>• Traiter les paiements de vos clients</li>
                <li>• Utiliser nos API conformément à la documentation</li>
                <li>• Accéder au support technique</li>
              </ul>

              <h3 className="text-xl font-semibold text-purple-400 mb-3">4.2 Utilisations interdites</h3>
              <ul className="text-gray-300 mb-4 space-y-2">
                <li>• Violer les lois applicables</li>
                <li>• Porter atteinte aux droits de propriété intellectuelle</li>
                <li>• Transmettre des virus ou du code malveillant</li>
                <li>• Tenter d'accéder sans autorisation à nos systèmes</li>
                <li>• Utiliser le Service pour du spam ou du harcèlement</li>
                <li>• Violer la vie privée d'autres utilisateurs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Facturation et paiements</h2>
              <h3 className="text-xl font-semibold text-purple-400 mb-3">5.1 Tarifs</h3>
              <p className="text-gray-300 mb-4">
                Nos tarifs sont disponibles sur notre site web et peuvent être modifiés avec un préavis 
                de 30 jours. Les prix sont exprimés en euros et incluent la TVA applicable.
              </p>

              <h3 className="text-xl font-semibold text-purple-400 mb-3">5.2 Paiements</h3>
              <p className="text-gray-300 mb-4">
                Les paiements sont traités via Stripe. Vous autorisez Luneo à facturer votre méthode 
                de paiement pour tous les frais dus. Les paiements sont non remboursables sauf 
                disposition contraire dans ces conditions.
              </p>

              <h3 className="text-xl font-semibold text-purple-400 mb-3">5.3 Retards de paiement</h3>
              <p className="text-gray-300 mb-4">
                En cas de retard de paiement, nous pouvons suspendre ou résilier votre accès au Service. 
                Les frais de recouvrement sont à votre charge.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Propriété intellectuelle</h2>
              <h3 className="text-xl font-semibold text-purple-400 mb-3">6.1 Nos droits</h3>
              <p className="text-gray-300 mb-4">
                Luneo et ses contenus, fonctionnalités et fonctionnalités sont et restent la propriété 
                exclusive de Luneo et de ses concédants. Le Service est protégé par les droits d'auteur, 
                marques de commerce et autres lois de propriété intellectuelle.
              </p>

              <h3 className="text-xl font-semibold text-purple-400 mb-3">6.2 Vos droits</h3>
              <p className="text-gray-300 mb-4">
                Vous conservez tous vos droits sur le contenu que vous créez via notre Service. 
                Vous nous accordez une licence limitée pour héberger et traiter ce contenu.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Confidentialité</h2>
              <p className="text-gray-300 mb-4">
                Votre confidentialité est importante pour nous. Notre collecte et utilisation des 
                informations personnelles sont régies par notre 
                <a href="/privacy" className="text-purple-400 hover:text-purple-300 underline"> Politique de Confidentialité</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Disponibilité du service</h2>
              <p className="text-gray-300 mb-4">
                Nous nous efforçons de maintenir une disponibilité de 99.9% mais ne garantissons pas 
                que le Service sera ininterrompu ou sans erreur. Nous pouvons suspendre le Service 
                pour maintenance avec un préavis raisonnable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. Limitation de responsabilité</h2>
              <p className="text-gray-300 mb-4">
                Dans toute la mesure permise par la loi, Luneo ne sera pas responsable des dommages 
                indirects, accessoires, spéciaux, consécutifs ou punitifs, y compris la perte de profits, 
                de données ou d'utilisation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">10. Résiliation</h2>
              <h3 className="text-xl font-semibold text-purple-400 mb-3">10.1 Résiliation par vous</h3>
              <p className="text-gray-300 mb-4">
                Vous pouvez résilier votre compte à tout moment via les paramètres de votre compte 
                ou en nous contactant.
              </p>

              <h3 className="text-xl font-semibold text-purple-400 mb-3">10.2 Résiliation par nous</h3>
              <p className="text-gray-300 mb-4">
                Nous pouvons résilier ou suspendre votre accès au Service immédiatement, sans préavis, 
                pour toute raison, y compris en cas de violation de ces Conditions.
              </p>

              <h3 className="text-xl font-semibold text-purple-400 mb-3">10.3 Effets de la résiliation</h3>
              <p className="text-gray-300 mb-4">
                À la résiliation, votre droit d'utiliser le Service cessera immédiatement. 
                Nous supprimerons vos données dans un délai de 30 jours.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">11. Modifications</h2>
              <p className="text-gray-300 mb-4">
                Nous nous réservons le droit de modifier ces Conditions à tout moment. 
                Les modifications prendront effet immédiatement après leur publication. 
                Votre utilisation continue du Service constitue votre acceptation des nouvelles conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">12. Droit applicable</h2>
              <p className="text-gray-300 mb-4">
                Ces Conditions sont régies par les lois françaises. Tout litige sera soumis 
                à la compétence exclusive des tribunaux français.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">13. Contact</h2>
              <p className="text-gray-300 mb-4">
                Si vous avez des questions concernant ces Conditions d'utilisation, contactez-nous :
              </p>
              <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                <p className="text-gray-300">
                  <strong>Email :</strong> legal@luneo.app<br/>
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
