/**
 * Main Entry Point
 * Loads and initializes the application
 */

// Initialize the application
let app;

// Initialize when DOM is ready
console.log('Main: Script loaded, document ready state:', document.readyState);

if (document.readyState === 'loading') {
    console.log('Main: DOM still loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Main: DOM loaded, creating App...');
        app = new App();
        window.app = app; // Make available globally for debugging
    });
} else {
    console.log('Main: DOM already ready, creating App immediately...');
    app = new App();
    window.app = app; // Make available globally for debugging
}

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (app) {
        app.destroy();
    }
});
