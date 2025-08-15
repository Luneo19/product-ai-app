// Product AI Widget - Version Professionnelle
// https://product-ai-app-hdbl.vercel.app

(function () {
  'use strict';

  // Configuration par défaut
  const DEFAULT_CONFIG = {
    width: '100%',
    height: '600px',
    border: 'none',
    sandbox: 'allow-scripts allow-popups allow-forms allow-same-origin',
    allow: 'camera; microphone; geolocation'
  };

  // Classe principale du widget
  class ProductAIWidget {
    constructor(scriptTag) {
      this.scriptTag = scriptTag;
      this.config = this.parseConfig();
      this.iframe = null;
      this.messageHandler = null;
      this.resizeObserver = null;
      this.debug = this.config.debug === 'true';
      
      this.init();
    }

    // Parse la configuration depuis les attributs du script
    parseConfig() {
      const config = {};
      const attributes = ['tenant', 'sku', 'api-key', 'debug', 'width', 'height', 'theme'];
      
      attributes.forEach(attr => {
        const value = this.scriptTag.getAttribute(`data-${attr}`);
        if (value) config[attr] = value;
      });

      return config;
    }

    // Initialise le widget
    init() {
      try {
        this.log('Initializing Product AI Widget...', this.config);
        
        // Vérification des paramètres requis
        if (!this.config.tenant || !this.config.sku) {
          this.error('Missing required parameters: tenant and sku are required');
          return;
        }

        // Création de l'iframe
        this.createIframe();
        
        // Configuration de la communication
        this.setupMessageHandling();
        
        // Configuration du redimensionnement
        this.setupResizeHandling();
        
        // Émission de l'événement ready
        this.emitEvent('widget:ready', { config: this.config });
        
        this.log('Widget initialized successfully');
      } catch (error) {
        this.error('Failed to initialize widget:', error);
      }
    }

    // Crée l'iframe
    createIframe() {
      this.iframe = document.createElement('iframe');
      
      // URL de base avec paramètres
      const baseUrl = 'https://product-ai-app-hdbl.vercel.app/embed';
      const params = new URLSearchParams({
        tenant: this.config.tenant,
        sku: this.config.sku,
        apiKey: this.config['api-key'] || '',
        debug: this.config.debug || 'false',
        theme: this.config.theme || 'light',
        origin: window.location.origin
      });
      
      this.iframe.src = `${baseUrl}/${this.config.tenant}/${this.config.sku}?${params.toString()}`;
      
      // Styles
      this.iframe.style.width = this.config.width || DEFAULT_CONFIG.width;
      this.iframe.style.height = this.config.height || DEFAULT_CONFIG.height;
      this.iframe.style.border = DEFAULT_CONFIG.border;
      this.iframe.style.borderRadius = '8px';
      this.iframe.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      
      // Attributs de sécurité
      this.iframe.setAttribute('sandbox', DEFAULT_CONFIG.sandbox);
      this.iframe.setAttribute('allow', DEFAULT_CONFIG.allow);
      this.iframe.setAttribute('loading', 'lazy');
      
      // Insertion dans le DOM
      this.scriptTag.parentNode.insertBefore(this.iframe, this.scriptTag.nextSibling);
      
      // Événements de l'iframe
      this.iframe.addEventListener('load', () => {
        this.log('Iframe loaded successfully');
        this.emitEvent('widget:loaded', { iframe: this.iframe });
      });
      
      this.iframe.addEventListener('error', (error) => {
        this.error('Iframe failed to load:', error);
        this.emitEvent('widget:error', { error: 'iframe_load_failed' });
      });
    }

    // Configure la communication postMessage
    setupMessageHandling() {
      this.messageHandler = (event) => {
        // Vérification de l'origine pour la sécurité
        if (event.origin !== 'https://product-ai-app-hdbl.vercel.app') {
          this.warn('Message from unauthorized origin:', event.origin);
          return;
        }

        try {
          const { type, data, id } = event.data;
          
          this.log('Received message:', { type, data, id });
          
          // Gestion des différents types de messages
          switch (type) {
            case 'widget:resize':
              this.handleResize(data);
              break;
            case 'widget:action':
              this.emitEvent('widget:action', data);
              break;
            case 'widget:product_created':
              this.emitEvent('widget:product_created', data);
              break;
            case 'widget:error':
              this.emitEvent('widget:error', data);
              break;
            case 'widget:ready':
              this.emitEvent('widget:ready', data);
              break;
            default:
              this.warn('Unknown message type:', type);
          }
        } catch (error) {
          this.error('Error handling message:', error);
        }
      };

      window.addEventListener('message', this.messageHandler);
    }

    // Gère le redimensionnement
    handleResize(data) {
      const { width, height, animate = true } = data;
      
      if (width) this.iframe.style.width = width;
      if (height) this.iframe.style.height = height;
      
      if (animate) {
        this.iframe.style.transition = 'all 0.3s ease-in-out';
      }
      
      this.emitEvent('widget:resized', { width, height });
      this.log('Widget resized:', { width, height });
    }

    // Configure l'observation du redimensionnement
    setupResizeHandling() {
      if (window.ResizeObserver) {
        this.resizeObserver = new ResizeObserver((entries) => {
          entries.forEach(entry => {
            const { width, height } = entry.contentRect;
            this.emitEvent('widget:container_resized', { width, height });
          });
        });
        
        this.resizeObserver.observe(this.iframe);
      }
    }

    // API publique pour redimensionner le widget
    resize(width, height, animate = true) {
      this.handleResize({ width, height, animate });
    }

    // API pour envoyer des messages à l'iframe
    sendMessage(type, data) {
      if (this.iframe && this.iframe.contentWindow) {
        const message = {
          type,
          data,
          timestamp: Date.now(),
          origin: window.location.origin
        };
        
        this.iframe.contentWindow.postMessage(message, 'https://product-ai-app-hdbl.vercel.app');
        this.log('Sent message to iframe:', message);
      }
    }

    // Émet des événements personnalisés
    emitEvent(eventName, data) {
      const event = new CustomEvent(eventName, {
        detail: {
          ...data,
          timestamp: Date.now(),
          widgetId: this.config.tenant + '-' + this.config.sku
        },
        bubbles: true
      });
      
      document.dispatchEvent(event);
      this.log('Emitted event:', eventName, data);
    }

    // Méthodes de logging
    log(...args) {
      if (this.debug) {
        console.log('[ProductAI Widget]', ...args);
      }
    }

    warn(...args) {
      if (this.debug) {
        console.warn('[ProductAI Widget]', ...args);
      }
    }

    error(...args) {
      console.error('[ProductAI Widget]', ...args);
    }

    // Nettoyage
    destroy() {
      if (this.messageHandler) {
        window.removeEventListener('message', this.messageHandler);
      }
      
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
      
      if (this.iframe && this.iframe.parentNode) {
        this.iframe.parentNode.removeChild(this.iframe);
      }
      
      this.emitEvent('widget:destroyed', {});
      this.log('Widget destroyed');
    }
  }

  // Initialisation automatique
  const scriptTag = document.currentScript;
  if (scriptTag) {
    const widget = new ProductAIWidget(scriptTag);
    
    // Expose l'API globale
    window.ProductAIWidget = window.ProductAIWidget || {};
    window.ProductAIWidget.instances = window.ProductAIWidget.instances || {};
    
    const widgetId = `${scriptTag.getAttribute('data-tenant')}-${scriptTag.getAttribute('data-sku')}`;
    window.ProductAIWidget.instances[widgetId] = widget;
    
    // API globale pour accéder au widget
    window.ProductAIWidget.get = (id) => {
      return window.ProductAIWidget.instances[id];
    };
    
    window.ProductAIWidget.resize = (id, width, height, animate) => {
      const instance = window.ProductAIWidget.instances[id];
      if (instance) {
        instance.resize(width, height, animate);
      }
    };
    
    window.ProductAIWidget.sendMessage = (id, type, data) => {
      const instance = window.ProductAIWidget.instances[id];
      if (instance) {
        instance.sendMessage(type, data);
      }
    };
    
    window.ProductAIWidget.destroy = (id) => {
      const instance = window.ProductAIWidget.instances[id];
      if (instance) {
        instance.destroy();
        delete window.ProductAIWidget.instances[id];
      }
    };
  }
})(); 