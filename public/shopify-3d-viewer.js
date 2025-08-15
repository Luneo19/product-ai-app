/**
 * 🎯 Product AI 3D Viewer - Shopify Integration
 * Composant moderne pour afficher les modèles 3D générés par IA
 * Version: 2.0.0
 * Compatible: Shopify 2.0+, AR Quick Look, WebXR
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    DEBUG: false,
    AR_ENABLED: true,
    AUTO_ROTATE: true,
    SHADOW_INTENSITY: 0.5,
    CAMERA_FOV: 45,
    RENDER_QUALITY: 'high'
  };

  // État global
  let viewerState = {
    isInitialized: false,
    currentModel: null,
    arSupported: false,
    webXRSupported: false
  };

  // Utilitaires
  const Utils = {
    log: function(message, data = null) {
      if (CONFIG.DEBUG) {
        console.log(`[Product AI 3D Viewer] ${message}`, data);
      }
    },

    detectARSupport: function() {
      // Détecter le support AR
      viewerState.arSupported = 'mediaDevices' in navigator && 
                               'getUserMedia' in navigator.mediaDevices &&
                               'xr' in navigator;
      
      // Détecter WebXR
      viewerState.webXRSupported = 'xr' in navigator && 
                                  navigator.xr.isSessionSupported &&
                                  navigator.xr.isSessionSupported('immersive-ar');
      
      Utils.log('AR Support detected:', {
        ar: viewerState.arSupported,
        webXR: viewerState.webXRSupported
      });
    },

    createLoadingSpinner: function() {
      const spinner = document.createElement('div');
      spinner.className = 'product-ai-3d-loading';
      spinner.innerHTML = `
        <div class="product-ai-3d-loading__spinner"></div>
        <p class="product-ai-3d-loading__text">Chargement du modèle 3D...</p>
      `;
      
      spinner.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 10;
      `;

      const spinnerElement = spinner.querySelector('.product-ai-3d-loading__spinner');
      spinnerElement.style.cssText = `
        width: 40px;
        height: 40px;
        border: 3px solid #f3f4f6;
        border-top: 3px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
      `;

      const textElement = spinner.querySelector('.product-ai-3d-loading__text');
      textElement.style.cssText = `
        margin: 0;
        color: #374151;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
      `;

      return spinner;
    },

    showError: function(message) {
      const error = document.createElement('div');
      error.className = 'product-ai-3d-error';
      error.innerHTML = `
        <div class="product-ai-3d-error__content">
          <span class="product-ai-3d-error__icon">⚠️</span>
          <span class="product-ai-3d-error__message">${message}</span>
        </div>
      `;
      
      error.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fef2f2;
        color: #dc2626;
        padding: 16px 20px;
        border-radius: 8px;
        border: 1px solid #fecaca;
        text-align: center;
        z-index: 10;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        max-width: 300px;
      `;

      return error;
    }
  };

  /**
   * Classe principale du viewer 3D
   */
  class ProductAI3DViewer {
    constructor(container, options = {}) {
      this.container = container;
      this.options = { ...CONFIG, ...options };
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.controls = null;
      this.model = null;
      this.animationId = null;
      
      this.init();
    }

    async init() {
      try {
        Utils.log('Initializing 3D viewer...');
        
        // Détecter le support AR
        Utils.detectARSupport();
        
        // Créer la scène Three.js
        this.createScene();
        
        // Ajouter les contrôles
        this.createControls();
        
        // Ajouter l'éclairage
        this.addLighting();
        
        // Démarrer le rendu
        this.animate();
        
        viewerState.isInitialized = true;
        Utils.log('3D viewer initialized successfully');
        
      } catch (error) {
        Utils.log('Failed to initialize 3D viewer:', error);
        this.showError('Erreur d\'initialisation du viewer 3D');
      }
    }

    createScene() {
      // Créer la scène
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xf8fafc);

      // Créer la caméra
      const aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera = new THREE.PerspectiveCamera(
        this.options.CAMERA_FOV,
        aspect,
        0.1,
        1000
      );
      this.camera.position.set(2, 2, 2);

      // Créer le renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      
      this.renderer.setSize(
        this.container.clientWidth,
        this.container.clientHeight
      );
      
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      
      this.container.appendChild(this.renderer.domElement);
    }

    createControls() {
      // Contrôles orbitaux pour la navigation
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.autoRotate = this.options.AUTO_ROTATE;
      this.controls.autoRotateSpeed = 2.0;
      this.controls.enableZoom = true;
      this.controls.enablePan = false;
      this.controls.maxPolarAngle = Math.PI;
      this.controls.minDistance = 1;
      this.controls.maxDistance = 10;
    }

    addLighting() {
      // Lumière ambiante
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      this.scene.add(ambientLight);

      // Lumière directionnelle principale
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      this.scene.add(directionalLight);

      // Lumière de remplissage
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
      fillLight.position.set(-5, 0, 5);
      this.scene.add(fillLight);
    }

    async loadModel(modelUrl, options = {}) {
      try {
        Utils.log('Loading 3D model:', modelUrl);
        
        // Afficher le spinner de chargement
        const spinner = Utils.createLoadingSpinner();
        this.container.appendChild(spinner);

        // Charger le modèle GLB
        const loader = new THREE.GLTFLoader();
        
        const gltf = await new Promise((resolve, reject) => {
          loader.load(
            modelUrl,
            resolve,
            undefined,
            reject
          );
        });

        // Nettoyer l'ancien modèle
        if (this.model) {
          this.scene.remove(this.model);
        }

        // Ajouter le nouveau modèle
        this.model = gltf.scene;
        this.model.scale.setScalar(1);
        this.model.position.set(0, 0, 0);
        
        // Configurer les ombres
        this.model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Améliorer la qualité des matériaux
            if (child.material) {
              child.material.needsUpdate = true;
            }
          }
        });

        this.scene.add(this.model);

        // Centrer la caméra sur le modèle
        this.centerCameraOnModel();

        // Supprimer le spinner
        if (spinner.parentNode) {
          spinner.parentNode.removeChild(spinner);
        }

        viewerState.currentModel = modelUrl;
        Utils.log('3D model loaded successfully');

        // Émettre un événement
        this.emit('modelLoaded', { modelUrl, gltf });

      } catch (error) {
        Utils.log('Failed to load 3D model:', error);
        this.showError('Erreur de chargement du modèle 3D');
      }
    }

    centerCameraOnModel() {
      if (!this.model) return;

      const box = new THREE.Box3().setFromObject(this.model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = this.camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      
      cameraZ *= 1.5; // Marge
      
      this.camera.position.set(center.x, center.y, center.z + cameraZ);
      this.camera.lookAt(center);
      
      this.controls.target.copy(center);
      this.controls.update();
    }

    animate() {
      this.animationId = requestAnimationFrame(() => this.animate());
      
      if (this.controls) {
        this.controls.update();
      }
      
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    }

    resize() {
      if (!this.camera || !this.renderer) return;

      const width = this.container.clientWidth;
      const height = this.container.clientHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
    }

    showError(message) {
      const error = Utils.showError(message);
      this.container.appendChild(error);
    }

    dispose() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }

      if (this.controls) {
        this.controls.dispose();
      }

      if (this.renderer) {
        this.renderer.dispose();
      }

      if (this.model) {
        this.scene.remove(this.model);
      }

      // Nettoyer la scène
      this.scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
    }

    // API publique
    getModel() {
      return this.model;
    }

    getCamera() {
      return this.camera;
    }

    getScene() {
      return this.scene;
    }

    // Événements
    emit(event, data) {
      const customEvent = new CustomEvent(`product-ai-3d-${event}`, {
        detail: data,
        bubbles: true
      });
      this.container.dispatchEvent(customEvent);
    }
  }

  /**
   * Gestionnaire principal
   */
  const ProductAI3DManager = {
    viewers: new Map(),

    init: function() {
      Utils.log('Product AI 3D Manager initializing...');
      
      // Détecter les conteneurs 3D
      this.detectContainers();
      
      // Écouter les changements de taille
      window.addEventListener('resize', this.handleResize.bind(this));
      
      Utils.log('Product AI 3D Manager ready');
    },

    detectContainers: function() {
      const containers = document.querySelectorAll('[data-product-ai-3d]');
      
      containers.forEach((container, index) => {
        const modelUrl = container.getAttribute('data-product-ai-3d');
        const options = this.parseOptions(container);
        
        if (modelUrl) {
          this.createViewer(container, modelUrl, options);
        }
      });
    },

    parseOptions: function(container) {
      const options = {};
      
      // Parser les options depuis les data-attributes
      const autoRotate = container.getAttribute('data-auto-rotate');
      if (autoRotate !== null) {
        options.autoRotate = autoRotate === 'true';
      }
      
      const arEnabled = container.getAttribute('data-ar-enabled');
      if (arEnabled !== null) {
        options.arEnabled = arEnabled === 'true';
      }
      
      return options;
    },

    createViewer: function(container, modelUrl, options) {
      try {
        const viewer = new ProductAI3DViewer(container, options);
        this.viewers.set(container, viewer);
        
        // Charger le modèle
        viewer.loadModel(modelUrl, options);
        
        Utils.log('3D viewer created for container:', container);
        
      } catch (error) {
        Utils.log('Failed to create 3D viewer:', error);
      }
    },

    handleResize: function() {
      this.viewers.forEach((viewer) => {
        viewer.resize();
      });
    },

    getViewer: function(container) {
      return this.viewers.get(container);
    },

    dispose: function() {
      this.viewers.forEach((viewer) => {
        viewer.dispose();
      });
      this.viewers.clear();
    }
  };

  // Initialisation automatique
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ProductAI3DManager.init();
    });
  } else {
    ProductAI3DManager.init();
  }

  // Exposer l'API publique
  window.ProductAI3D = {
    createViewer: (container, modelUrl, options) => {
      return ProductAI3DManager.createViewer(container, modelUrl, options);
    },
    getViewer: (container) => {
      return ProductAI3DManager.getViewer(container);
    },
    dispose: () => {
      ProductAI3DManager.dispose();
    },
    isARSupported: () => viewerState.arSupported,
    isWebXRSupported: () => viewerState.webXRSupported
  };

})();
