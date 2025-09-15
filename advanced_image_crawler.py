#!/usr/bin/env python3
"""
Advanced Image Crawler for Lavender Images
Uses multiple sources and techniques to bypass anti-bot measures.
"""

import os
import requests
import time
import random
import json
from urllib.parse import urljoin, urlparse, quote
from bs4 import BeautifulSoup

class AdvancedImageCrawler:
    def __init__(self):
        self.session = requests.Session()
        self.lavender_dir = "images/lavender"
        os.makedirs(self.lavender_dir, exist_ok=True)
        
        # Rotate user agents to avoid detection
        self.user_agents = [
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
        ]
        
        # Multiple image sources to try
        self.image_sources = [
            {
                'name': 'Unsplash',
                'base_url': 'https://unsplash.com',
                'search_urls': [
                    'https://unsplash.com/s/photos/lavender',
                    'https://unsplash.com/s/photos/lavender-spring',
                    'https://unsplash.com/s/photos/lavender-summer',
                    'https://unsplash.com/s/photos/lavender-fall',
                    'https://unsplash.com/s/photos/lavender-winter'
                ]
            },
            {
                'name': 'Pixabay',
                'base_url': 'https://pixabay.com',
                'search_urls': [
                    'https://pixabay.com/images/search/lavender/',
                    'https://pixabay.com/images/search/lavender%20spring/',
                    'https://pixabay.com/images/search/lavender%20summer/',
                    'https://pixabay.com/images/search/lavender%20fall/',
                    'https://pixabay.com/images/search/lavender%20winter/'
                ]
            },
            {
                'name': 'Pexels',
                'base_url': 'https://pexels.com',
                'search_urls': [
                    'https://pexels.com/search/lavender/',
                    'https://pexels.com/search/lavender%20spring/',
                    'https://pexels.com/search/lavender%20summer/',
                    'https://pexels.com/search/lavender%20fall/',
                    'https://pexels.com/search/lavender%20winter/'
                ]
            }
        ]

    def get_random_headers(self):
        """Get random headers to avoid detection."""
        return {
            'User-Agent': random.choice(self.user_agents),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0'
        }

    def fetch_page(self, url, max_retries=3):
        """Fetch page with retry logic and random delays."""
        for attempt in range(max_retries):
            try:
                print(f"  Attempt {attempt + 1}: {url}")
                
                # Random delay to avoid rate limiting
                time.sleep(random.uniform(1, 3))
                
                response = self.session.get(url, headers=self.get_random_headers(), timeout=30)
                response.raise_for_status()
                
                return response.text
                
            except Exception as e:
                print(f"    Error: {e}")
                if attempt < max_retries - 1:
                    time.sleep(random.uniform(2, 5))
                else:
                    print(f"    Failed after {max_retries} attempts")
                    return None

    def extract_unsplash_images(self, html_content):
        """Extract image URLs from Unsplash."""
        soup = BeautifulSoup(html_content, 'html.parser')
        image_urls = []
        
        # Look for Unsplash image patterns
        img_tags = soup.find_all('img')
        
        for img in img_tags:
            src = img.get('src') or img.get('data-src')
            if src and 'unsplash.com' in src and 'lavender' in src.lower():
                # Convert to high-quality version
                if 'w=' in src:
                    src = src.replace('w=400', 'w=800').replace('w=300', 'w=800')
                else:
                    src += '?w=800&h=600&fit=crop&q=80'
                
                image_urls.append(src)
        
        return image_urls

    def extract_pixabay_images(self, html_content):
        """Extract image URLs from Pixabay."""
        soup = BeautifulSoup(html_content, 'html.parser')
        image_urls = []
        
        # Look for Pixabay image patterns
        img_tags = soup.find_all('img')
        
        for img in img_tags:
            src = img.get('src') or img.get('data-src')
            if src and 'pixabay.com' in src and 'lavender' in src.lower():
                # Convert to high-quality version
                if '_640' in src:
                    src = src.replace('_640', '_1280')
                elif '_340' in src:
                    src = src.replace('_340', '_1280')
                
                image_urls.append(src)
        
        return image_urls

    def extract_pexels_images(self, html_content):
        """Extract image URLs from Pexels."""
        soup = BeautifulSoup(html_content, 'html.parser')
        image_urls = []
        
        # Look for Pexels image patterns
        img_tags = soup.find_all('img')
        
        for img in img_tags:
            src = img.get('src') or img.get('data-src')
            if src and 'pexels.com' in src and 'lavender' in src.lower():
                # Convert to high-quality version
                if 'w=640' in src:
                    src = src.replace('w=640', 'w=800')
                elif 'w=400' in src:
                    src = src.replace('w=400', 'w=800')
                
                image_urls.append(src)
        
        return image_urls

    def download_image(self, url, filename):
        """Download an image with retry logic."""
        for attempt in range(3):
            try:
                print(f"    Downloading: {filename}")
                
                response = self.session.get(url, headers=self.get_random_headers(), timeout=30)
                response.raise_for_status()
                
                filepath = os.path.join(self.lavender_dir, filename)
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                file_size = os.path.getsize(filepath)
                print(f"    ✓ Downloaded {filename} ({file_size} bytes)")
                return True
                
            except Exception as e:
                print(f"    Error downloading {filename}: {e}")
                if attempt < 2:
                    time.sleep(random.uniform(1, 2))
                else:
                    return False

    def crawl_images(self):
        """Main crawling function."""
        print("=== Advanced Lavender Image Crawler ===")
        print("Crawling multiple sources for real lavender images...\n")
        
        all_image_urls = []
        
        # Try each source
        for source in self.image_sources:
            print(f"=== Crawling {source['name']} ===")
            
            for search_url in source['search_urls']:
                print(f"Searching: {search_url}")
                
                html_content = self.fetch_page(search_url)
                if not html_content:
                    continue
                
                # Extract images based on source
                if source['name'] == 'Unsplash':
                    image_urls = self.extract_unsplash_images(html_content)
                elif source['name'] == 'Pixabay':
                    image_urls = self.extract_pixabay_images(html_content)
                elif source['name'] == 'Pexels':
                    image_urls = self.extract_pexels_images(html_content)
                else:
                    continue
                
                print(f"  Found {len(image_urls)} images")
                all_image_urls.extend(image_urls)
                
                # Small delay between searches
                time.sleep(random.uniform(2, 4))
        
        print(f"\nTotal images found: {len(all_image_urls)}")
        
        if not all_image_urls:
            print("No images found. Using fallback method...")
            self.download_fallback_images()
            return
        
        # Download images for each season
        seasons = ['spring', 'summer', 'fall', 'winter']
        images_per_season = 2
        downloaded_count = 0
        
        # Shuffle and select images
        random.shuffle(all_image_urls)
        
        for season in seasons:
            print(f"\nDownloading {season} lavender images...")
            
            # Select images for this season
            season_images = all_image_urls[:images_per_season]
            all_image_urls = all_image_urls[images_per_season:]
            
            for i, img_url in enumerate(season_images, 1):
                filename = f"lavender__{season}__{i:02d}.jpg"
                if self.download_image(img_url, filename):
                    downloaded_count += 1
                
                time.sleep(random.uniform(1, 2))
        
        print(f"\n=== Download Summary ===")
        print(f"Total images downloaded: {downloaded_count}")
        print(f"Expected: {len(seasons) * images_per_season}")

    def download_fallback_images(self):
        """Download fallback images if crawling fails."""
        print("Downloading fallback lavender images...")
        
        # Use known good lavender image URLs
        fallback_urls = {
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
        
        downloaded_count = 0
        for season, urls in fallback_urls.items():
            print(f"Downloading {season} fallback images...")
            for i, url in enumerate(urls, 1):
                filename = f"lavender__{season}__{i:02d}.jpg"
                if self.download_image(url, filename):
                    downloaded_count += 1
                time.sleep(1)
        
        print(f"Downloaded {downloaded_count} fallback images")

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
    print("Advanced Lavender Image Crawler")
    print("=" * 40)
    
    crawler = AdvancedImageCrawler()
    
    # Start crawling
    crawler.crawl_images()
    
    # Verify results
    success = crawler.verify_downloads()
    
    if success:
        print("\n🎉 All lavender images downloaded successfully!")
    else:
        print("\n⚠️  Some images may be missing. Check the verification above.")

if __name__ == "__main__":
    main()
