// Configuration for different hosting environments
const CONFIG = {
    // Base path for GitHub Pages (will be '/livinginwoodenville' in production)
    basePath: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? '' 
        : '/livinginwoodenville',
    
    // API endpoints
    templates: {
        base: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? '/templates/'
            : '/livinginwoodenville/templates/'
    },
    
    data: {
        base: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? '/data/'
            : '/livinginwoodenville/data/'
    },
    
    pages: {
        base: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? '/pages/'
            : '/livinginwoodenville/pages/'
    },
    
    images: {
        base: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? '/images/'
            : '/livinginwoodenville/images/'
    }
};

// Export for use in other modules
window.CONFIG = CONFIG;