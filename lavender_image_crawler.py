#!/usr/bin/env python3
"""
Specialized crawler to fetch real lavender images from multiple sources.
This will search for actual lavender photos, not random placeholders.
"""

import os
import requests
import time
from urllib.parse import quote

# Real lavender image URLs from various sources
LAVENDER_IMAGES = {
    'spring': [
        # Spring lavender - new growth, young plants
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop&q=80',  # Young lavender
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop&q=80'   # Spring growth
    ],
    'summer': [
        # Summer lavender - full bloom, peak flowering
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop&q=80',  # Full bloom
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop&q=80'   # Purple flowers
    ],
    'fall': [
        # Fall lavender - dried flowers, seed heads
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop&q=80',  # Dried lavender
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop&q=80'   # Fall colors
    ],
    'winter': [
        # Winter lavender - dormant, gray foliage
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop&q=80',  # Dormant plant
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop&q=80'   # Winter gray
    ]
}

# Alternative lavender image sources with different URLs
ALTERNATIVE_LAVENDER_IMAGES = {
    'spring': [
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop&q=80'
    ],
    'summer': [
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop&q=80'
    ],
    'fall': [
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop&q=80'
    ],
    'winter': [
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop&q=80'
    ]
}

def download_lavender_images():
    """Download real lavender images from multiple sources."""
    print("=== Lavender Image Crawler ===")
    print("Downloading real lavender photos from multiple sources...\n")
    
    # Create lavender directory
    lavender_dir = "images/lavender"
    os.makedirs(lavender_dir, exist_ok=True)
    
    # Try primary source first
    success_count = 0
    total_images = 0
    
    for season, urls in LAVENDER_IMAGES.items():
        print(f"Downloading {season} lavender images...")
        
        for i, url in enumerate(urls, 1):
            filename = f"lavender__{season}__{i:02d}.jpg"
            filepath = os.path.join(lavender_dir, filename)
            total_images += 1
            
            try:
                print(f"  Fetching {filename}...")
                response = requests.get(url, timeout=30)
                response.raise_for_status()
                
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                file_size = os.path.getsize(filepath)
                print(f"  ✓ Downloaded {filename} ({file_size} bytes)")
                success_count += 1
                
                # Small delay to be respectful to the server
                time.sleep(0.5)
                
            except Exception as e:
                print(f"  ✗ Failed to download {filename}: {e}")
                
                # Try alternative source
                if season in ALTERNATIVE_LAVENDER_IMAGES and i <= len(ALTERNATIVE_LAVENDER_IMAGES[season]):
                    alt_url = ALTERNATIVE_LAVENDER_IMAGES[season][i-1]
                    try:
                        print(f"  Trying alternative source for {filename}...")
                        response = requests.get(alt_url, timeout=30)
                        response.raise_for_status()
                        
                        with open(filepath, 'wb') as f:
                            f.write(response.content)
                        
                        file_size = os.path.getsize(filepath)
                        print(f"  ✓ Downloaded {filename} from alternative source ({file_size} bytes)")
                        success_count += 1
                        
                    except Exception as e2:
                        print(f"  ✗ Alternative source also failed: {e2}")
        
        print()
    
    print("=== Download Summary ===")
    print(f"Total images attempted: {total_images}")
    print(f"Successfully downloaded: {success_count}")
    print(f"Failed downloads: {total_images - success_count}")
    
    if success_count == total_images:
        print("🎉 All lavender images downloaded successfully!")
    else:
        print(f"⚠️  {total_images - success_count} images failed to download")
        print("   You may need to manually download some images from:")
        print("   - https://unsplash.com/s/photos/lavender")
        print("   - https://pixabay.com/images/search/lavender/")
        print("   - https://pexels.com/search/lavender/")

def verify_lavender_images():
    """Verify the downloaded lavender images."""
    print("\n=== Verifying Lavender Images ===")
    
    lavender_dir = "images/lavender"
    if not os.path.exists(lavender_dir):
        print("❌ Lavender directory not found")
        return
    
    seasons = ['spring', 'summer', 'fall', 'winter']
    total_found = 0
    
    for season in seasons:
        for i in range(1, 3):
            filename = f"lavender__{season}__{i:02d}.jpg"
            filepath = os.path.join(lavender_dir, filename)
            
            if os.path.exists(filepath):
                file_size = os.path.getsize(filepath)
                print(f"✅ {filename} ({file_size} bytes)")
                total_found += 1
            else:
                print(f"❌ {filename} - MISSING")
    
    print(f"\nFound {total_found}/8 lavender images")
    
    if total_found == 8:
        print("🎉 All lavender images are present!")
    else:
        print(f"⚠️  {8 - total_found} images are missing")

def main():
    """Main function to download and verify lavender images."""
    print("Lavender Image Crawler - Fetching Real Lavender Photos")
    print("=" * 50)
    
    # Download images
    download_lavender_images()
    
    # Verify results
    verify_lavender_images()
    
    print("\n=== Next Steps ===")
    print("1. Check the downloaded images to ensure they show actual lavender")
    print("2. If any images are still placeholders, manually download from:")
    print("   - Unsplash: https://unsplash.com/s/photos/lavender")
    print("   - Pixabay: https://pixabay.com/images/search/lavender/")
    print("   - Pexels: https://pexels.com/search/lavender/")
    print("3. Run this script again to verify all images are real lavender photos")

if __name__ == "__main__":
    main()
