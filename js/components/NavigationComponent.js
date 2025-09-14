/**
 * NavigationComponent
 * Handles tree navigation, state management, and SPA routing
 */
class NavigationComponent {
    constructor() {
        this.isInitialized = false;
        this.navigationLoader = new NavigationLoader();
        this.templateEngine = new TemplateEngine();
        // Initialize caching systems
        this.geocodeCache = new Map();
        this.directionsCache = new Map();
        this.mapboxAccessToken = 'REDACTED';
        this.eventListenersSetup = false;
        // Don't call init() here - let App handle initialization timing
    }

    async init() {
        console.log('NavigationComponent: Starting initialization...');
        await this.loadNavigationIfNeeded();
        // Don't call setupTreeNavigation here - it's called in loadNavigationIfNeeded
        this.setupHistoryHandling();
        this.restoreTreeState();
        this.setupAddressInput();
        this.isInitialized = true;
        
        console.log('NavigationComponent: Initialized successfully');
    }

    async loadNavigationIfNeeded() {
        const existingNav = document.querySelector('nav.side-nav');
        const hasRealNavigation = existingNav && !existingNav.querySelector('.loading-nav');
        
        console.log('NavigationComponent: Checking navigation state:', {
            existingNav: !!existingNav,
            hasRealNavigation: hasRealNavigation,
            loadingNav: !!existingNav?.querySelector('.loading-nav')
        });
        
        if (!hasRealNavigation) {
            console.log('NavigationComponent: No real navigation found, loading from central source');
            const navContainer = document.querySelector('#sideNav') || document.querySelector('.side-nav');
            if (navContainer) {
                console.log('NavigationComponent: Injecting navigation into container');
                const success = await this.navigationLoader.injectNavigation(navContainer);
                if (success) {
                    console.log('NavigationComponent: Navigation injected successfully');
                    // Wait for DOM to be fully updated before setting up event listeners
                    setTimeout(() => {
                        console.log('NavigationComponent: Setting up event listeners after DOM update');
                        this.setupEventListeners();
                        this.setupTreeNavigation();
                    }, 100); // Reduced delay since we have duplicate prevention
                } else {
                    console.error('NavigationComponent: Failed to inject navigation');
                }
            } else {
                console.error('NavigationComponent: No navigation container found!');
            }
        } else {
            console.log('NavigationComponent: Real navigation found, using existing navigation');
            this.setupEventListeners();
            this.setupTreeNavigation();
        }
    }

