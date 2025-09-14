# Living in Woodinville

A comprehensive guide to life in Woodinville, WA - your go-to resource for local attractions, gardening tips, community life, and everything you need to know about this beautiful Washington town.

## Project Overview

The "Living in Woodinville" website is designed to be the definitive resource for residents and visitors of Woodinville, WA. Built with a scalable, mobile-first approach, it features a flexible navigation system that can grow with content over time.

## Features

### 🏗️ Scalable Architecture
- **Three-level hierarchical navigation** that can accommodate unlimited content expansion
- **Mobile-first responsive design** that works perfectly on all devices
- **Modular content structure** for easy maintenance and updates

### 🎯 Core Categories
- **The Yard & Garden**: Gardening guides, tree care, plant identification, and tools
- **Exploring Woodinville**: Hiking trails, parks, attractions, and outdoor activities  
- **Local Life**: Community events, farmers markets, local businesses, and services

### 🔍 Advanced Search
- **Real-time search functionality** with debounced input
- **Content tagging system** for accurate results
- **Search results highlighting** with category filtering

### 📱 Mobile Experience
- **Hamburger menu** for mobile navigation
- **Touch-friendly interface** with proper spacing
- **Optimized performance** for mobile devices

## Technology Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No dependencies, fast loading
- **Font Awesome**: Professional icons throughout
- **Google Fonts**: Inter font family for readability

## File Structure

```
LivingInWoodenville/
├── index.html              # Homepage
├── styles.css              # Main stylesheet
├── script-modular.js       # Modular JavaScript functionality
├── js/                     # Modular JavaScript components
│   ├── components/         # Reusable UI components
│   │   ├── PhotoWidget.js  # Photo display & auto-play
│   │   └── NavigationComponent.js # Tree navigation & SPA routing
│   ├── App.js             # Main application orchestrator
│   └── main.js            # ES6 module entry point
├── data/                   # Data files for dynamic rendering
│   └── plants.json
│   ├── gardening-tools.html
│   └── farmers-markets.html
└── README.md               # This file
```

## Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in your web browser
3. **Explore the content** using the navigation menu
4. **Try the search functionality** to find specific topics

## Content Management

The website is designed for easy content expansion:

### Adding New Content
1. Add data to `data/plants.json` for new plants
2. Update navigation in `templates/navigation.html` if needed
3. Content renders dynamically from templates and data
4. Add content to the search database in `script-modular.js`

### Navigation Updates
- **Top-level categories** are stable and rarely change
- **Sub-menu items** can be added easily to existing categories
- **New categories** can be added to the main navigation

### Search Integration
- Add new content to the `searchContent()` function in `script-modular.js`
- Include relevant tags for better search results
- Update the content database with new articles

### Modular Architecture
The JavaScript codebase uses a component-based architecture for better maintainability:

- **PhotoWidget**: Handles photo display and auto-play functionality
- **NavigationComponent**: Manages tree navigation and SPA routing
- **App**: Orchestrates all components and manages application lifecycle

Each component is isolated and can be modified independently. For example, to change auto-play timing, modify only `js/components/PhotoWidget.js`.

## Browser Support

- **Chrome**: Full support
- **Firefox**: Full support  
- **Safari**: Full support
- **Edge**: Full support
- **Mobile browsers**: Optimized experience

## Performance Features

- **Optimized images**: Proper sizing and lazy loading
- **Minimal dependencies**: Fast loading times
- **Efficient CSS**: Modern layout techniques
- **Progressive enhancement**: Works without JavaScript

## Accessibility

- **Semantic HTML**: Proper heading structure and landmarks
- **Keyboard navigation**: Full keyboard accessibility
- **Screen reader support**: ARIA labels and descriptions
- **Color contrast**: WCAG compliant color schemes
- **Focus management**: Clear focus indicators

## Future Enhancements

The architecture supports easy addition of:
- **Blog functionality** with dynamic content
- **User accounts** and personalized content
- **Interactive maps** for local attractions
- **Event calendar** integration
- **Community forums** or discussion areas
- **Email newsletter** signup
- **Social media** integration

## Local Development

For local development and testing:

1. **Use a local server** (Python, Node.js, or similar)
2. **Test on multiple devices** and screen sizes
3. **Validate HTML and CSS** for standards compliance
4. **Test accessibility** with screen readers
5. **Check performance** with browser dev tools

## Contributing

This project is designed to be easily maintainable and expandable. When adding content:

1. **Follow the existing patterns** for consistency
2. **Test on mobile devices** to ensure responsiveness
3. **Update the search database** for new content
4. **Maintain the hierarchical navigation** structure
5. **Keep content local and relevant** to Woodinville

## License

This project is created for the Woodinville community. Feel free to use and modify for local community purposes.

---

**Living in Woodinville** - Your comprehensive guide to life in Woodinville, WA
# GitHub Pages Test
