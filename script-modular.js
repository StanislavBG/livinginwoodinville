/**
 * Modular Script Loader
 * Loads components in the correct order without ES6 modules
 */

// Component loading order
const components = [
    'js/components/PhotoWidget.js',
    'js/components/TemplateEngine.js',
    'js/components/NavigationLoader.js',
    'js/components/NavigationComponent.js',
    'js/App.js'
];

let loadedComponents = 0;
let app;

function loadComponent(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function loadAllComponents() {
    const loadPromises = components.map(component => loadComponent(component));
    
    Promise.all(loadPromises)
        .then(() => {
            console.log('All components loaded successfully');
            initializeApp();
        })
        .catch(error => {
            console.error('Error loading components:', error);
            // Fallback to basic functionality
            initializeBasicApp();
        });
}

function initializeApp() {
    try {
        app = new App();
        window.app = app; // Make available globally for debugging
        console.log('Modular app initialized successfully');
    } catch (error) {
        console.error('Error initializing modular app:', error);
        initializeBasicApp();
    }
}

function initializeBasicApp() {
    console.log('Initializing basic app fallback');
    // Fallback to the old monolithic approach if components fail to load
    if (typeof TreeNavigation !== 'undefined') {
        window.treeNavigationInstance = new TreeNavigation();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllComponents);
} else {
    loadAllComponents();
}

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (app && typeof app.destroy === 'function') {
        app.destroy();
    }
});
