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
            console.log('NavigationLoader: Using cached navigation HTML');
            return this.navigationHTML;
        }

        try {
            const basePath = window.CONFIG?.templates?.base || '/templates/';
            const url = `${basePath}navigation.html`;
            console.log('NavigationLoader: Loading navigation from:', url);
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load navigation: ${response.status} ${response.statusText}`);
            }
            
            this.navigationHTML = await response.text();
            this.navigationLoaded = true;
            
            console.log('NavigationLoader: Navigation loaded successfully, length:', this.navigationHTML.length);
            return this.navigationHTML;
            
        } catch (error) {
            console.error('NavigationLoader: Error loading navigation:', error);
            console.error('NavigationLoader: URL attempted:', `${window.CONFIG?.templates?.base || '/templates/'}navigation.html`);
            return null;
        }
    }

    async injectNavigation(targetElement) {
        if (!targetElement) {
            console.warn('NavigationLoader: No target element provided');
            return false;
        }

        console.log('NavigationLoader: Starting navigation injection...');
        const navigationHTML = await this.loadNavigation();
        if (!navigationHTML) {
            console.error('NavigationLoader: Failed to load navigation HTML');
            return false;
        }

        try {
            // Parse the navigation HTML
            console.log('NavigationLoader: Parsing HTML with DOMParser...');
            const parser = new DOMParser();
            const doc = parser.parseFromString(navigationHTML, 'text/html');
            console.log('NavigationLoader: DOMParser result:', doc);
            
            const navElement = doc.querySelector('nav.side-nav');
            console.log('NavigationLoader: Nav element found:', !!navElement);
            
            if (!navElement) {
                console.error('NavigationLoader: Navigation element not found in loaded HTML');
                console.error('NavigationLoader: Available elements:', doc.querySelectorAll('*').length);
                console.error('NavigationLoader: Document body:', doc.body?.innerHTML?.substring(0, 200));
                return false;
            }

            // Extract just the inner content (ul.tree-nav) and inject into existing nav
            const treeNav = navElement.querySelector('ul.tree-nav');
            console.log('NavigationLoader: Tree nav found:', !!treeNav);
            
            if (!treeNav) {
                console.error('NavigationLoader: Tree navigation not found in loaded HTML');
                console.error('NavigationLoader: Available nav children:', navElement.children.length);
                console.error('NavigationLoader: Nav innerHTML:', navElement.innerHTML.substring(0, 200));
                return false;
            }

            // Replace the target element's content with just the tree navigation
            console.log('NavigationLoader: Replacing navigation content...');
            console.log('NavigationLoader: Target element before:', targetElement.innerHTML.substring(0, 100));
            targetElement.innerHTML = treeNav.outerHTML;
            console.log('NavigationLoader: Target element after:', targetElement.innerHTML.substring(0, 100));
            
            console.log('NavigationLoader: Navigation injected successfully');
            console.log('NavigationLoader: New navigation has', targetElement.querySelectorAll('.tree-item').length, 'tree items');
            return true;
            
        } catch (error) {
            console.error('NavigationLoader: Error injecting navigation:', error);
            console.error('NavigationLoader: Error stack:', error.stack);
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
