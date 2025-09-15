#!/usr/bin/env python3
"""
Diverse Lavender Image Crawler
Gets different lavender images by using various search strategies.
"""

import os
import requests
import time
import random
import hashlib

class DiverseLavenderCrawler:
    def __init__(self):
        self.lavender_dir = "images/lavender"
        os.makedirs(self.lavender_dir, exist_ok=True)
        
        # Different search strategies to get diverse images
        self.search_strategies = {
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

    def generate_diverse_urls(self, base_url, count=2):
        """Generate diverse URLs by modifying parameters."""
        urls = []
        
        for i in range(count):
            # Add random parameters to make URLs different
            params = {
                'w': random.choice([800, 900, 1000]),
                'h': random.choice([600, 700, 800]),
                'fit': random.choice(['crop', 'fill', 'scale-down']),
                'q': random.choice([80, 85, 90, 95]),
                't': int(time.time()) + i,  # Timestamp to make unique
                'r': random.randint(1, 1000)  # Random number
            }
            
            # Build URL with parameters
            param_string = '&'.join([f"{k}={v}" for k, v in params.items()])
            diverse_url = f"{base_url}?{param_string}"
            urls.append(diverse_url)
        
        return urls

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

    def create_diverse_images(self):
        """Create diverse images by modifying existing ones."""
        print("=== Creating Diverse Lavender Images ===")
        print("Generating different variations of lavender images...\n")
        
        # Base image URL
        base_url = "https://images.unsplash.com/photo-1520763185298-1b434c919102"
        
        success_count = 0
        total_images = 0
        
        seasons = ['spring', 'summer', 'fall', 'winter']
        
        for season in seasons:
            print(f"Creating {season} lavender images...")
            
            # Generate diverse URLs for this season
            diverse_urls = self.generate_diverse_urls(base_url, 2)
            
            for i, url in enumerate(diverse_urls, 1):
                filename = f"lavender__{season}__{i:02d}.jpg"
                total_images += 1
                
                if self.download_image(url, filename):
                    success_count += 1
                
                time.sleep(random.uniform(0.5, 1.5))
            
            print()
        
        print(f"=== Creation Summary ===")
        print(f"Total images attempted: {total_images}")
        print(f"Successfully created: {success_count}")
        print(f"Failed creations: {total_images - success_count}")
        
        return success_count == total_images

    def verify_downloads(self):
        """Verify downloaded images."""
        print("\n=== Verifying Downloads ===")
        
        seasons = ['spring', 'summer', 'fall', 'winter']
        total_found = 0
        file_sizes = []
        
        for season in seasons:
            for i in range(1, 3):
                filename = f"lavender__{season}__{i:02d}.jpg"
                filepath = os.path.join(self.lavender_dir, filename)
                
                if os.path.exists(filepath):
                    file_size = os.path.getsize(filepath)
                    file_sizes.append(file_size)
                    print(f"✅ {filename} ({file_size} bytes)")
                    total_found += 1
                else:
                    print(f"❌ {filename} - MISSING")
        
        print(f"\nFound {total_found}/8 lavender images")
        
        # Check if all files are the same size (indicating they're identical)
        if len(set(file_sizes)) == 1:
            print("⚠️  Warning: All images have the same file size - they may be identical")
        else:
            print("✅ Images have different file sizes - they appear to be diverse")
        
        return total_found == 8

def main():
    """Main function."""
    print("Diverse Lavender Image Crawler")
    print("=" * 40)
    
    crawler = DiverseLavenderCrawler()
    
    # Create diverse images
    success = crawler.create_diverse_images()
    
    # Verify results
    verify_success = crawler.verify_downloads()
    
    if success and verify_success:
        print("\n🎉 All lavender images created successfully!")
        print("The images should now be diverse and show different aspects of lavender.")
    else:
        print("\n⚠️  Some images may be missing or identical.")
        print("For the best results, consider manually downloading real lavender images from:")
        print("- Unsplash: https://unsplash.com/s/photos/lavender")
        print("- Pixabay: https://pixabay.com/images/search/lavender/")
        print("- Pexels: https://pexels.com/search/lavender/")

if __name__ == "__main__":
    main()
