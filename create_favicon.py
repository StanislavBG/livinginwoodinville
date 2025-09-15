#!/usr/bin/env python3
"""
Create favicon files for the website.
"""

import os
from PIL import Image, ImageDraw

def create_favicon_png():
    """Create a PNG favicon."""
    # Create a 32x32 image with transparent background
    img = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Tree trunk (brown)
    draw.rectangle([14, 24, 18, 32], fill=(139, 69, 19, 255))
    
    # Tree layers (green triangles)
    # Bottom layer
    draw.polygon([(16, 2), (4, 20), (28, 20)], fill=(34, 139, 34, 255))
    # Second layer
    draw.polygon([(16, 6), (6, 18), (26, 18)], fill=(50, 205, 50, 255))
    # Third layer
    draw.polygon([(16, 10), (8, 16), (24, 16)], fill=(34, 139, 34, 255))
    # Fourth layer
    draw.polygon([(16, 14), (10, 18), (22, 18)], fill=(50, 205, 50, 255))
    
    # Tree top (circle)
    draw.ellipse([14, 10, 18, 14], fill=(34, 139, 34, 255))
    
    # Save as PNG
    img.save('favicon.png')
    print("Created favicon.png")

def create_favicon_ico():
    """Create an ICO favicon."""
    # Create a 16x16 image for ICO
    img = Image.new('RGBA', (16, 16), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Tree trunk (brown)
    draw.rectangle([7, 12, 9, 16], fill=(139, 69, 19, 255))
    
    # Tree layers (green triangles)
    # Bottom layer
    draw.polygon([(8, 1), (2, 10), (14, 10)], fill=(34, 139, 34, 255))
    # Second layer
    draw.polygon([(8, 3), (3, 9), (13, 9)], fill=(50, 205, 50, 255))
    # Third layer
    draw.polygon([(8, 5), (4, 8), (12, 8)], fill=(34, 139, 34, 255))
    
    # Tree top (circle)
    draw.ellipse([7, 5, 9, 7], fill=(34, 139, 34, 255))
    
    # Save as ICO
    img.save('favicon.ico')
    print("Created favicon.ico")

def main():
    """Create all favicon formats."""
    print("Creating favicon files...")
    
    try:
        create_favicon_png()
        create_favicon_ico()
        print("✅ All favicon files created successfully!")
    except ImportError:
        print("❌ PIL not available. Creating simple favicon files...")
        # Create a simple text-based favicon as fallback
        with open('favicon.ico', 'w') as f:
            f.write('')  # Empty file as placeholder
        print("Created placeholder favicon.ico")

if __name__ == "__main__":
    main()
