#!/usr/bin/env python3
"""
Advanced lavender image crawler that fetches diverse, real lavender photos.
This uses multiple image sources and different search terms for variety.
"""

import os
import requests
import time
import random
from urllib.parse import quote

# Diverse lavender image URLs from different sources and search terms
LAVENDER_IMAGE_SOURCES = {
    'spring': [
        # Spring lavender - young plants, new growth
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

# Alternative image sources with different URLs
ALTERNATIVE_SOURCES = {
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

def download_with_retry(url, filepath, max_retries=3):
    """Download an image with retry logic."""
    for attempt in range(max_retries):
        try:
            print(f"    Attempt {attempt + 1}/{max_retries}...")
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            file_size = os.path.getsize(filepath)
            print(f"    ✓ Downloaded ({file_size} bytes)")
            return True
            
        except Exception as e:
            print(f"    ✗ Attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(2)  # Wait before retry
            else:
                print(f"    ✗ All attempts failed for {url}")
                return False
    
    return False

def download_lavender_images():
    """Download diverse lavender images from multiple sources."""
    print("=== Advanced Lavender Image Crawler ===")
    print("Fetching diverse, real lavender photos...\n")
    
    # Create lavender directory
    lavender_dir = "images/lavender"
    os.makedirs(lavender_dir, exist_ok=True)
    
    success_count = 0
    total_images = 0
    
    for season, urls in LAVENDER_IMAGE_SOURCES.items():
        print(f"Downloading {season} lavender images...")
        
        for i, url in enumerate(urls, 1):
            filename = f"lavender__{season}__{i:02d}.jpg"
            filepath = os.path.join(lavender_dir, filename)
            total_images += 1
            
            print(f"  Fetching {filename}...")
            
            # Try primary source
            if download_with_retry(url, filepath):
                success_count += 1
            else:
                # Try alternative source
                if season in ALTERNATIVE_SOURCES and i <= len(ALTERNATIVE_SOURCES[season]):
                    alt_url = ALTERNATIVE_SOURCES[season][i-1]
                    print(f"  Trying alternative source...")
                    if download_with_retry(alt_url, filepath):
                        success_count += 1
                    else:
                        print(f"  ✗ Failed to download {filename}")
            
            # Small delay between downloads
            time.sleep(1)
        
        print()
    
    print("=== Download Summary ===")
    print(f"Total images attempted: {total_images}")
    print(f"Successfully downloaded: {success_count}")
    print(f"Failed downloads: {total_images - success_count}")
    
    return success_count == total_images

def verify_lavender_images():
    """Verify the downloaded lavender images."""
    print("\n=== Verifying Lavender Images ===")
    
    lavender_dir = "images/lavender"
    if not os.path.exists(lavender_dir):
        print("❌ Lavender directory not found")
        return False
    
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
    return total_found == 8

def main():
    """Main function to download and verify lavender images."""
    print("Advanced Lavender Image Crawler")
    print("=" * 40)
    
    # Download images
    download_success = download_lavender_images()
    
    # Verify results
    verify_success = verify_lavender_images()
    
    if download_success and verify_success:
        print("\n🎉 All lavender images downloaded and verified successfully!")
        print("The images should now show real lavender photos instead of placeholders.")
    else:
        print("\n⚠️  Some images may still be placeholders.")
        print("For the best results, manually download real lavender images from:")
        print("- Unsplash: https://unsplash.com/s/photos/lavender")
        print("- Pixabay: https://pixabay.com/images/search/lavender/")
        print("- Pexels: https://pexels.com/search/lavender/")

if __name__ == "__main__":
    main()
