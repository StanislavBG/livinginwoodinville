/**
 * NavigationLoader Component
 * Loads navigation from a central source and injects it into pages
 */
class NavigationLoader {
    constructor() {
        this.navigationLoaded = false;
        this.navigationHTML = null;
    }

    async loadNavigation() {
        if (this.navigationLoaded && this.navigationHTML) {
            return this.navigationHTML;
        }

        try {
            const basePath = window.CONFIG?.templates?.base || '/templates/';
            const response = await fetch(`${basePath}navigation.html`);
            if (!response.ok) {
                throw new Error(`Failed to load navigation: ${response.status}`);
            }
            
            this.navigationHTML = await response.text();
            this.navigationLoaded = true;
            
            console.log('NavigationLoader: Navigation loaded successfully');
            return this.navigationHTML;
            
        } catch (error) {
            console.error('NavigationLoader: Error loading navigation:', error);
            return null;
        }
    }

    async injectNavigation(targetElement) {
        if (!targetElement) {
            console.warn('NavigationLoader: No target element provided');
            return false;
        }

        const navigationHTML = await this.loadNavigation();
        if (!navigationHTML) {
            console.error('NavigationLoader: Failed to load navigation HTML');
            return false;
        }

        try {
            // Parse the navigation HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(navigationHTML, 'text/html');
            const navElement = doc.querySelector('nav.side-nav');
            
            if (!navElement) {
                console.error('NavigationLoader: Navigation element not found in loaded HTML');
                return false;
            }

            // Extract just the inner content (ul.tree-nav) and inject into existing nav
            const treeNav = navElement.querySelector('ul.tree-nav');
            if (!treeNav) {
                console.error('NavigationLoader: Tree navigation not found in loaded HTML');
                return false;
            }

            // Replace the target element's content with just the tree navigation
            targetElement.innerHTML = treeNav.outerHTML;
            
            console.log('NavigationLoader: Navigation injected successfully');
            return true;
            
        } catch (error) {
            console.error('NavigationLoader: Error injecting navigation:', error);
            return false;
        }
    }

    async updateAllPages() {
        // This method can be used to update navigation across all pages
        // For now, it's a placeholder for future functionality
        console.log('NavigationLoader: updateAllPages called - not implemented yet');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationLoader;
} else {
    window.NavigationLoader = NavigationLoader;
}
