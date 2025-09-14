/**
 * PhotoWidget Component
 * Handles photo display, navigation, and auto-play for plant/tree pages
 */
class PhotoWidget {
    constructor(container) {
        console.log('PhotoWidget: Constructor called with container:', container);
        this.container = container;
        this.allPhotos = [];
        this.currentPhotoIndex = 0;
        this.autoTransitionInterval = null;
        this.isInitialized = false;
        
        // Initialize asynchronously
        this.init().catch(error => {
            console.error('PhotoWidget: Error during initialization:', error);
        });
    }

    async init() {
        console.log('PhotoWidget: Init called');
        if (!this.container) {
            console.warn('PhotoWidget: No container provided');
            return;
        }

        console.log('PhotoWidget: Container found, loading photo data...');
        // Extract photo data from inline script
        await this.loadPhotoData();
        
        console.log('PhotoWidget: Photo data loaded, found', this.allPhotos.length, 'photos');
        
        if (this.allPhotos.length === 0) {
            console.log('PhotoWidget: No photo data found');
            return;
        }

        console.log('PhotoWidget: Setting up event listeners...');
        this.setupEventListeners();
        
        console.log('PhotoWidget: Updating photo display...');
        this.updatePhotoDisplay();
        
        
        console.log('PhotoWidget: Starting auto transition...');
        this.startAutoTransition();
        
        this.isInitialized = true;
        
        console.log('PhotoWidget: Initialized with', this.allPhotos.length, 'photos');
    }

    async loadPhotoData() {
        // First try to get plant slug from the page
        const plantSlug = this.extractPlantSlug();
        if (!plantSlug) {
            console.warn('PhotoWidget: Could not determine plant slug');
            return;
        }

        // Scan for available photos dynamically - this is the only data source
        await this.scanAvailablePhotos(plantSlug);
    }

