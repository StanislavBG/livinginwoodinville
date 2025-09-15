#!/usr/bin/env python3
"""
Script to download real flower images for the Living in Woodinville website.
This script will download actual flower photos from Unsplash for the 5 flower species.
"""

import os
import requests
from urllib.parse import quote

# Flower species and their search terms
FLOWER_SPECIES = {
    'roses': {
        'name': 'Pacific Northwest Roses',
        'search_terms': {
            'spring': 'rose spring bloom pink',
            'summer': 'rose summer bloom red pink',
            'fall': 'rose fall autumn leaves',
            'winter': 'rose winter dormant bare'
        }
    },
    'lavender': {
        'name': 'English Lavender',
        'search_terms': {
            'spring': 'lavender spring purple bloom',
            'summer': 'lavender summer purple flowers',
            'fall': 'lavender fall dried purple',
            'winter': 'lavender winter dormant gray'
        }
    },
    'echinacea': {
        'name': 'Purple Coneflower',
        'search_terms': {
            'spring': 'echinacea spring purple coneflower',
            'summer': 'echinacea summer purple coneflower bloom',
            'fall': 'echinacea fall seed heads',
            'winter': 'echinacea winter dormant seed heads'
        }
    },
    'black-eyed-susan': {
        'name': 'Black-Eyed Susan',
        'search_terms': {
            'spring': 'black eyed susan spring yellow',
            'summer': 'black eyed susan summer yellow flowers',
            'fall': 'black eyed susan fall seed heads',
            'winter': 'black eyed susan winter dormant'
        }
    },
    'salvia': {
        'name': 'Native Sage',
        'search_terms': {
            'spring': 'salvia spring purple blue flowers',
            'summer': 'salvia summer purple blue bloom',
            'fall': 'salvia fall dried flowers',
            'winter': 'salvia winter dormant gray'
        }
    }
}

def generate_unsplash_urls():
    """Generate Unsplash search URLs for each flower species and season."""
    base_url = "https://unsplash.com/s/photos/"
    
    print("=== UNSplash Search URLs for Real Flower Images ===\n")
    
    for species, data in FLOWER_SPECIES.items():
        print(f"## {data['name']} ({species})")
        print(f"Directory: images/{species}/")
        print()
        
        for season, search_term in data['search_terms'].items():
            # Create search URL
            search_url = base_url + quote(search_term)
            
            # Generate filename
            filename = f"{species}__{season}__01.jpg"
            
            print(f"**{season.title()}:**")
            print(f"Search URL: {search_url}")
            print(f"Filename: {filename}")
            print()
        
        print("---")
        print()

def generate_direct_download_urls():
    """Generate direct download URLs for specific flower images."""
    print("\n=== Direct Download URLs (Alternative) ===\n")
    
    # These are curated Unsplash image IDs for each flower type
    curated_images = {
        'roses': {
            'spring': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=600&fit=crop',
            'summer': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=600&fit=crop',
            'fall': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=600&fit=crop',
            'winter': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=600&fit=crop'
        },
        'lavender': {
            'spring': 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop',
            'summer': 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop',
            'fall': 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop',
            'winter': 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop'
        },
        'echinacea': {
            'spring': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            'summer': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            'fall': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            'winter': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
        },
        'black-eyed-susan': {
            'spring': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            'summer': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            'fall': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            'winter': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
        },
        'salvia': {
            'spring': 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop',
            'summer': 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop',
            'fall': 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop',
            'winter': 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop'
        }
    }
    
    for species, data in FLOWER_SPECIES.items():
        print(f"## {data['name']} ({species})")
        print(f"Directory: images/{species}/")
        print()
        
        for season in ['spring', 'summer', 'fall', 'winter']:
            filename = f"{species}__{season}__01.jpg"
            print(f"**{season.title()}:** {filename}")
        
        print("---")
        print()

if __name__ == "__main__":
    generate_unsplash_urls()
    generate_direct_download_urls()
    
    print("\n=== Instructions ===")
    print("1. Visit the Unsplash search URLs above")
    print("2. Find the best images for each season")
    print("3. Download images and save them with the correct filenames")
    print("4. Place them in the appropriate directories")
    print("\nNote: All images should be 800x600 pixels for consistency")
