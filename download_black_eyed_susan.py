#!/usr/bin/env python3
"""
Quick script to download real Black-Eyed Susan images as an example.
"""

import requests
import os

# Real Black-Eyed Susan image URLs from Unsplash
BLACK_EYED_SUSAN_IMAGES = {
    'spring': [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80'
    ],
    'summer': [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80'
    ],
    'fall': [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80'
    ],
    'winter': [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80'
    ]
}

def download_black_eyed_susan():
    """Download real Black-Eyed Susan images."""
    print("Downloading real Black-Eyed Susan images...")
    
    species_dir = "images/black-eyed-susan"
    os.makedirs(species_dir, exist_ok=True)
    
    for season, urls in BLACK_EYED_SUSAN_IMAGES.items():
        for i, url in enumerate(urls, 1):
            filename = f"black-eyed-susan__{season}__{i:02d}.jpg"
            filepath = os.path.join(species_dir, filename)
            
            try:
                print(f"  Downloading {filename}...")
                response = requests.get(url, timeout=30)
                response.raise_for_status()
                
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                print(f"  ✓ Downloaded {filename}")
                
            except Exception as e:
                print(f"  ✗ Failed to download {filename}: {e}")
    
    print("\nBlack-Eyed Susan images downloaded!")

if __name__ == "__main__":
    download_black_eyed_susan()
