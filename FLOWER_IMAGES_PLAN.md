# Flower Images Implementation Plan

## Target Flower Species
Based on the navigation template, we need images for:
1. **Roses** (Pacific Northwest varieties)
2. **Lavender** (English Lavender)
3. **Echinacea** (Purple Coneflower)
4. **Black-Eyed Susan** (Rudbeckia hirta)
5. **Salvia** (Native Sage species)

## Image Naming Convention
Follow the existing pattern: `{flower-name}__{season}__{number}.{extension}`

### Required Images per Flower:
- **Spring**: 2 images (new growth, early blooms)
- **Summer**: 2 images (peak bloom, full foliage)
- **Fall**: 2 images (late blooms, seed heads)
- **Winter**: 2 images (dormant structure, seed heads)

## Free Image Sources
1. **Unsplash** (https://unsplash.com) - High quality, free images
2. **Pexels** (https://pexels.com) - Free stock photos
3. **Pixabay** (https://pixabay.com) - Free images and vectors
4. **Wikimedia Commons** (https://commons.wikimedia.org) - Public domain images

## Search Terms for Each Flower

### Roses
- "garden roses Pacific Northwest"
- "rose bush spring growth"
- "rose flowers summer bloom"
- "rose hips fall winter"
- "rose canes winter structure"

### Lavender
- "lavender flowers garden"
- "lavender field summer"
- "lavender plant spring growth"
- "lavender seed heads fall"
- "lavender winter garden"

### Echinacea (Purple Coneflower)
- "purple coneflower garden"
- "echinacea flowers summer"
- "coneflower spring growth"
- "coneflower seed heads fall"
- "coneflower winter garden"

### Black-Eyed Susan
- "black eyed susan flowers"
- "rudbeckia garden summer"
- "black eyed susan spring"
- "rudbeckia seed heads fall"
- "black eyed susan winter"

### Salvia
- "salvia flowers garden"
- "sage flowers summer"
- "salvia spring growth"
- "salvia seed heads fall"
- "salvia winter garden"

## Image Requirements
- **Resolution**: Minimum 1200x800 pixels
- **Format**: JPG or PNG
- **Quality**: High resolution, clear focus
- **Content**: Garden settings preferred, natural lighting
- **License**: Creative Commons or Public Domain

## File Structure
```
images/
├── roses/
│   ├── roses__spring__01.jpg
│   ├── roses__spring__02.jpg
│   ├── roses__summer__01.jpg
│   ├── roses__summer__02.jpg
│   ├── roses__fall__01.jpg
│   ├── roses__fall__02.jpg
│   ├── roses__winter__01.jpg
│   └── roses__winter__02.jpg
├── lavender/
│   ├── lavender__spring__01.jpg
│   ├── lavender__spring__02.jpg
│   ├── lavender__summer__01.jpg
│   ├── lavender__summer__02.jpg
│   ├── lavender__fall__01.jpg
│   ├── lavender__fall__02.jpg
│   ├── lavender__winter__01.jpg
│   └── lavender__winter__02.jpg
├── echinacea/
│   ├── echinacea__spring__01.jpg
│   ├── echinacea__spring__02.jpg
│   ├── echinacea__summer__01.jpg
│   ├── echinacea__summer__02.jpg
│   ├── echinacea__fall__01.jpg
│   ├── echinacea__fall__02.jpg
│   ├── echinacea__winter__01.jpg
│   └── echinacea__winter__02.jpg
├── black-eyed-susan/
│   ├── black_eyed_susan__spring__01.jpg
│   ├── black_eyed_susan__spring__02.jpg
│   ├── black_eyed_susan__summer__01.jpg
│   ├── black_eyed_susan__summer__02.jpg
│   ├── black_eyed_susan__fall__01.jpg
│   ├── black_eyed_susan__fall__02.jpg
│   ├── black_eyed_susan__winter__01.jpg
│   └── black_eyed_susan__winter__02.jpg
└── salvia/
    ├── salvia__spring__01.jpg
    ├── salvia__spring__02.jpg
    ├── salvia__summer__01.jpg
    ├── salvia__summer__02.jpg
    ├── salvia__fall__01.jpg
    ├── salvia__fall__02.jpg
    ├── salvia__winter__01.jpg
    └── salvia__winter__02.jpg
```

## Implementation Steps
1. Download images from free sources using the search terms above
2. Rename images to match the naming convention
3. Place images in the appropriate directories
4. Test the flower pages to ensure images load correctly
5. Verify the PhotoWidget displays images properly

## Notes
- All images should be properly credited if required by the license
- Focus on images that show the flowers in garden settings
- Include seasonal variations to match the existing tree image pattern
- Ensure images are optimized for web use (compressed but high quality)