    extractPlantSlug() {
        console.log('PhotoWidget: Extracting plant slug...');
        
        // Try to get plant slug from various sources
        const currentPath = window.location.pathname;
        console.log('PhotoWidget: Current path:', currentPath);
        
        const pathMatch = currentPath.match(/\/([^\/]+)\.html$/);
        if (pathMatch) {
            console.log('PhotoWidget: Found slug from path:', pathMatch[1]);
            return pathMatch[1];
        }
        
        // Try to get from image src in template
        const img = document.querySelector('#treePhoto');
        if (img && img.src) {
            console.log('PhotoWidget: Image src:', img.src);
            const srcMatch = img.src.match(/images\/([^\/]+)\//);
            if (srcMatch) {
                console.log('PhotoWidget: Found slug from image src:', srcMatch[1]);
                return srcMatch[1];
            }
        }
        
        // Try to get from the current content URL (for SPA)
        const currentContent = window.currentContent || '';
        console.log('PhotoWidget: Current content:', currentContent);
        if (currentContent) {
            const contentMatch = currentContent.match(/([^\/]+)\.html$/);
            if (contentMatch) {
                console.log('PhotoWidget: Found slug from current content:', contentMatch[1]);
                return contentMatch[1];
            }
        }
        
        // Try to get from the page title or any other indicator
        const title = document.title;
        console.log('PhotoWidget: Page title:', title);
        
        // Fallback: try to extract from the image src in the template
        const fallbackImg = document.querySelector('#treePhoto');
        if (fallbackImg && fallbackImg.src && fallbackImg.src.includes('images/')) {
            const srcMatch = fallbackImg.src.match(/images\/([^\/]+)\//);
            if (srcMatch) {
                console.log('PhotoWidget: Found slug from fallback image src:', srcMatch[1]);
                return srcMatch[1];
            }
        }
        
        // Last resort: hardcode for testing
        console.log('PhotoWidget: Using fallback slug: douglas-fir');
        return 'douglas-fir';
    }

    async scanAvailablePhotos(plantSlug) {
        console.log('PhotoWidget: Scanning photos for', plantSlug);
        
        const plantSlugUnderscore = plantSlug.replace(/-/g, '_');
        const seasons = ['spring', 'summer', 'fall', 'winter'];
        const fileExtensions = ['.jpeg', '.jpg', '.png']; // Support multiple file extensions
        
        this.allPhotos = [];
        
        // Scan all seasons for photos - limit to reasonable range to avoid excessive 404s
        for (const season of seasons) {
            let consecutiveMissing = 0;
            const maxConsecutiveMissing = 3; // Reduced from 5
            const maxCheckLimit = 10; // Reduced from 100 to be more realistic
            
            console.log(`PhotoWidget: Scanning ${season} photos...`);
            
            for (let i = 1; i <= maxCheckLimit; i++) {
                let photoFound = false;
                
                // Try each file extension
                for (const extension of fileExtensions) {
                    const photoPath = `/images/${plantSlug}/${plantSlugUnderscore}__${season}__${String(i).padStart(2, '0')}${extension}`;
                    
                    try {
                        const response = await fetch(photoPath, { method: 'HEAD' });
                        if (response.ok) {
                            const photoInfo = {
                                src: photoPath,
                                season: season,
                                seasonName: season.charAt(0).toUpperCase() + season.slice(1),
                                index: this.allPhotos.length,
                                globalIndex: this.allPhotos.length + 1
                            };
                            this.allPhotos.push(photoInfo);
                            consecutiveMissing = 0;
                            photoFound = true;
                            console.log(`PhotoWidget: Found ${photoPath}`);
                            break; // Found the photo, no need to check other extensions
                        }
                    } catch (error) {
                        console.log(`PhotoWidget: Error checking ${photoPath}:`, error);
                    }
                }
                
                if (!photoFound) {
                    consecutiveMissing++;
                    if (consecutiveMissing >= maxConsecutiveMissing) {
                        console.log(`PhotoWidget: Stopping after ${consecutiveMissing} consecutive missing photos for ${season}`);
                        break;
                    }
                }
            }
        }
        
        console.log(`PhotoWidget: Found ${this.allPhotos.length} total photos:`, this.allPhotos);
    }


    setupEventListeners() {
        // Next/Previous buttons
        const nextBtn = this.container.querySelector('#nextBtn');
        const prevBtn = this.container.querySelector('#prevBtn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.nextPhoto();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.previousPhoto();
            });
        }

        // Season buttons
        this.container.querySelectorAll('.photo-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const season = btn.getAttribute('data-season');
                this.jumpToSeason(season);
            });
        });
    }

    updatePhotoDisplay() {
        const photo = this.container.querySelector('#treePhoto');
        const placeholder = this.container.querySelector('.image-placeholder');
        const seasonIndicator = this.container.querySelector('#seasonIndicator');
        const photoCounter = this.container.querySelector('#photoCounter');
        const prevBtn = this.container.querySelector('#prevBtn');
        const nextBtn = this.container.querySelector('#nextBtn');
        
        if (!photo || !placeholder || !seasonIndicator || !photoCounter || !prevBtn || !nextBtn) {
            console.warn('PhotoWidget: Required elements not found');
            console.log('PhotoWidget: Missing elements:', {
                photo: !!photo,
                placeholder: !!placeholder,
                seasonIndicator: !!seasonIndicator,
                photoCounter: !!photoCounter,
                prevBtn: !!prevBtn,
                nextBtn: !!nextBtn
            });
            return;
        }
        
        const currentPhoto = this.allPhotos[this.currentPhotoIndex];
        
        // Update navigation controls
        seasonIndicator.textContent = currentPhoto.seasonName;
        photoCounter.textContent = `${this.currentPhotoIndex + 1} / ${this.allPhotos.length}`;
        
        // Enable looping - buttons should never be disabled
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        
        // Photo widget is now self-contained - no external data dependencies
        
        // Update active season button
        this.container.querySelectorAll('.photo-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeSeasonBtn = this.container.querySelector(`[data-season="${currentPhoto.season}"]`);
        if (activeSeasonBtn) {
            activeSeasonBtn.classList.add('active');
        }
        
        // Handle image loading
        this.loadImage(photo, placeholder, currentPhoto);
    }


    loadImage(photo, placeholder, currentPhoto) {
        console.log('PhotoWidget: loadImage called with:', {
            photo: photo,
            placeholder: placeholder,
            currentPhoto: currentPhoto
        });
        
        // Show placeholder while loading
        photo.style.display = 'none';
        placeholder.style.display = 'flex';
        
        console.log('PhotoWidget: Loading image:', currentPhoto.src);
        
        // Set the src and handle loading
        photo.src = currentPhoto.src;
        photo.alt = `${currentPhoto.seasonName} photo`;
        
        // Check if image is already loaded
        if (photo.complete && photo.naturalHeight !== 0) {
            console.log('PhotoWidget: Image already loaded:', currentPhoto.src);
            photo.style.display = 'block';
            placeholder.style.display = 'none';
            return;
        }
        
        photo.onload = () => {
            console.log('PhotoWidget: Image onload triggered for:', currentPhoto.src);
            photo.style.display = 'block';
            placeholder.style.display = 'none';
            console.log('PhotoWidget: Photo loaded successfully:', currentPhoto.src);
            console.log('PhotoWidget: Image display style after load:', photo.style.display);
            console.log('PhotoWidget: Image computed style:', window.getComputedStyle(photo).display);
        };
        
        photo.onerror = () => {
            console.log('PhotoWidget: Image onerror triggered for:', currentPhoto.src);
            photo.style.display = 'none';
            placeholder.style.display = 'flex';
            this.showPlaceholder(placeholder);
            console.log('PhotoWidget: Photo not available, showing placeholder for:', currentPhoto.src);
        };
    }

    showPlaceholder(placeholder) {
        // Get plant name from the page
        const plantName = document.querySelector('.tree-title-section h1')?.textContent || 'Plant';
        const plantType = document.querySelector('.tree-title-section h1')?.textContent ? 'Tree' : 'Plant';
        
        placeholder.innerHTML = `
            <i class="fas fa-seedling"></i>
            <h3>${plantName}</h3>
            <p>Photos coming soon</p>
            <p class="placeholder-subtitle">Beautiful images of this ${plantType} will be added here</p>
        `;
    }

    nextPhoto() {
        if (this.currentPhotoIndex < this.allPhotos.length - 1) {
            this.currentPhotoIndex++;
        } else {
            this.currentPhotoIndex = 0; // Loop back to start
        }
        this.updatePhotoDisplay();
        this.resetAutoTransition();
    }

    previousPhoto() {
        if (this.currentPhotoIndex > 0) {
            this.currentPhotoIndex--;
        } else {
            this.currentPhotoIndex = this.allPhotos.length - 1; // Loop to end
        }
        this.updatePhotoDisplay();
        this.resetAutoTransition();
    }

    jumpToSeason(season) {
        const seasonIndex = this.allPhotos.findIndex(photo => photo.season === season);
        if (seasonIndex !== -1) {
            this.currentPhotoIndex = seasonIndex;
            this.updatePhotoDisplay();
            this.resetAutoTransition();
            console.log(`PhotoWidget: Jumped to first ${season} photo at index ${seasonIndex}`);
        } else {
            console.warn(`PhotoWidget: No photos found for season ${season}`);
        }
    }

    startAutoTransition() {
        // Clear any existing interval first
        this.stopAutoTransition();
        
        this.autoTransitionInterval = setInterval(() => {
            if (this.currentPhotoIndex < this.allPhotos.length - 1) {
                this.currentPhotoIndex++;
            } else {
                this.currentPhotoIndex = 0; // Loop back to start
            }
            this.updatePhotoDisplay();
        }, 3000); // Change photo every 3 seconds
    }

    stopAutoTransition() {
        if (this.autoTransitionInterval) {
            clearInterval(this.autoTransitionInterval);
            this.autoTransitionInterval = null;
        }
    }

    resetAutoTransition() {
        this.stopAutoTransition();
        setTimeout(() => this.startAutoTransition(), 1000); // Restart after 1 second
    }

    destroy() {
        this.stopAutoTransition();
        this.isInitialized = false;
        console.log('PhotoWidget: Destroyed');
    }
}

// Export for use in other modules
console.log('PhotoWidget.js: Script loaded, defining PhotoWidget class...');
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhotoWidget;
} else {
    window.PhotoWidget = PhotoWidget;
    console.log('PhotoWidget.js: PhotoWidget class defined on window object');
}
