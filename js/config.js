// Configuration for different hosting environments
const CONFIG = (() => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    // For GitHub Pages, detect the actual base path from pathname
    let basePath = '';
    if (isGitHubPages) {
        const pathSegments = window.location.pathname.split('/');
        if (pathSegments[1] === 'livinginwoodinville') {
            basePath = '/livinginwoodinville';
        }
    }
    
    return {
        basePath: basePath,
        
        // API endpoints with proper base path detection
        templates: {
            base: isLocal ? '/templates/' : `${basePath}/templates/`
        },
        
        data: {
            base: isLocal ? '/data/' : `${basePath}/data/`
        },
        
        pages: {
            base: isLocal ? '/pages/' : `${basePath}/pages/`
        },
        
        images: {
            base: isLocal ? '/images/' : `${basePath}/images/`
        },
        
        // Debug info
        environment: isLocal ? 'local' : (isGitHubPages ? 'github-pages' : 'unknown'),
        detectedPath: window.location.pathname
    };
})();

// Export for use in other modules
window.CONFIG = CONFIG;

// Debug logging
console.log('CONFIG loaded:', CONFIG);