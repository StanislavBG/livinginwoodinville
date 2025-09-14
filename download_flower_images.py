#!/usr/bin/env python3
"""
Flower Images Download Script
This script helps you download flower images from Unsplash and organize them properly.
"""

import os
import requests
from urllib.parse import quote

# Image search terms and target filenames
FLOWER_IMAGES = {
    'roses': {
        'spring': [
            ('rose bush spring new growth', 'roses__spring__01.jpg'),
            ('rose buds spring garden', 'roses__spring__02.jpg')
        ],
        'summer': [
            ('garden roses summer bloom', 'roses__summer__01.jpg'),
            ('rose flowers garden summer', 'roses__summer__02.jpg')
        ],
        'fall': [
            ('rose hips fall autumn', 'roses__fall__01.jpg'),
            ('fall roses garden autumn', 'roses__fall__02.jpg')
        ],
        'winter': [
            ('rose canes winter garden', 'roses__winter__01.jpg'),
            ('winter rose bush structure', 'roses__winter__02.jpg')
        ]
    },
    'lavender': {
        'spring': [
            ('lavender spring new growth', 'lavender__spring__01.jpg'),
            ('lavender plant spring garden', 'lavender__spring__02.jpg')
        ],
        'summer': [
            ('lavender field summer purple', 'lavender__summer__01.jpg'),
            ('lavender flowers garden summer', 'lavender__summer__02.jpg')
        ],
        'fall': [
            ('lavender seed heads fall', 'lavender__fall__01.jpg'),
            ('fall lavender garden autumn', 'lavender__fall__02.jpg')
        ],
        'winter': [
            ('winter lavender garden dormant', 'lavender__winter__01.jpg'),
            ('lavender winter structure garden', 'lavender__winter__02.jpg')
        ]
    },
    'echinacea': {
        'spring': [
            ('coneflower spring new growth', 'echinacea__spring__01.jpg'),
            ('echinacea plant spring garden', 'echinacea__spring__02.jpg')
        ],
        'summer': [
            ('purple coneflower summer bloom', 'echinacea__summer__01.jpg'),
            ('echinacea flowers garden summer', 'echinacea__summer__02.jpg')
        ],
        'fall': [
            ('coneflower seed heads fall', 'echinacea__fall__01.jpg'),
            ('fall echinacea garden autumn', 'echinacea__fall__02.jpg')
        ],
        'winter': [
            ('winter coneflower garden dormant', 'echinacea__winter__01.jpg'),
            ('echinacea winter structure garden', 'echinacea__winter__02.jpg')
        ]
    },
    'black-eyed-susan': {
        'spring': [
            ('black eyed susan spring new growth', 'black_eyed_susan__spring__01.jpg'),
            ('rudbeckia spring garden new growth', 'black_eyed_susan__spring__02.jpg')
        ],
        'summer': [
            ('black eyed susan flowers summer', 'black_eyed_susan__summer__01.jpg'),
            ('rudbeckia garden summer bloom', 'black_eyed_susan__summer__02.jpg')
        ],
        'fall': [
            ('black eyed susan seed heads fall', 'black_eyed_susan__fall__01.jpg'),
            ('fall rudbeckia garden autumn', 'black_eyed_susan__fall__02.jpg')
        ],
        'winter': [
            ('winter black eyed susan garden', 'black_eyed_susan__winter__01.jpg'),
            ('rudbeckia winter garden dormant', 'black_eyed_susan__winter__02.jpg')
        ]
    },
    'salvia': {
        'spring': [
            ('sage spring new growth garden', 'salvia__spring__01.jpg'),
            ('salvia plant spring garden', 'salvia__spring__02.jpg')
        ],
        'summer': [
            ('sage flowers summer garden', 'salvia__summer__01.jpg'),
            ('salvia garden summer bloom', 'salvia__summer__02.jpg')
        ],
        'fall': [
            ('sage seed heads fall', 'salvia__fall__01.jpg'),
            ('fall salvia garden autumn', 'salvia__fall__02.jpg')
        ],
        'winter': [
            ('winter sage garden dormant', 'salvia__winter__01.jpg'),
            ('salvia winter structure garden', 'salvia__winter__02.jpg')
        ]
    }
}

def create_directories():
    """Create image directories for each flower"""
    for flower in FLOWER_IMAGES.keys():
        dir_path = f"images/{flower}"
        os.makedirs(dir_path, exist_ok=True)
        print(f"✅ Created directory: {dir_path}")

def generate_unsplash_urls():
    """Generate Unsplash search URLs for each image"""
    print("\n🔍 UNSplash Search URLs for Flower Images:")
    print("=" * 60)
    
    for flower, seasons in FLOWER_IMAGES.items():
        print(f"\n🌺 {flower.upper().replace('-', ' ')}")
        print("-" * 40)
        
        for season, images in seasons.items():
            print(f"\n{season.title()}:")
            for search_term, filename in images:
                encoded_term = quote(search_term)
                url = f"https://unsplash.com/s/photos/{encoded_term}"
                print(f"  📸 {filename}")
                print(f"     Search: '{search_term}'")
                print(f"     URL: {url}")
                print()

def main():
    """Main function"""
    print("🌸 Flower Images Download Helper")
    print("=" * 40)
    
    # Create directories
    create_directories()
    
    # Generate search URLs
    generate_unsplash_urls()
    
    print("\n📋 INSTRUCTIONS:")
    print("1. Visit the URLs above")
    print("2. Find high-quality garden images")
    print("3. Download and rename to match the filenames")
    print("4. Place in the correct directories")
    print("5. Test your site!")
    
    print("\n🎯 QUICK START:")
    print("1. Go to: https://unsplash.com")
    print("2. Search for: 'rose bush spring new growth'")
    print("3. Download the best image")
    print("4. Rename to: roses__spring__01.jpg")
    print("5. Place in: images/roses/")

if __name__ == "__main__":
    main()
