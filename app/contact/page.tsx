'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi (remplacer par votre logique d'API)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', company: '', subject: '', message: '' });
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
                <a href="/terms" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Conditions
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              Contactez-nous
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Notre équipe est là pour vous accompagner dans votre transformation digitale. 
              N'hésitez pas à nous contacter pour toute question ou demande.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8">Envoyez-nous un message</h2>
            
            {submitStatus === 'success' && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
                <p className="text-green-400">
                  ✅ Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-400">
                  ❌ Une erreur s'est produite. Veuillez réessayer ou nous contacter directement.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="Votre nom"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                  Entreprise
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                  placeholder="Nom de votre entreprise"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Sujet *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="sales">Demande commerciale</option>
                  <option value="support">Support technique</option>
                  <option value="partnership">Partenariat</option>
                  <option value="demo">Démonstration</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm resize-none"
                  placeholder="Décrivez votre projet ou votre demande..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Support Info */}
            <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Support Premium</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Support 24/7</h4>
                    <p className="text-gray-400 text-sm">Temps de réponse garanti &lt; 30 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-white text-xl">💬</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Chat en direct</h4>
                    <p className="text-gray-400 text-sm">Assistance instantanée via notre chat</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-white text-xl">📞</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Support téléphonique</h4>
                    <p className="text-gray-400 text-sm">Appel direct avec nos experts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Informations de contact</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-purple-400">📧</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email général</p>
                    <p className="text-white font-medium">contact@luneo.app</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-purple-400">🛡️</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Support technique</p>
                    <p className="text-white font-medium">support@luneo.app</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-purple-400">💼</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Commercial</p>
                    <p className="text-white font-medium">sales@luneo.app</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-purple-400">⚖️</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Aspects légaux</p>
                    <p className="text-white font-medium">legal@luneo.app</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Horaires d'ouverture</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Lundi - Vendredi</span>
                  <span className="text-white font-medium">9h00 - 18h00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Samedi</span>
                  <span className="text-white font-medium">10h00 - 16h00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dimanche</span>
                  <span className="text-white font-medium">Fermé</span>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <p className="text-purple-400 text-sm font-medium">
                    ⚡ Support d'urgence disponible 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>© 2024 Luneo. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
