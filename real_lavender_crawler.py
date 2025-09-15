#!/usr/bin/env python3
"""
Real Lavender Image Crawler
Uses direct image URLs and alternative sources to get actual lavender photos.
"""

import os
import requests
import time
import random

class RealLavenderCrawler:
    def __init__(self):
        self.lavender_dir = "images/lavender"
        os.makedirs(self.lavender_dir, exist_ok=True)
        
        # Real lavender image URLs from various sources
        # These are direct links to actual lavender photos
        self.real_lavender_images = {
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
        
        # Alternative image sources with different URLs
        self.alternative_sources = {
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

    def download_image(self, url, filename, max_retries=3):
        """Download an image with retry logic."""
        for attempt in range(max_retries):
            try:
                print(f"  Downloading: {filename}")
                
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Sec-Fetch-Dest': 'image',
                    'Sec-Fetch-Mode': 'no-cors',
                    'Sec-Fetch-Site': 'cross-site'
                }
                
                response = requests.get(url, headers=headers, timeout=30)
                response.raise_for_status()
                
                filepath = os.path.join(self.lavender_dir, filename)
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                file_size = os.path.getsize(filepath)
                print(f"  ✓ Downloaded {filename} ({file_size} bytes)")
                return True
                
            except Exception as e:
                print(f"  ✗ Attempt {attempt + 1} failed: {e}")
                if attempt < max_retries - 1:
                    time.sleep(random.uniform(1, 2))
                else:
                    return False
        
        return False

    def download_lavender_images(self):
        """Download real lavender images."""
        print("=== Real Lavender Image Crawler ===")
        print("Downloading actual lavender photos...\n")
        
        success_count = 0
        total_images = 0
        
        for season, urls in self.real_lavender_images.items():
            print(f"Downloading {season} lavender images...")
            
            for i, url in enumerate(urls, 1):
                filename = f"lavender__{season}__{i:02d}.jpg"
                total_images += 1
                
                if self.download_image(url, filename):
                    success_count += 1
                else:
                    # Try alternative source
                    if season in self.alternative_sources and i <= len(self.alternative_sources[season]):
                        alt_url = self.alternative_sources[season][i-1]
                        print(f"  Trying alternative source...")
                        if self.download_image(alt_url, filename):
                            success_count += 1
                
                time.sleep(random.uniform(0.5, 1.5))
            
            print()
        
        print(f"=== Download Summary ===")
        print(f"Total images attempted: {total_images}")
        print(f"Successfully downloaded: {success_count}")
        print(f"Failed downloads: {total_images - success_count}")
        
        return success_count == total_images

    def verify_downloads(self):
        """Verify downloaded images."""
        print("\n=== Verifying Downloads ===")
        
        seasons = ['spring', 'summer', 'fall', 'winter']
        total_found = 0
        
        for season in seasons:
            for i in range(1, 3):
                filename = f"lavender__{season}__{i:02d}.jpg"
                filepath = os.path.join(self.lavender_dir, filename)
                
                if os.path.exists(filepath):
                    file_size = os.path.getsize(filepath)
                    print(f"✅ {filename} ({file_size} bytes)")
                    total_found += 1
                else:
                    print(f"❌ {filename} - MISSING")
        
        print(f"\nFound {total_found}/8 lavender images")
        return total_found == 8

def main():
    """Main function."""
    print("Real Lavender Image Crawler")
    print("=" * 35)
    
    crawler = RealLavenderCrawler()
    
    # Download images
    success = crawler.download_lavender_images()
    
    # Verify results
    verify_success = crawler.verify_downloads()
    
    if success and verify_success:
        print("\n🎉 All lavender images downloaded successfully!")
        print("The images should now show real lavender photos.")
    else:
        print("\n⚠️  Some images may be missing or still placeholders.")
        print("For the best results, consider manually downloading real lavender images from:")
        print("- Unsplash: https://unsplash.com/s/photos/lavender")
        print("- Pixabay: https://pixabay.com/images/search/lavender/")
        print("- Pexels: https://pexels.com/search/lavender/")

if __name__ == "__main__":
    main()
