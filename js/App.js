/**
 * Main Application Class
 * Orchestrates all components and manages the application lifecycle
 */
class App {
    constructor() {
        this.components = {};
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        console.log('App: Initializing...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', async () => await this.initializeComponents());
        } else {
            // DOM is already ready, initialize immediately
            this.initializeComponents().catch(error => {
                console.error('App: Error during immediate initialization:', error);
            });
        }
    }

    async initializeComponents() {
        try {
            console.log('App: Starting component initialization...');
            // Initialize Navigation Component
            console.log('App: Creating NavigationComponent...');
            this.components.navigation = new NavigationComponent();
            console.log('App: NavigationComponent created, calling init()...');
            await this.components.navigation.init();
            console.log('App: NavigationComponent initialized successfully');
            
            // Initialize other components as needed
            console.log('App: Initializing photo widgets...');
            await this.initializePhotoWidgets();
            console.log('App: Photo widgets initialized');
            
            this.isInitialized = true;
            console.log('App: All components initialized successfully');
            
        } catch (error) {
            console.error('App: Error during initialization:', error);
            console.error('App: Error stack:', error.stack);
        }
    }

    async initializePhotoWidgets() {
        // Initialize photo widgets for any existing photo containers
        // Look for the most specific container first
        let photoContainer = document.querySelector('.photo-container');
        if (!photoContainer) {
            photoContainer = document.querySelector('.photo-section');
        }
        if (!photoContainer) {
            photoContainer = document.querySelector('.photo-column');
        }
        
        if (photoContainer && !photoContainer.photoWidget) {
            console.log('App: Initializing PhotoWidget on container:', photoContainer.className);
            photoContainer.photoWidget = new PhotoWidget(photoContainer);
            // Wait for the widget to initialize
            await new Promise(resolve => {
                const checkInit = () => {
                    if (photoContainer.photoWidget.isInitialized) {
                        resolve();
                    } else {
                        setTimeout(checkInit, 100);
                    }
                };
                checkInit();
            });
        } else if (!photoContainer) {
            console.warn('App: No photo container found');
        }
    }

    getComponent(name) {
        return this.components[name];
    }

    destroy() {
        // Destroy all components
        Object.values(this.components).forEach(component => {
            if (component && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        
        this.components = {};
        this.isInitialized = false;
        console.log('App: Destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
} else {
    window.App = App;
}
