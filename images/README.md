# Image Folder Structure

This directory contains organized folders for each tree species with their seasonal photos.

## Folder Structure

```
images/
├── douglas-fir/
│   ├── douglas_fir__spring__01.jpeg
│   ├── douglas_fir__summer__01.jpeg
│   ├── douglas_fir__fall__01.jpeg
│   └── douglas_fir__winter__01.jpeg
├── western-red-cedar/
│   └── [seasonal photos]
├── bigleaf-maple/
│   └── [seasonal photos]
├── pacific-madrone/
│   └── [seasonal photos]
├── vine-maple/
│   └── [seasonal photos]
└── red-alder/
    └── [seasonal photos]
```

## File Naming Convention

**Format:** `{tree_slug}__{season}__{number}.{extension}`

### Examples:
- `douglas_fir__winter__01.jpeg`
- `western_red_cedar__spring__01.jpeg`
- `bigleaf_maple__fall__01.jpeg`

### Tree Slugs:
- `douglas_fir` (folder: `douglas-fir`)
- `western_red_cedar` (folder: `western-red-cedar`)
- `bigleaf_maple` (folder: `bigleaf-maple`)
- `pacific_madrone` (folder: `pacific-madrone`)
- `vine_maple` (folder: `vine-maple`)
- `red_alder` (folder: `red-alder`)

### Seasons:
- `spring`
- `summer`
- `fall`
- `winter`

## Adding Photos

1. Place your photo in the appropriate tree folder
2. Use the naming convention: `{tree_slug}__{season}__01.jpeg`
3. The website will automatically display it when users click the season button

## Multiple Photos Per Season

You can add multiple photos for each season by using numbered suffixes:

### Examples:
- `douglas_fir__spring__01.jpeg` (first spring photo)
- `douglas_fir__spring__02.jpeg` (second spring photo)
- `douglas_fir__summer__01.jpeg` (first summer photo)
- `douglas_fir__summer__02.jpeg` (second summer photo)
- `douglas_fir__fall__01.jpeg` (first fall photo)
- `douglas_fir__fall__02.jpeg` (second fall photo)
- `douglas_fir__winter__01.jpeg` (first winter photo)
- `douglas_fir__winter__02.jpeg` (second winter photo)

### Gallery Navigation:
- When multiple photos exist for a season, navigation arrows will appear
- Users can browse through all available photos for that season
- Photo counter shows current position (e.g., "2 / 3")
- Navigation automatically hides when only one photo is available

## Supported Formats
- JPEG (.jpeg, .jpg)
- PNG (.png)
- Recommended size: 800x600px or larger
