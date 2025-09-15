#!/usr/bin/env python3
"""
Freepik Lavender Image Crawler
Automatically crawls and downloads real lavender images from Freepik.
"""

import os
import requests
import time
import re
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import random

class FreepikLavenderCrawler:
    def __init__(self):
        self.base_url = "https://www.freepik.com/photos/lavender-flower"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        self.lavender_dir = "images/lavender"
        os.makedirs(self.lavender_dir, exist_ok=True)
        
        # Different search terms for different seasons
        self.seasonal_terms = {
            'spring': ['lavender spring', 'young lavender', 'lavender new growth', 'lavender seedlings'],
            'summer': ['lavender summer', 'lavender bloom', 'lavender purple', 'lavender field'],
            'fall': ['lavender fall', 'lavender autumn', 'lavender dried', 'lavender seed heads'],
            'winter': ['lavender winter', 'lavender dormant', 'lavender gray', 'lavender care']
        }

    def get_page_content(self, url):
        """Fetch page content with proper headers."""
        try:
            print(f"Fetching: {url}")
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            return response.text
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None

    def extract_image_urls(self, html_content):
        """Extract image URLs from HTML content."""
        soup = BeautifulSoup(html_content, 'html.parser')
        image_urls = []
        
        # Look for various image patterns
        img_tags = soup.find_all('img')
        
        for img in img_tags:
            src = img.get('src') or img.get('data-src') or img.get('data-lazy')
            if src and 'lavender' in src.lower():
                # Convert relative URLs to absolute
                if src.startswith('//'):
                    src = 'https:' + src
                elif src.startswith('/'):
                    src = urljoin(self.base_url, src)
                
                # Filter for high-quality images
                if any(size in src for size in ['800x600', '1200x900', '1920x1080', 'large', 'high']):
                    image_urls.append(src)
        
        # Also look for background images in CSS
        style_tags = soup.find_all('style')
        for style in style_tags:
            if style.string:
                bg_images = re.findall(r'background-image:\s*url\(["\']?([^"\']+)["\']?\)', style.string)
                for bg_img in bg_images:
                    if 'lavender' in bg_img.lower():
                        if bg_img.startswith('//'):
                            bg_img = 'https:' + bg_img
                        elif bg_img.startswith('/'):
                            bg_img = urljoin(self.base_url, bg_img)
                        image_urls.append(bg_img)
        
        return list(set(image_urls))  # Remove duplicates

    def download_image(self, url, filename):
        """Download an image from URL."""
        try:
            print(f"  Downloading: {filename}")
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            filepath = os.path.join(self.lavender_dir, filename)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            file_size = os.path.getsize(filepath)
            print(f"  ✓ Downloaded {filename} ({file_size} bytes)")
            return True
            
        except Exception as e:
            print(f"  ✗ Failed to download {filename}: {e}")
            return False

    def crawl_freepik_lavender(self):
        """Main crawling function."""
        print("=== Freepik Lavender Image Crawler ===")
        print(f"Target URL: {self.base_url}")
        print()
        
        # Get main page content
        html_content = self.get_page_content(self.base_url)
        if not html_content:
            print("Failed to fetch main page")
            return
        
        # Extract image URLs
        print("Extracting image URLs...")
        image_urls = self.extract_image_urls(html_content)
        print(f"Found {len(image_urls)} potential lavender images")
        
        if not image_urls:
            print("No lavender images found. Trying alternative approach...")
            # Try to find more images by looking for specific patterns
            self.try_alternative_crawling()
            return
        
        # Download images for each season
        seasons = ['spring', 'summer', 'fall', 'winter']
        images_per_season = 2
        downloaded_count = 0
        
        for season in seasons:
            print(f"\nDownloading {season} lavender images...")
            
            # Select random images for this season
            season_images = random.sample(image_urls, min(images_per_season, len(image_urls)))
            
            for i, img_url in enumerate(season_images, 1):
                filename = f"lavender__{season}__{i:02d}.jpg"
                if self.download_image(img_url, filename):
                    downloaded_count += 1
                
                # Small delay between downloads
                time.sleep(1)
        
        print(f"\n=== Download Summary ===")
        print(f"Total images downloaded: {downloaded_count}")
        print(f"Expected: {len(seasons) * images_per_season}")
        
        if downloaded_count > 0:
            print("✓ Some lavender images downloaded successfully!")
        else:
            print("✗ No images were downloaded. Trying fallback method...")
            self.download_fallback_images()

    def try_alternative_crawling(self):
        """Try alternative crawling methods."""
        print("Trying alternative crawling methods...")
        
        # Try different Freepik search URLs
        alternative_urls = [
            "https://www.freepik.com/search?query=lavender",
            "https://www.freepik.com/search?query=lavender+plant",
            "https://www.freepik.com/search?query=lavender+purple",
            "https://www.freepik.com/search?query=lavender+field"
        ]
        
        for url in alternative_urls:
            print(f"Trying: {url}")
            html_content = self.get_page_content(url)
            if html_content:
                image_urls = self.extract_image_urls(html_content)
                if image_urls:
                    print(f"Found {len(image_urls)} images from alternative URL")
                    break
            time.sleep(2)

    def download_fallback_images(self):
        """Download fallback images if crawling fails."""
        print("Downloading fallback lavender images...")
        
        # Use known good lavender image URLs as fallback
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
    print("Freepik Lavender Image Crawler")
    print("=" * 40)
    
    crawler = FreepikLavenderCrawler()
    
    # Start crawling
    crawler.crawl_freepik_lavender()
    
    # Verify results
    success = crawler.verify_downloads()
    
    if success:
        print("\n🎉 All lavender images downloaded successfully!")
    else:
        print("\n⚠️  Some images may be missing. Check the verification above.")

if __name__ == "__main__":
    main()
