# Tree Page Template System

This directory contains a reusable template system for creating consistent tree pages across the Living in Woodinville website.

## Files

- **`tree-template.html`** - The HTML template with placeholder variables
- **`tree-data.json`** - JSON data file containing information for each tree
- **`generate-tree-page.py`** - Python script to generate individual tree pages
- **`README.md`** - This documentation file

## How to Use

### 1. Add New Tree Data

Edit `tree-data.json` to add information for a new tree:

```json
{
  "tree-slug": {
    "TREE_NAME": "Tree Name",
    "SCIENTIFIC_NAME": "Scientific name",
    "DESCRIPTION": "Brief description",
    "ABOUT_PARAGRAPH": "Detailed about paragraph...",
    "HEIGHT": "Height information",
    "LEAVES_DESCRIPTION": "Description of leaves/needles",
    "BARK_DESCRIPTION": "Description of bark",
    "FRUIT_DESCRIPTION": "Description of fruit/cones",
    "ADDITIONAL_IDENTIFICATION": "<li>Additional identification features</li>",
    "GROWING_CONDITIONS": "Growing conditions paragraph...",
    "LOCATION_INFO": "Where to find them paragraph...",
    "WILDLIFE_VALUE": "Wildlife value paragraph...",
    "SEASONAL_INTRO": "Introduction to seasonal section...",
    "SPRING_DESCRIPTION": "Spring description...",
    "SPRING_CHARACTERISTICS": "<li>Spring characteristic 1</li><li>Spring characteristic 2</li>",
    "SUMMER_DESCRIPTION": "Summer description...",
    "SUMMER_CHARACTERISTICS": "<li>Summer characteristic 1</li><li>Summer characteristic 2</li>",
    "FALL_DESCRIPTION": "Fall description...",
    "FALL_CHARACTERISTICS": "<li>Fall characteristic 1</li><li>Fall characteristic 2</li>",
    "WINTER_DESCRIPTION": "Winter description...",
    "WINTER_CHARACTERISTICS": "<li>Winter characteristic 1</li><li>Winter characteristic 2</li>",
    "PHOTOGRAPHY_INTRO": "Photography introduction...",
    "PHOTOGRAPHY_TIPS": "<li><strong>Tip 1:</strong> Description</li><li><strong>Tip 2:</strong> Description</li>",
    "COMPOSITION_TIPS": "<li>Composition tip 1</li><li>Composition tip 2</li>"
  }
}
```

### 2. Generate Tree Page

Run the generator script:

```bash
python templates/generate-tree-page.py <tree-slug>
```

For example:
```bash
python templates/generate-tree-page.py western-red-cedar
```

### 3. Add Images

Add seasonal images to the `images/` directory:
- `{tree-slug}-spring.jpg`
- `{tree-slug}-summer.jpg`
- `{tree-slug}-fall.jpg`
- `{tree-slug}-winter.jpg`

## Template Variables

The template uses the following placeholder variables:

### Basic Information
- `{{TREE_NAME}}` - Common name of the tree
- `{{SCIENTIFIC_NAME}}` - Scientific name
- `{{DESCRIPTION}}` - Brief description for subtitle
- `{{ABOUT_PARAGRAPH}}` - Detailed about paragraph
- `{{HEIGHT}}` - Height information
- `{{LEAVES_DESCRIPTION}}` - Description of leaves/needles
- `{{BARK_DESCRIPTION}}` - Description of bark
- `{{FRUIT_DESCRIPTION}}` - Description of fruit/cones
- `{{ADDITIONAL_IDENTIFICATION}}` - Additional identification features (HTML)
- `{{GROWING_CONDITIONS}}` - Growing conditions paragraph
- `{{LOCATION_INFO}}` - Where to find them paragraph
- `{{WILDLIFE_VALUE}}` - Wildlife value paragraph

### Seasonal Information
- `{{SEASONAL_INTRO}}` - Introduction to seasonal section
- `{{SPRING_DESCRIPTION}}` - Spring description
- `{{SPRING_CHARACTERISTICS}}` - Spring characteristics (HTML list)
- `{{SUMMER_DESCRIPTION}}` - Summer description
- `{{SUMMER_CHARACTERISTICS}}` - Summer characteristics (HTML list)
- `{{FALL_DESCRIPTION}}` - Fall description
- `{{FALL_CHARACTERISTICS}}` - Fall characteristics (HTML list)
- `{{WINTER_DESCRIPTION}}` - Winter description
- `{{WINTER_CHARACTERISTICS}}` - Winter characteristics (HTML list)

### Photography Information
- `{{PHOTOGRAPHY_INTRO}}` - Photography introduction
- `{{PHOTOGRAPHY_TIPS}}` - Photography tips (HTML list)
- `{{COMPOSITION_TIPS}}` - Composition tips (HTML list)

### Technical
- `{{TREE_SLUG}}` - Automatically set to the tree slug used in generation

## Benefits

1. **Consistency** - All tree pages have the same structure and styling
2. **Efficiency** - No need to recreate the same HTML structure
3. **Maintainability** - Changes to the template affect all tree pages
4. **Data-driven** - Easy to add new trees by just adding data
5. **Image-ready** - Automatic image path generation with fallbacks

## Example Usage

```bash
# Generate Western Red Cedar page
python templates/generate-tree-page.py western-red-cedar

# Generate Bigleaf Maple page (after adding data)
python templates/generate-tree-page.py bigleaf-maple
```

The system now uses dynamic rendering from templates and data files, eliminating the need for static content pages.