    setupEventListeners() {
        // Mobile navigation toggle
        const mobileNavToggle = document.getElementById('mobileNavToggle');
        const sideNav = document.getElementById('sideNav');
        const mobileNavOverlay = document.getElementById('mobileNavOverlay');
        
        if (mobileNavToggle && sideNav) {
            mobileNavToggle.addEventListener('click', () => {
                this.toggleMobileNav();
            });
        }

        // Close mobile menu when clicking overlay
        if (mobileNavOverlay) {
            mobileNavOverlay.addEventListener('click', () => {
                this.closeMobileNav();
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.side-nav') && !e.target.closest('.mobile-nav-toggle')) {
                this.closeMobileNav();
            }
        });

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileNav();
            }
        });

        // Global SPA link delegation - handle all SPA links on the page
        document.addEventListener('click', (e) => {
            const spaLinks = e.target.closest('.spa-link');
            if (spaLinks) {
                e.preventDefault();
                e.stopPropagation();
                
                const href = spaLinks.getAttribute('href');
                console.log('NavigationComponent: Global SPA link clicked:', href);
                
                if (href === '/' || href === '') {
                    this.navigateToHome();
                } else {
                    this.navigateToPage(href);
                }
            }
        });
    }

    toggleMobileNav() {
        const sideNav = document.getElementById('sideNav');
        const mobileNavOverlay = document.getElementById('mobileNavOverlay');
        
        if (sideNav && mobileNavOverlay) {
            const isOpen = sideNav.classList.contains('open');
            if (isOpen) {
                this.closeMobileNav();
            } else {
                this.openMobileNav();
            }
        }
    }

    openMobileNav() {
        const sideNav = document.getElementById('sideNav');
        const mobileNavOverlay = document.getElementById('mobileNavOverlay');
        
        if (sideNav && mobileNavOverlay) {
            sideNav.classList.add('open');
            mobileNavOverlay.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    closeMobileNav() {
        const sideNav = document.getElementById('sideNav');
        const mobileNavOverlay = document.getElementById('mobileNavOverlay');
        
        if (sideNav && mobileNavOverlay) {
            sideNav.classList.remove('open');
            mobileNavOverlay.classList.remove('open');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    setupTreeNavigation() {
        // Prevent duplicate event listener setup
        if (this.eventListenersSetup) {
            console.log('NavigationComponent: Event listeners already setup, skipping');
            return;
        }

        // Use event delegation for better performance and reliability
        const navContainer = document.querySelector('nav.side-nav');
        if (!navContainer) {
            console.warn('NavigationComponent: No navigation container found!');
            return;
        }

        console.log('NavigationComponent: Setting up event delegation on nav container');
        
        // Handle all clicks within the navigation using event delegation
        navContainer.addEventListener('click', (e) => {
            console.log('NavigationComponent: Click detected on:', e.target);
            
            // Check if it's a tree node click
            const treeNode = e.target.closest('.tree-node');
            if (treeNode) {
                e.preventDefault();
                e.stopPropagation();
                
                const treeItem = treeNode.closest('.tree-item');
                const children = treeItem?.querySelector('.tree-children');
                const nodeText = treeNode.querySelector('.tree-label')?.textContent?.trim();
                
                console.log('NavigationComponent: Tree node clicked:', nodeText, 'Has children:', !!children);
                
                if (children) {
                    // This node has children - toggle expansion
                    console.log('NavigationComponent: Toggling tree node:', nodeText);
                    this.toggleTreeNode(treeNode, children);
                } else if (nodeText === 'USDA Zone 8b') {
                    // Special case for USDA Zone
                    console.log('NavigationComponent: USDA Zone clicked');
                    this.navigateToPage('/usda-zone-8b');
                }
                return;
            }
            
            // Check if it's a tree link click
            const treeLink = e.target.closest('.tree-link');
            if (treeLink) {
                e.preventDefault();
                e.stopPropagation();
                const href = treeLink.getAttribute('href');
                console.log('NavigationComponent: Tree link clicked:', href);
                
                // Handle home link specially
                if (href === '/' || href === '') {
                    this.navigateToHome();
                } else {
                    this.navigateToPage(href);
                }
                
                // Close mobile navigation after selection
                this.closeMobileNav();
                return;
            }
        });

        // Handle home link clicks
        const homeLink = document.querySelector('.home-link');
        if (homeLink) {
            homeLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('NavigationComponent: Home link clicked');
                this.navigateToHome();
            });
        }

        // Mark event listeners as setup
        this.eventListenersSetup = true;

        // Log the setup
        const treeNodes = document.querySelectorAll('.tree-node');
        const treeLinks = document.querySelectorAll('.tree-link');
        console.log('NavigationComponent: Setup complete -', treeNodes.length, 'tree nodes,', treeLinks.length, 'tree links');
    }

    toggleTreeNode(node, children) {
        const isExpanded = children.classList.contains('expanded') || children.style.display === 'block';
        
        console.log('NavigationComponent: Toggling tree node, currently expanded:', isExpanded);
        
        if (isExpanded) {
            children.classList.remove('expanded');
            children.style.display = 'none';
            const chevron = node.querySelector('.tree-toggle i');
            if (chevron) {
                chevron.style.transform = 'rotate(0deg)';
            }
        } else {
            children.classList.add('expanded');
            children.style.display = 'block';
            const chevron = node.querySelector('.tree-toggle i');
            if (chevron) {
                chevron.style.transform = 'rotate(90deg)';
            }
        }
        
        // Save state
        this.saveTreeState();
    }

    setupHistoryHandling() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const path = this.extractPathFromUrl(window.location.pathname);
            console.log('NavigationComponent: Popstate event, extracted path:', path);
            
            if (path === '/' || path === '' || path === 'home') {
                this.loadHomePage();
            } else {
                this.loadPageContent(path);
            }
        });

        // Load page content based on current path
        const currentPath = this.extractPathFromUrl(window.location.pathname);
        console.log('NavigationComponent: Initial load, extracted path:', currentPath);
        
        if (currentPath === '/' || currentPath === '' || currentPath === 'home') {
            this.loadHomePage();
        } else {
            this.loadPageContent(currentPath);
        }
    }

    extractPathFromUrl(fullPath) {
        // Extract the actual page path from the full URL path
        // Remove the base path to get the actual page path
        const basePath = window.CONFIG?.basePath || '';
        
        if (basePath && fullPath.startsWith(basePath)) {
            const extractedPath = fullPath.substring(basePath.length);
            return extractedPath === '' ? '/' : extractedPath;
        }
        
        return fullPath;
    }

    async loadHomePage() {
        console.log('NavigationComponent: Loading home page');
        try {
            const basePath = window.CONFIG?.pages?.base || '/pages/';
            const response = await fetch(`${basePath}home.html`);
            if (response.ok) {
                const html = await response.text();
                const mainContent = document.querySelector('.main-content-area');
                if (mainContent) {
                    mainContent.innerHTML = html;
                }
            } else {
                console.error('NavigationComponent: Failed to load home page:', response.status);
            }
        } catch (error) {
            console.error('NavigationComponent: Error loading home page:', error);
        }
    }

    async loadPageContent(href) {
        try {
            console.log('NavigationComponent: Loading content from:', href);
            
            // Show loading state
            const mainContent = document.querySelector('.main-content-area');
            if (mainContent) {
                mainContent.innerHTML = '<div class="loading">Loading...</div>';
            }
            
            // Clean the href to remove leading slash and extract page slug
            const cleanHref = href.startsWith('/') ? href.substring(1) : href;
            const pageSlug = cleanHref.split('/').pop().replace('.html', '');
            
            console.log('NavigationComponent: Cleaned href:', cleanHref, 'Page slug:', pageSlug);
            
            // If no page slug, this is likely the home page
            if (!pageSlug || pageSlug === '' || pageSlug === 'home') {
                console.log('NavigationComponent: No page slug, loading home page');
                await this.loadHomePage();
                return;
            }
            
            let html;
            
            // Handle home page
            if (pageSlug === 'home') {
                console.log('NavigationComponent: Loading home page');
                try {
                    const basePath = window.CONFIG?.pages?.base || '/pages/';
                    const response = await fetch(`${basePath}home.html`);
                    if (response.ok) {
                        html = await response.text();
                    }
                } catch (error) {
                    console.error('NavigationComponent: Error loading home page:', error);
                }
            }
            // Handle USDA Zone page
            else if (pageSlug === 'usda-zone-8b') {
                console.log('NavigationComponent: Loading USDA Zone page');
                try {
                    const basePath = window.CONFIG?.pages?.base || '/pages/';
                    const response = await fetch(`${basePath}usda-zone-8b.html`);
                    if (response.ok) {
                        html = await response.text();
                    }
                } catch (error) {
                    console.error('NavigationComponent: Error loading USDA page:', error);
                }
            }
            
            // If not USDA page or USDA failed, check park/plant pages
            if (!html) {
                // Check if this is a park/location page or a plant page
                const isParkPage = await this.isParkPage(pageSlug);
                
                if (isParkPage) {
                    // Use template engine to render park page
                    console.log('NavigationComponent: Rendering park page:', pageSlug);
                    html = await this.templateEngine.renderParkPage(pageSlug);
                } else {
                    // Use template engine to render plant page
                    console.log('NavigationComponent: Rendering plant page:', pageSlug);
                    html = await this.templateEngine.renderPlantPage(pageSlug);
                }
            }
            
            if (!html) {
                throw new Error('Failed to load page content');
            }
            
            // Parse the rendered HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract content - handle park, plant, and USDA page structures
            let contentElement = null;
            const isParkPage = await this.isParkPage(pageSlug);
            
            if (pageSlug === 'usda-zone-8b') {
                // USDA pages use .main-content structure
                contentElement = doc.querySelector('.main-content');
            } else if (isParkPage) {
                // Park pages use .park-page structure
                contentElement = doc.querySelector('.park-page');
            } else {
                // Plant pages use .main-content or .main-content-area structure
                contentElement = doc.querySelector('.main-content-area') || doc.querySelector('.main-content');
            }
            
            if (contentElement && mainContent) {
                console.log('NavigationComponent: Extracting content from:', contentElement.className || contentElement.tagName);
                if (pageSlug === 'usda-zone-8b' || !isParkPage) {
                    mainContent.innerHTML = contentElement.innerHTML;
                } else {
                    mainContent.innerHTML = contentElement.outerHTML;
                }
            } else {
                console.warn('NavigationComponent: No suitable content element found');
                console.warn('NavigationComponent: Looking for park-page:', !!doc.querySelector('.park-page'));
                console.warn('NavigationComponent: Looking for main-content:', !!doc.querySelector('.main-content'));
                console.warn('NavigationComponent: Looking for main-content-area:', !!doc.querySelector('.main-content-area'));
            }
            
            // Update page title
            const newTitle = doc.querySelector('.page-header h1, .tree-title-section h1, h1');
            if (newTitle) {
                document.title = `${newTitle.textContent} - Living in Woodinville`;
            }
            
            // Update active navigation
            setTimeout(() => this.updateActiveNavigation(href), 100);
            
            // Initialize photo widget if present (for plant pages)
            if (!isParkPage) {
                setTimeout(async () => {
                    console.log('NavigationComponent: Initializing PhotoWidget for plant page');
                    await this.initializePhotoWidget();
                    // Set current content for PhotoWidget
                    window.currentContent = pageSlug;
                }, 100);
            }
            
            // Setup SPA links for dynamically loaded content (like home page)
            this.setupSPALinks();
            
            // Initialize map component if present (for park pages)
            if (isParkPage) {
                setTimeout(async () => {
                    console.log('NavigationComponent: Starting map initialization after DOM timeout...');
                    await this.initializeMapComponent();
                    
                    // Validate park address after map initialization
                    console.log('NavigationComponent: Validating park address...');
                    await this.validateParkAddress();
                }, 500);
            }
            
            // Handle USDA page tree links
            if (pageSlug === 'usda-zone-8b') {
                setTimeout(() => {
                    console.log('NavigationComponent: Setting up USDA tree links');
                    this.setupUSDATreeLinks();
                }, 100);
            }
            
            console.log('NavigationComponent: Content loaded successfully');
            
        } catch (error) {
            console.error('NavigationComponent: Error loading page content:', error);
            const mainContent = document.querySelector('.main-content-area');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div class="error-message">
                        <h2>Error Loading Page</h2>
                        <p>Sorry, there was an error loading the requested page.</p>
                        <a href="/" class="btn">Return to Home</a>
                    </div>
                `;
            }
        }
    }

    async isParkPage(pageSlug) {
        // Load parks data to check if this is a park page
        try {
            console.log('NavigationComponent: Checking if page is park:', pageSlug);
            await this.templateEngine.loadData('parks');
            const parksData = this.templateEngine.data.get('parks');
            console.log('NavigationComponent: Parks data loaded:', !!parksData);
            console.log('NavigationComponent: Available parks:', parksData ? Object.keys(parksData) : 'none');
            const isPark = parksData && parksData.hasOwnProperty(pageSlug);
            console.log('NavigationComponent: Is park page result:', isPark);
            return isPark;
        } catch (error) {
            console.error('NavigationComponent: Error checking if page is park:', error);
            return false;
        }
    }

    async initializeMapComponent() {
        console.log('NavigationComponent: Looking for map container...');
        const mapContainer = document.getElementById('mapDisplay');
        console.log('NavigationComponent: Map container found:', !!mapContainer);
        
        if (mapContainer) {
            console.log('NavigationComponent: Initializing Mapbox map...');
            console.log('NavigationComponent: Map container dimensions:', {
                width: mapContainer.offsetWidth,
                height: mapContainer.offsetHeight,
                clientWidth: mapContainer.clientWidth,
                clientHeight: mapContainer.clientHeight
            });
            
            // Get current page slug to find park data
            const currentPath = window.location.pathname;
            const pageSlug = currentPath.split('/').pop().replace('.html', '');
            console.log('NavigationComponent: Page slug:', pageSlug);
            
            // Check if this is a park page and get park data
            const isParkPage = await this.isParkPage(pageSlug);
            console.log('NavigationComponent: Is park page:', isParkPage);
            
            let parkData = null;
            if (isParkPage) {
                // Make sure parks data is loaded
                await this.templateEngine.loadData('parks');
                const parksData = this.templateEngine.data.get('parks');
                console.log('NavigationComponent: Parks data:', parksData);
                
                if (parksData && parksData[pageSlug]) {
                    parkData = parksData[pageSlug];
                    console.log('NavigationComponent: Found park data:', parkData);
                    console.log('NavigationComponent: Park coordinates:', parkData.latitude, parkData.longitude);
                } else {
                    console.warn('NavigationComponent: Park data not found for slug:', pageSlug);
                }
            } else {
                console.log('NavigationComponent: Not a park page, using default location');
            }
            
            // Initialize Mapbox directly
            await this.initializeMapbox(mapContainer, parkData);
        } else {
            const availableIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
            console.warn('NavigationComponent: Map container not found! Available elements with IDs:', availableIds);
            console.warn('NavigationComponent: Looking for mapDisplay in main content...');
            
            const mainContent = document.querySelector('.main-content-area');
            console.warn('NavigationComponent: Main content found:', !!mainContent);
            console.warn('NavigationComponent: Main content HTML preview:', 
                mainContent ? mainContent.innerHTML.substring(0, 500) : 'none'
            );
            
            // Look for any elements containing "map"
            const mapElements = Array.from(document.querySelectorAll('[class*="map"], [id*="map"]'));
            console.warn('NavigationComponent: Elements containing "map":', 
                mapElements.map(el => ({ tag: el.tagName, id: el.id, class: el.className }))
            );
        }
    }

    async initializeMapbox(container, parkData) {
        try {
            console.log('NavigationComponent: Starting Mapbox initialization...');
            console.log('NavigationComponent: Container:', container);
            console.log('NavigationComponent: Park data:', parkData);
            
            // Load Mapbox CSS if not already loaded
            if (!document.querySelector('link[href*="mapbox-gl"]')) {
                console.log('NavigationComponent: Loading Mapbox CSS...');
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
                document.head.appendChild(link);
            } else {
                console.log('NavigationComponent: Mapbox CSS already loaded');
            }

            // Load Mapbox JS if not already loaded
            if (!window.mapboxgl) {
                console.log('NavigationComponent: Loading Mapbox JS...');
                const script = document.createElement('script');
                script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
                await new Promise((resolve, reject) => {
                    script.onload = () => {
                        console.log('NavigationComponent: Mapbox JS loaded successfully');
                        resolve();
                    };
                    script.onerror = (error) => {
                        console.error('NavigationComponent: Error loading Mapbox JS:', error);
                        reject(error);
                    };
                    document.head.appendChild(script);
                });
            } else {
                console.log('NavigationComponent: Mapbox JS already available');
            }

            // Set access token
            console.log('NavigationComponent: Setting Mapbox access token...');
            mapboxgl.accessToken = 'REDACTED';
            
            // Determine center coordinates
            let centerLat = 47.7544;  // Default: Woodinville
            let centerLng = -122.1556;
            let zoomLevel = 13;
            
            if (parkData && parkData.latitude && parkData.longitude) {
                centerLat = parseFloat(parkData.latitude);
                centerLng = parseFloat(parkData.longitude);
                zoomLevel = 15;
                console.log('NavigationComponent: Using park coordinates:', centerLat, centerLng);
            } else {
                console.log('NavigationComponent: Using default Woodinville coordinates');
            }

            // Clear container and create map element (let CSS handle sizing)
            console.log('NavigationComponent: Creating map element...');
            container.innerHTML = '<div id="map" style="height: 100%; width: 100%; background: #f0f0f0;"></div>';
            
            // Wait a moment for DOM update
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const mapElement = document.getElementById('map');
            console.log('NavigationComponent: Map element created:', !!mapElement);
            console.log('NavigationComponent: Map element dimensions:', {
                width: mapElement?.offsetWidth,
                height: mapElement?.offsetHeight
            });
            
            // Create map
            console.log('NavigationComponent: Creating Mapbox map...');
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/outdoors-v12',
                center: [centerLng, centerLat],
                zoom: zoomLevel
            });

            console.log('NavigationComponent: Map object created, waiting for load...');
            
            // Wait for map to load before adding markers and routes
            map.on('load', () => {
                console.log('NavigationComponent: Map loaded successfully!');
                this.initializeMapContent(map, parkData);
            });

            map.on('error', (error) => {
                console.error('NavigationComponent: Map error:', error);
            });

            this.currentMap = map;
            console.log('NavigationComponent: Mapbox map initialization completed');
            
        } catch (error) {
            console.error('NavigationComponent: Error initializing Mapbox:', error);
            console.error('NavigationComponent: Error stack:', error.stack);
        }
    }

    async geocodeAddress(address) {
        try {
            if (!address || address.trim() === '') return null;
            
            const cleanAddress = address.trim();
            const cacheKey = `geocode:${cleanAddress.toLowerCase()}`;
            
            // Check cache first
            if (this.geocodeCache.has(cacheKey)) {
                console.log('NavigationComponent: Using cached geocoding result for:', cleanAddress);
                return this.geocodeCache.get(cacheKey);
            }
            
            console.log('NavigationComponent: Geocoding with Mapbox:', cleanAddress);
            
            // Use Mapbox Geocoding API
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(cleanAddress)}.json?access_token=${this.mapboxAccessToken}&country=US&proximity=-122.1556,47.7544&limit=1`;
            
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                if (data.features && data.features.length > 0) {
                    const feature = data.features[0];
                    const coords = {
                        lat: feature.center[1],
                        lng: feature.center[0],
                        // Add address quality information
                        quality: this.assessAddressQuality(feature),
                        confidence: feature.relevance || 0,
                        placeName: feature.place_name || cleanAddress,
                        context: feature.context || []
                    };
                    
                    // Cache the result
                    this.geocodeCache.set(cacheKey, coords);
                    console.log('NavigationComponent: Mapbox geocoding successful:', coords);
                    return coords;
                }
            }
            
            // Fallback for Woodinville addresses
            if (cleanAddress.toLowerCase().includes('woodinville')) {
                const fallbackCoords = { lat: 47.7544, lng: -122.1556 };
                this.geocodeCache.set(cacheKey, fallbackCoords);
                return fallbackCoords;
            }
            
            // Cache null results to avoid repeated failed requests
            this.geocodeCache.set(cacheKey, null);
            return null;
        } catch (error) {
            console.error('NavigationComponent: Mapbox geocoding error:', error);
            return null;
        }
    }

    assessAddressQuality(feature) {
        // Assess address quality based on Mapbox geocoding response
        const relevance = feature.relevance || 0;
        const accuracy = feature.properties?.accuracy || 'unknown';
        const addressType = feature.place_type?.[0] || 'unknown';
        
        // Quality scoring based on relevance and accuracy
        let quality = 'low';
        let score = 0;
        
        // Relevance score (0-1)
        score += relevance * 0.4;
        
        // Accuracy score based on address type
        const accuracyScores = {
            'address': 0.4,      // Exact address
            'poi': 0.3,          // Point of interest
            'place': 0.2,        // City/neighborhood
            'region': 0.1,       // State/region
            'country': 0.05      // Country
        };
        score += accuracyScores[addressType] || 0.1;
        
        // Additional quality indicators
        if (feature.properties?.address) score += 0.1;  // Has street address
        if (feature.properties?.postcode) score += 0.1; // Has postal code
        if (feature.context?.some(ctx => ctx.id?.startsWith('place'))) score += 0.1; // Has city context
        
        // Determine quality level
        if (score >= 0.8) quality = 'high';
        else if (score >= 0.5) quality = 'medium';
        else quality = 'low';
        
        console.log('NavigationComponent: Address quality assessment:', {
            address: feature.place_name,
            relevance,
            accuracy,
            addressType,
            score: score.toFixed(2),
            quality
        });
        
        return {
            level: quality,
            score: Math.round(score * 100),
            details: {
                relevance,
                accuracy,
                addressType,
                hasStreetAddress: !!feature.properties?.address,
                hasPostalCode: !!feature.properties?.postcode
            }
        };
    }

    createPinMarker(type, quality = 'medium') {
        // Create a pin marker element with quality-based coloring
        const markerEl = document.createElement('div');
        markerEl.className = `pin-marker pin-${type} pin-quality-${quality}`;
        
        // Define colors based on quality
        const qualityColors = {
            high: '#22c55e',    // Green
            medium: '#f59e0b',  // Amber
            low: '#ef4444'      // Red
        };
        
        const typeIcons = {
            destination: '📍',  // Destination pin
            user: '🏠'          // User location house
        };
        
        const color = qualityColors[quality] || qualityColors.medium;
        const icon = typeIcons[type] || '📍';
        
        // Create the pin SVG
        markerEl.innerHTML = `
            <div class="pin-container">
                <div class="pin-icon" style="color: ${color};">${icon}</div>
                <div class="pin-shadow"></div>
            </div>
        `;
        
        // Add CSS styles
        markerEl.style.cssText = `
            width: 30px;
            height: 30px;
            cursor: pointer;
            position: relative;
        `;
        
        return markerEl;
    }

    async getDirectionsAndDistance(fromCoords, toCoords) {
        try {
            const cacheKey = `directions:${fromCoords.lng},${fromCoords.lat}:${toCoords.lng},${toCoords.lat}`;
            
            // Check cache first
            if (this.directionsCache.has(cacheKey)) {
                console.log('NavigationComponent: Using cached directions result');
                return this.directionsCache.get(cacheKey);
            }
            
            console.log('NavigationComponent: Getting directions from Mapbox:', fromCoords, 'to', toCoords);
            
            // Use Mapbox Directions API
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${fromCoords.lng},${fromCoords.lat};${toCoords.lng},${toCoords.lat}?access_token=${this.mapboxAccessToken}&geometries=geojson&overview=simplified`;
            
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                if (data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    const result = {
                        distance: route.distance / 1609.34, // Convert meters to miles
                        duration: route.duration / 60, // Convert seconds to minutes
                        geometry: route.geometry
                    };
                    
                    // Cache the result
                    this.directionsCache.set(cacheKey, result);
                    console.log('NavigationComponent: Mapbox directions successful:', result);
                    return result;
                }
            }
            
            // Fallback to straight-line distance
            const straightDistance = this.calculateStraightDistance(
                fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng
            );
            const fallbackResult = {
                distance: straightDistance * 1.3, // Estimate driving distance
                duration: (straightDistance * 1.3 / 30) * 60, // Estimate at 30mph
                geometry: null
            };
            
            this.directionsCache.set(cacheKey, fallbackResult);
            return fallbackResult;
        } catch (error) {
            console.error('NavigationComponent: Mapbox directions error:', error);
            
            // Fallback to straight-line calculation
            const straightDistance = this.calculateStraightDistance(
                fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng
            );
            return {
                distance: straightDistance * 1.3,
                duration: (straightDistance * 1.3 / 30) * 60,
                geometry: null
            };
        }
    }

    async initializeMapContent(map, parkData) {
        const markers = [];
        let userCoords = null;
        let parkCoords = null;
        
        // Add park marker if park data is available
        if (parkData && parkData.latitude && parkData.longitude) {
            const markerLat = parseFloat(parkData.latitude);
            const markerLng = parseFloat(parkData.longitude);
            parkCoords = { lat: markerLat, lng: markerLng };
            
            console.log('NavigationComponent: Adding park marker at:', markerLat, markerLng);
            
            // Create pin marker for park (destination)
            const parkMarkerEl = this.createPinMarker('destination', 'high');
            
            const parkMarker = new mapboxgl.Marker(parkMarkerEl)
                .setLngLat([markerLng, markerLat])
                .setPopup(new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`<h4>${parkData.name}</h4><p>${parkData.address}</p>`))
                .addTo(map);
            
            markers.push(parkMarker);
        }

        // Add user address marker and plot route if available
        const savedAddress = localStorage.getItem('savedAddress');
        if (savedAddress) {
            console.log('NavigationComponent: Adding user marker for:', savedAddress);
            userCoords = await this.geocodeAddress(savedAddress);
            
            if (userCoords) {
                // Create pin marker for user location with quality-based color
                const userMarkerEl = this.createPinMarker('user', userCoords.quality?.level || 'low');
                
                // Create popup with quality information
                const qualityInfo = userCoords.quality ? 
                    `<div class="quality-indicator quality-${userCoords.quality.level}">
                        <span class="quality-label">Address Quality: ${userCoords.quality.level.toUpperCase()}</span>
                        <span class="quality-score">(${userCoords.quality.score}%)</span>
                    </div>` : '';
                
                const userMarker = new mapboxgl.Marker(userMarkerEl)
                    .setLngLat([userCoords.lng, userCoords.lat])
                    .setPopup(new mapboxgl.Popup({ offset: 25 })
                        .setHTML(`<h4>Your Location</h4><p>${userCoords.placeName || savedAddress}</p>${qualityInfo}`))
                    .addTo(map);
                
                markers.push(userMarker);
            }
        }

        // Plot route and center map if we have both locations
        if (userCoords && parkCoords) {
            console.log('NavigationComponent: Plotting route between user and park');
            const directions = await this.getDirectionsAndDistance(userCoords, parkCoords);
            
            if (directions && directions.geometry) {
                // Add route to the map
                this.addRouteToMap(map, directions.geometry);
                
                // Center map on the route
                this.centerMapOnRoute(map, userCoords, parkCoords);
                
                // Update distance display
                console.log('NavigationComponent: Distance calculation result:', directions);
                this.updateDistanceDisplay(directions.duration, directions.distance);
            } else if (directions) {
                // No route geometry but we have distance - just fit both markers
                console.log('NavigationComponent: No route geometry, fitting markers');
                this.fitMarkersInView(map, [userCoords, parkCoords]);
                this.updateDistanceDisplay(directions.duration, directions.distance);
            }
        } else if (markers.length > 0) {
            // Just fit the available markers
            const coords = [];
            if (userCoords) coords.push(userCoords);
            if (parkCoords) coords.push(parkCoords);
            if (coords.length > 0) {
                this.fitMarkersInView(map, coords);
            }
        }
    }

    addRouteToMap(map, geometry) {
        console.log('NavigationComponent: Adding route to map');
        
        // Remove existing route if it exists
        if (map.getSource('route')) {
            map.removeLayer('route');
            map.removeSource('route');
        }
        
        // Add route source and layer
        map.addSource('route', {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: geometry
            }
        });
        
        map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#3887be',
                'line-width': 5,
                'line-opacity': 0.75
            }
        });
    }

    centerMapOnRoute(map, userCoords, parkCoords) {
        console.log('NavigationComponent: Centering map on route');
        
        // Create bounds that include both points
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend([userCoords.lng, userCoords.lat]);
        bounds.extend([parkCoords.lng, parkCoords.lat]);
        
        // Fit the map to the bounds with padding
        map.fitBounds(bounds, {
            padding: { top: 50, bottom: 50, left: 50, right: 50 },
            maxZoom: 15
        });
    }

    fitMarkersInView(map, coordinates) {
        console.log('NavigationComponent: Fitting markers in view');
        
        if (coordinates.length === 1) {
            // Single marker - just center on it
            const coord = coordinates[0];
            map.setCenter([coord.lng, coord.lat]);
            map.setZoom(13);
        } else if (coordinates.length > 1) {
            // Multiple markers - fit bounds
            const bounds = new mapboxgl.LngLatBounds();
            coordinates.forEach(coord => {
                bounds.extend([coord.lng, coord.lat]);
            });
            
            map.fitBounds(bounds, {
                padding: { top: 50, bottom: 50, left: 50, right: 50 },
                maxZoom: 15
            });
        }
    }

    updateDistanceDisplay(timeInMinutes, distanceInMiles) {
        console.log('NavigationComponent: Updating distance display:', timeInMinutes, 'min,', distanceInMiles, 'mi');
        
        const travelTimeEl = document.getElementById('travelTime');
        const drivingDistanceEl = document.getElementById('drivingDistance');

        console.log('NavigationComponent: Travel time element found:', !!travelTimeEl);
        console.log('NavigationComponent: Driving distance element found:', !!drivingDistanceEl);
        
        if (!travelTimeEl || !drivingDistanceEl) {
            console.error('NavigationComponent: Distance elements not found in DOM');
            return;
        }

        if (travelTimeEl) {
            if (timeInMinutes === null || timeInMinutes === undefined || isNaN(timeInMinutes)) {
                travelTimeEl.textContent = 'n/a';
            } else {
                const hours = Math.floor(timeInMinutes / 60);
                const mins = Math.round(timeInMinutes % 60);
                
                let timeText;
                if (hours > 0) {
                    timeText = `${hours}h ${mins > 0 ? mins + 'm' : ''}`;
                } else {
                    timeText = `${mins} min`;
                }
                
                travelTimeEl.textContent = timeText;
                console.log('NavigationComponent: Travel time updated to:', timeText);
            }
        }

        if (drivingDistanceEl) {
            if (distanceInMiles === null || distanceInMiles === undefined || isNaN(distanceInMiles)) {
                drivingDistanceEl.textContent = 'n/a';
            } else {
                const distanceText = `${distanceInMiles.toFixed(1)} mi`;
                drivingDistanceEl.textContent = distanceText;
                console.log('NavigationComponent: Driving distance updated to:', distanceText);
            }
        }
    }

    async initializePhotoWidget() {
        const photoContainer = document.querySelector('.photo-section, .photo-column');
        if (photoContainer && !photoContainer.photoWidget) {
            console.log('NavigationComponent: Initializing PhotoWidget...');
            photoContainer.photoWidget = new PhotoWidget(photoContainer);
            
            // Wait for the PhotoWidget to initialize
            await new Promise(resolve => {
                const checkInit = () => {
                    if (photoContainer.photoWidget.isInitialized) {
                        console.log('NavigationComponent: PhotoWidget initialized successfully');
                        resolve();
                    } else {
                        setTimeout(checkInit, 100);
                    }
                };
                checkInit();
            });
        }
    }

    navigateToPage(href) {
        console.log('NavigationComponent: Navigating to:', href);
        this.loadPageContent(href);
        
        // Ensure URL includes base path for GitHub Pages
        const basePath = window.CONFIG?.basePath || '';
        const fullHref = href.startsWith('/') ? `${basePath}${href}` : `${basePath}/${href}`;
        
        console.log('NavigationComponent: Updating URL to:', fullHref);
        window.history.pushState({}, '', fullHref);
    }

    async navigateToHome() {
        console.log('NavigationComponent: Navigating to home');
        // Load the home page content
        await this.loadPageContent('/home');
        
        // Update URL to home with base path
        const basePath = window.CONFIG?.basePath || '';
        const homeUrl = basePath === '' ? '/' : basePath;
        
        console.log('NavigationComponent: Updating URL to home:', homeUrl);
        window.history.pushState({}, '', homeUrl);
        
        // Update active navigation (remove active states)
        document.querySelectorAll('.tree-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Close mobile navigation if open
        this.closeMobileNavigation();
    }

    updateActiveNavigation(href) {
        // Remove active class from all links
        document.querySelectorAll('.tree-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current link
        const activeLink = document.querySelector(`.tree-link[href="${href}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            this.expandNavigationToLink(activeLink);
        }
    }

    expandNavigationToLink(activeLink) {
        let currentElement = activeLink.parentElement;
        
        while (currentElement && currentElement.classList.contains('tree-item')) {
            const children = currentElement.querySelector('.tree-children');
            if (children) {
                children.style.display = 'block';
                const toggle = currentElement.querySelector('.tree-toggle i');
                if (toggle) {
                    toggle.style.transform = 'rotate(90deg)';
                }
            }
            currentElement = currentElement.parentElement.closest('.tree-item');
        }
    }

    setupAddressInput() {
        const addressInput = document.getElementById('addressInput');
        const saveBtn = document.getElementById('saveAddressBtn');
        
        if (addressInput && saveBtn) {
            // Set the default address and mark as saved from the start
            const defaultAddress = "8127 229th Place SE, Woodinville, WA 98072";
            addressInput.value = defaultAddress;
            localStorage.setItem('savedAddress', defaultAddress);
            
            // Apply saved styling immediately
            addressInput.classList.add('saved');
            saveBtn.classList.add('change-mode');
            saveBtn.innerHTML = '<i class="fas fa-check"></i><span>Saved</span>';
            
            console.log('NavigationComponent: Address set to default and saved:', defaultAddress);
            
            // Save address on button click
            saveBtn.addEventListener('click', () => {
                const address = addressInput.value.trim();
                if (address) {
                    localStorage.setItem('savedAddress', address);
                    console.log('NavigationComponent: Address saved:', address);
                }
            });
        }
    }

    saveTreeState() {
        const expandedNodes = [];
        document.querySelectorAll('.tree-children[style*="block"]').forEach(children => {
            const node = children.parentElement.querySelector('.tree-node');
            if (node) {
                const label = node.querySelector('.tree-label');
                if (label) {
                    expandedNodes.push(label.textContent);
                }
            }
        });
        
        localStorage.setItem('treeNavigationState', JSON.stringify(expandedNodes));
    }

    setupUSDATreeLinks() {
        console.log('NavigationComponent: Setting up USDA tree links');
        const treeLinks = document.querySelectorAll('.tree-link[data-plant]');
        console.log('NavigationComponent: Found', treeLinks.length, 'USDA tree links');
        
        treeLinks.forEach((link, index) => {
            const plantSlug = link.getAttribute('data-plant');
            console.log('NavigationComponent: Setting up USDA tree link', index, 'for plant:', plantSlug);
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (plantSlug) {
                    console.log('NavigationComponent: USDA tree link clicked:', plantSlug);
                    this.navigateToPage('/content/' + plantSlug + '.html');
                }
            });
        });
    }

    restoreTreeState() {
        const savedState = localStorage.getItem('treeNavigationState');
        if (savedState) {
            try {
                const expandedNodes = JSON.parse(savedState);
                expandedNodes.forEach(nodeLabel => {
                    const node = Array.from(document.querySelectorAll('.tree-label'))
                        .find(label => label.textContent === nodeLabel)
                        ?.closest('.tree-node');
                    
                    if (node) {
                        const children = node.parentElement.querySelector('.tree-children');
                        if (children) {
                            children.style.display = 'block';
                            const chevron = node.querySelector('.tree-toggle i');
                            if (chevron) {
                                chevron.style.transform = 'rotate(90deg)';
                            }
                        }
                    }
                });
            } catch (e) {
                console.error('NavigationComponent: Error restoring tree state:', e);
            }
        }
    }

    async validateParkAddress() {
        console.log('NavigationComponent: Validating park address...');
        
        // Get the park address element
        const parkAddressElement = document.querySelector('.park-address');
        if (!parkAddressElement) {
            console.log('NavigationComponent: No park address element found');
            return;
        }
        
        // Get the address text
        const addressSpan = parkAddressElement.querySelector('span');
        if (!addressSpan) {
            console.log('NavigationComponent: No address text found');
            return;
        }
        
        const address = addressSpan.textContent.trim();
        console.log('NavigationComponent: Validating address:', address);
        
        // Use the existing geocoding function to validate the address
        const geocodeResult = await this.geocodeAddress(address);
        
        if (!geocodeResult) {
            // Address could not be verified - add invalid class
            console.log('NavigationComponent: Address not verifiable, adding invalid styling:', address);
            parkAddressElement.classList.add('invalid');
            
            // Optional: Add a tooltip or warning message
            const icon = parkAddressElement.querySelector('i');
            if (icon) {
                icon.title = 'Address could not be verified by Mapbox - please check for accuracy';
            }
        } else {
            // Address is valid - ensure no invalid class
            console.log('NavigationComponent: Address verified successfully:', address);
            parkAddressElement.classList.remove('invalid');
        }
    }

    openMobileNav() {
        const sideNav = document.getElementById('sideNav');
        const mobileNavOverlay = document.getElementById('mobileNavOverlay');
        const toggle = document.getElementById('mobileNavToggle');
        
        if (sideNav) sideNav.classList.add('open');
        if (mobileNavOverlay) mobileNavOverlay.classList.add('open');
        if (toggle) toggle.classList.add('active');
    }

    closeMobileNav() {
        const sideNav = document.getElementById('sideNav');
        const mobileNavOverlay = document.getElementById('mobileNavOverlay');
        const toggle = document.getElementById('mobileNavToggle');
        
        if (sideNav) sideNav.classList.remove('open');
        if (mobileNavOverlay) mobileNavOverlay.classList.remove('open');
        if (toggle) toggle.classList.remove('active');
    }

    closeMobileNavigation() {
        this.closeMobileNav();
    }

    setupSPALinks() {
        console.log('NavigationComponent: Setting up SPA links...');
        
        // Handle SPA links in dynamically loaded content
        const mainContent = document.querySelector('.main-content-area');
        if (mainContent) {
            const spaLinks = mainContent.querySelectorAll('.spa-link');
            console.log('NavigationComponent: Found', spaLinks.length, 'SPA links in main content');
            
            spaLinks.forEach((link, index) => {
                console.log('NavigationComponent: Setting up SPA link', index, ':', link.getAttribute('href'));
                
                // Remove existing listeners to avoid duplicates
                link.removeEventListener('click', this.handleSpaLinkClick);
                link.addEventListener('click', this.handleSpaLinkClick.bind(this));
            });
        }
        
        // Also handle SPA links in the main page (like home link in header)
        const allSpaLinks = document.querySelectorAll('.spa-link');
        console.log('NavigationComponent: Found', allSpaLinks.length, 'total SPA links on page');
        
        allSpaLinks.forEach((link, index) => {
            // Remove existing listeners to avoid duplicates
            link.removeEventListener('click', this.handleSpaLinkClick);
            link.addEventListener('click', this.handleSpaLinkClick.bind(this));
        });
    }

    handleSpaLinkClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Get the href from the clicked element or its closest link
        const link = e.target.closest('a');
        const href = link ? link.getAttribute('href') : e.target.getAttribute('href');
        
        console.log('NavigationComponent: SPA link clicked:', href, 'from element:', e.target);
        
        if (!href) {
            console.warn('NavigationComponent: No href found for SPA link');
            return;
        }
        
        // Handle home link specially
        if (href === '/' || href === '') {
            console.log('NavigationComponent: Navigating to home via SPA link');
            this.navigateToHome();
        } else {
            console.log('NavigationComponent: Navigating to page via SPA link:', href);
            this.navigateToPage(href);
        }
    }

    destroy() {
        this.isInitialized = false;
        console.log('NavigationComponent: Destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationComponent;
} else {
    window.NavigationComponent = NavigationComponent;
}
