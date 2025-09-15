# Real Flower Images Guide

## The Problem
The current flower images are random placeholder images from Picsum Photos, not actual photos of the flower species. We need to replace them with real, accurate images of each flower species.

## Flower Species in Our Data
We have 5 flower species that need real images:

1. **Roses** (Pacific Northwest Roses) - `images/roses/`
2. **Lavender** (English Lavender) - `images/lavender/`
3. **Echinacea** (Purple Coneflower) - `images/echinacea/`
4. **Black-Eyed Susan** (Rudbeckia hirta) - `images/black-eyed-susan/`
5. **Salvia** (Native Sage) - `images/salvia/`

## Required Images Per Species
Each species needs 6 images (2 per season):
- `{species}__spring__01.jpg`
- `{species}__spring__02.jpg`
- `{species}__summer__01.jpg`
- `{species}__summer__02.jpg`
- `{species}__fall__01.jpg`
- `{species}__fall__02.jpg`
- `{species}__winter__01.jpg`
- `{species}__winter__02.jpg`

## Recommended Image Sources

### 1. Unsplash (Free, High Quality)
- **Website**: https://unsplash.com
- **Search Terms**:
  - Roses: "rose spring bloom", "rose summer flowers", "rose fall leaves", "rose winter dormant"
  - Lavender: "lavender spring purple", "lavender summer bloom", "lavender fall dried", "lavender winter gray"
  - Echinacea: "echinacea purple coneflower", "echinacea summer bloom", "echinacea fall seed heads", "echinacea winter dormant"
  - Black-Eyed Susan: "black eyed susan yellow", "rudbeckia summer", "black eyed susan fall", "black eyed susan winter"
  - Salvia: "salvia purple blue", "salvia summer bloom", "salvia fall dried", "salvia winter dormant"

### 2. Pixabay (Free, High Quality)
- **Website**: https://pixabay.com
- **Search Terms**: Same as above
- **Advantage**: Often has more diverse seasonal images

### 3. Pexels (Free, High Quality)
- **Website**: https://pexels.com
- **Search Terms**: Same as above
- **Advantage**: Good selection of garden and flower photos

## Image Requirements
- **Size**: 800x600 pixels (or similar aspect ratio)
- **Format**: JPG
- **Quality**: High resolution, clear, well-lit
- **Content**: Actual photos of the specific flower species
- **Seasonal Accuracy**: Images should represent the actual appearance in each season

## Step-by-Step Process

### Step 1: Download Images
1. Visit one of the recommended image sources
2. Search for each flower species using the search terms above
3. Download 2 images for each season (8 total per species)
4. Save them with the exact filenames listed above

### Step 2: Organize Images
1. Create the directory structure if it doesn't exist:
   ```
   images/
   ├── roses/
   ├── lavender/
   ├── echinacea/
   ├── black-eyed-susan/
   └── salvia/
   ```

2. Place each image in its correct directory with the correct filename

### Step 3: Verify Images
1. Check that all images are actual photos of the flower species
2. Ensure seasonal accuracy (spring = new growth, summer = full bloom, fall = seed heads/leaves, winter = dormant)
3. Verify image quality and clarity

## Alternative: Use AI-Generated Images
If you prefer, you can use AI image generation tools like:
- **DALL-E 3** (via ChatGPT Plus)
- **Midjourney**
- **Stable Diffusion**

**Prompt Examples**:
- "Professional photograph of English lavender in spring, purple flowers, garden setting, high quality"
- "Close-up photo of purple coneflower (echinacea) in summer bloom, natural lighting"
- "Black-eyed susan flowers in fall with seed heads, garden photography"

## Current Status
- ❌ Current images are random placeholders
- ❌ Images don't represent actual flower species
- ❌ Seasonal accuracy is missing
- ✅ Directory structure exists
- ✅ Filename convention is correct

## Next Steps
1. Download real flower images using the sources above
2. Replace the placeholder images in each directory
3. Test the website to ensure images load correctly
4. Verify that the PhotoWidget displays the correct images

## Quality Checklist
- [ ] All images are actual photos of the specific flower species
- [ ] Images represent the correct season (spring growth, summer bloom, fall seed heads, winter dormant)
- [ ] Image quality is high and professional
- [ ] All filenames follow the correct convention
- [ ] Images are properly sized (800x600 or similar)
- [ ] All 8 images per species are present (2 per season)

## Notes
- The PhotoWidget will automatically detect and display these images
- Images should be optimized for web use (not too large file sizes)
- Consider the visual consistency across all images
- Ensure images represent the Pacific Northwest/Washington climate context
