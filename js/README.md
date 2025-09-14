# Modular JavaScript Architecture

This directory contains the modular JavaScript architecture for the Living in Woodinville website.

## Architecture Overview

The codebase is organized into a component-based architecture that promotes:
- **Modularity**: Each component is isolated and has a single responsibility
- **Reusability**: Components can be easily reused across different pages
- **Maintainability**: Changes to one component don't affect others
- **Testability**: Each component can be tested independently

## Directory Structure

```
js/
├── components/
│   ├── PhotoWidget.js          # Handles photo display and auto-play
│   └── NavigationComponent.js  # Handles tree navigation and SPA routing
├── App.js                      # Main application orchestrator
├── main.js                     # ES6 module entry point
├── script-modular.js           # Fallback loader for older browsers
└── README.md                   # This file
```

## Components

### PhotoWidget
**Purpose**: Manages photo display, navigation, and auto-play functionality for plant/tree pages.

**Key Features**:
- Auto-play with 3-second intervals
- Season-based navigation
- Graceful handling of missing images
- Page-specific photo data loading
- Isolated timer management

**Usage**:
```javascript
const photoContainer = document.querySelector('.photo-section');
const photoWidget = new PhotoWidget(photoContainer);
```

**Auto-play Configuration**:
To change auto-play timing, modify the `startAutoTransition()` method in `PhotoWidget.js`:
```javascript
// Change from 3000ms to 5000ms
setInterval(() => { ... }, 5000);
```

### NavigationComponent
**Purpose**: Handles tree navigation, state persistence, and SPA routing.

**Key Features**:
- Tree node expansion/collapse
- State persistence in localStorage
- SPA navigation without page reloads
- Mobile-responsive navigation
- Address input management

### App
**Purpose**: Main application orchestrator that manages component lifecycle.

**Key Features**:
- Component initialization
- Lifecycle management
- Error handling
- Global state management

## Component Isolation

Each component is completely isolated:

1. **PhotoWidget**: Only manages photo-related functionality
2. **NavigationComponent**: Only manages navigation and routing
3. **App**: Only orchestrates components

## Making Changes

### To modify auto-play behavior:
1. Open `js/components/PhotoWidget.js`
2. Modify the `startAutoTransition()` method
3. No other files need to be changed

### To add a new component:
1. Create the component file in `js/components/`
2. Add it to the components array in `script-modular.js`
3. Initialize it in `App.js`

### To modify navigation behavior:
1. Open `js/components/NavigationComponent.js`
2. Make your changes
3. No other files need to be changed

## Benefits of This Architecture

1. **Single Responsibility**: Each component has one clear purpose
2. **Easy Maintenance**: Changes are isolated to specific files
3. **Reusability**: Components can be used across different page types
4. **Testability**: Each component can be unit tested independently
5. **Scalability**: Easy to add new components without affecting existing ones
6. **Debugging**: Clear separation makes debugging easier

## Browser Compatibility

The modular system includes fallbacks for older browsers:
- ES6 modules for modern browsers
- Script loading fallback for older browsers
- Graceful degradation if components fail to load

## Future Enhancements

This architecture makes it easy to add:
- New photo widget features
- Additional navigation components
- Page-specific components
- Third-party integrations
- Testing frameworks
