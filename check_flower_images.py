#!/usr/bin/env python3
"""
Script to check the current status of flower images and identify what needs to be replaced.
"""

import os
import glob

# Flower species directories
FLOWER_SPECIES = ['roses', 'lavender', 'echinacea', 'black-eyed-susan', 'salvia']
SEASONS = ['spring', 'summer', 'fall', 'winter']

def check_flower_images():
    """Check the current status of flower images."""
    print("=== Flower Images Status Check ===\n")
    
    total_expected = 0
    total_found = 0
    
    for species in FLOWER_SPECIES:
        print(f"## {species.title()}")
        species_dir = f"images/{species}"
        
        if not os.path.exists(species_dir):
            print(f"❌ Directory missing: {species_dir}")
            continue
        
        print(f"📁 Directory: {species_dir}")
        
        for season in SEASONS:
            for i in range(1, 3):  # 2 images per season
                filename = f"{species}__{season}__{i:02d}.jpg"
                filepath = os.path.join(species_dir, filename)
                
                total_expected += 1
                
                if os.path.exists(filepath):
                    file_size = os.path.getsize(filepath)
                    print(f"  ✅ {filename} ({file_size} bytes)")
                    total_found += 1
                else:
                    print(f"  ❌ {filename} - MISSING")
        
        print()
    
    print("=== Summary ===")
    print(f"Expected images: {total_expected}")
    print(f"Found images: {total_found}")
    print(f"Missing images: {total_expected - total_found}")
    
    if total_found == total_expected:
        print("🎉 All flower images are present!")
    else:
        print(f"⚠️  {total_expected - total_found} images are missing and need to be downloaded.")
        print("   Please refer to REAL_FLOWER_IMAGES_GUIDE.md for instructions.")

def check_image_quality():
    """Check if current images are likely placeholders."""
    print("\n=== Image Quality Check ===\n")
    
    placeholder_indicators = [
        "picsum", "placeholder", "lorem", "random", "unsplash.com/photo-"
    ]
    
    for species in FLOWER_SPECIES:
        species_dir = f"images/{species}"
        if not os.path.exists(species_dir):
            continue
        
        print(f"## {species.title()}")
        
        # Check if images are likely placeholders
        image_files = glob.glob(f"{species_dir}/*.jpg")
        
        if not image_files:
            print("  ❌ No images found")
            continue
        
        # Check file sizes (placeholders are often very small)
        small_files = 0
        for filepath in image_files:
            file_size = os.path.getsize(filepath)
            if file_size < 10000:  # Less than 10KB
                small_files += 1
        
        if small_files > len(image_files) / 2:
            print(f"  ⚠️  {small_files} out of {len(image_files)} images are very small (< 10KB)")
            print("     These are likely placeholder images and should be replaced with real flower photos.")
        else:
            print(f"  ✅ Image sizes look reasonable ({len(image_files)} images)")
        
        print()

if __name__ == "__main__":
    check_flower_images()
    check_image_quality()
    
    print("\n=== Next Steps ===")
    print("1. Review the REAL_FLOWER_IMAGES_GUIDE.md for detailed instructions")
    print("2. Download real flower images from the recommended sources")
    print("3. Replace the placeholder images with actual flower photos")
    print("4. Run this script again to verify all images are in place")
