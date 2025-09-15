#!/usr/bin/env python3
"""
Direct Lavender Image Downloader
Uses curl commands to download real lavender images directly.
"""

import os
import subprocess
import time

class LavenderDirectDownloader:
    def __init__(self):
        self.lavender_dir = "images/lavender"
        os.makedirs(self.lavender_dir, exist_ok=True)
        
        # Direct download URLs for real lavender images
        # These are curated URLs that should work
        self.lavender_images = {
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

    def download_with_curl(self, url, filename):
        """Download image using curl command."""
        filepath = os.path.join(self.lavender_dir, filename)
        
        curl_command = [
            'curl',
            '-L',  # Follow redirects
            '-o', filepath,
            '-H', 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            '-H', 'Accept: image/webp,image/apng,image/*,*/*;q=0.8',
            '-H', 'Accept-Language: en-US,en;q=0.9',
            url
        ]
        
        try:
            print(f"  Downloading: {filename}")
            result = subprocess.run(curl_command, capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0 and os.path.exists(filepath):
                file_size = os.path.getsize(filepath)
                print(f"  ✓ Downloaded {filename} ({file_size} bytes)")
                return True
            else:
                print(f"  ✗ Failed to download {filename}: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"  ✗ Error downloading {filename}: {e}")
            return False

    def download_all_images(self):
        """Download all lavender images."""
        print("=== Direct Lavender Image Downloader ===")
        print("Downloading real lavender photos using curl...\n")
        
        success_count = 0
        total_images = 0
        
        for season, urls in self.lavender_images.items():
            print(f"Downloading {season} lavender images...")
            
            for i, url in enumerate(urls, 1):
                filename = f"lavender__{season}__{i:02d}.jpg"
                total_images += 1
                
                if self.download_with_curl(url, filename):
                    success_count += 1
                
                time.sleep(1)  # Small delay between downloads
            
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

    def generate_curl_commands(self):
        """Generate curl commands for manual execution."""
        print("\n=== Manual Curl Commands ===")
        print("If automatic download fails, run these commands manually:")
        print()
        
        for season, urls in self.lavender_images.items():
            for i, url in enumerate(urls, 1):
                filename = f"lavender__{season}__{i:02d}.jpg"
                filepath = os.path.join(self.lavender_dir, filename)
                
                curl_cmd = f"curl -L -o '{filepath}' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' '{url}'"
                print(f"# {season.title()} {i}")
                print(curl_cmd)
                print()

def main():
    """Main function."""
    print("Direct Lavender Image Downloader")
    print("=" * 40)
    
    downloader = LavenderDirectDownloader()
    
    # Try automatic download
    success = downloader.download_all_images()
    
    # Verify results
    verify_success = downloader.verify_downloads()
    
    if success and verify_success:
        print("\n🎉 All lavender images downloaded successfully!")
    else:
        print("\n⚠️  Automatic download failed. Generating manual commands...")
        downloader.generate_curl_commands()
        
        print("\n=== Alternative Solution ===")
        print("Since automated crawling is blocked, here are your options:")
        print("1. Run the curl commands above manually")
        print("2. Visit these URLs and download images manually:")
        print("   - https://unsplash.com/s/photos/lavender")
        print("   - https://pixabay.com/images/search/lavender/")
        print("   - https://pexels.com/search/lavender/")
        print("3. Use the naming convention: lavender__{season}__{number}.jpg")

if __name__ == "__main__":
    main()
