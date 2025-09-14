#!/usr/bin/env python3
"""
Quick Sample Image Download Script
This script downloads a few sample images to get you started.
"""

import os
import requests
from urllib.parse import quote

# Sample images to download (just a few to get started)
SAMPLE_IMAGES = [
    {
        'search_term': 'rose bush spring new growth',
        'filename': 'roses__spring__01.jpg',
        'directory': 'images/roses'
    },
    {
        'search_term': 'lavender field summer purple',
        'filename': 'lavender__summer__01.jpg',
        'directory': 'images/lavender'
    },
    {
        'search_term': 'purple coneflower summer bloom',
        'filename': 'echinacea__summer__01.jpg',
        'directory': 'images/echinacea'
    },
    {
        'search_term': 'black eyed susan flowers summer',
        'filename': 'black_eyed_susan__summer__01.jpg',
        'directory': 'images/black-eyed-susan'
    },
    {
        'search_term': 'sage flowers summer garden',
        'filename': 'salvia__summer__01.jpg',
        'directory': 'images/salvia'
    }
]

def download_sample_images():
    """Download sample images from Unsplash"""
    print("🌸 Downloading Sample Flower Images...")
    print("=" * 50)
    
    for i, image in enumerate(SAMPLE_IMAGES, 1):
        print(f"\n{i}. {image['filename']}")
        print(f"   Search: '{image['search_term']}'")
        
        # Create directory if it doesn't exist
        os.makedirs(image['directory'], exist_ok=True)
        
        # Generate Unsplash search URL
        encoded_term = quote(image['search_term'])
        search_url = f"https://unsplash.com/s/photos/{encoded_term}"
        
        print(f"   URL: {search_url}")
        print(f"   Directory: {image['directory']}")
        print("   ⚠️  Please visit the URL above and download manually")
        print("   ⚠️  Rename the downloaded file to:", image['filename'])
        print("   ⚠️  Place it in:", image['directory'])

def main():
    """Main function"""
    print("🎯 QUICK SAMPLE IMAGE DOWNLOAD")
    print("=" * 40)
    print("This script provides direct links to download sample images.")
    print("Since I can't directly download images, I'll give you the exact URLs.")
    print()
    
    download_sample_images()
    
    print("\n" + "=" * 50)
    print("📋 NEXT STEPS:")
    print("1. Visit each URL above")
    print("2. Download the best image you find")
    print("3. Rename it to the specified filename")
    print("4. Place it in the specified directory")
    print("5. Test your site!")
    
    print("\n🎯 QUICK TEST:")
    print("1. Download just ONE image (roses__spring__01.jpg)")
    print("2. Place it in images/roses/")
    print("3. Visit: http://localhost:3000/roses")
    print("4. See if the image loads!")

if __name__ == "__main__":
    main()
