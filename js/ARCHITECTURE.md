# Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Living in Woodinville                    │
│                     Web Application                         │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                        App.js                               │
│              Main Application Orchestrator                  │
│  • Component lifecycle management                           │
│  • Error handling                                           │
│  • Global state coordination                               │
└─────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
                    ▼           ▼           ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  PhotoWidget    │ │ NavigationComp  │ │ Future Components│
│                 │ │                 │ │                 │
│ • Auto-play     │ │ • Tree nav      │ │ • SearchWidget  │
│ • Image loading │ │ • SPA routing   │ │ • MapWidget     │
│ • Season nav    │ │ • State persist │ │ • FormWidget    │
│ • Placeholders  │ │ • Mobile resp   │ │ • etc...        │
└─────────────────┘ └─────────────────┘ └─────────────────┘
         │                   │
         │                   │
         ▼                   ▼
┌─────────────────┐ ┌─────────────────┐
│ Plant/Tree      │ │ All Pages       │
│ Templates       │ │                 │
│                 │ │                 │
│ • Douglas Fir   │ │ • index.html    │
│ • Western Cedar │ │ • templates/    │
│ • Roses         │ │ • data/         │
│ • Lavender      │ │                 │
│ • etc...        │ │                 │
└─────────────────┘ └─────────────────┘
```

## Component Isolation

### PhotoWidget (js/components/PhotoWidget.js)
**Single Responsibility**: Photo display and auto-play
- ✅ Isolated auto-play functionality
- ✅ Page-specific photo data loading
- ✅ Graceful error handling
- ✅ Easy to modify (change auto-play timing in one place)

### NavigationComponent (js/components/NavigationComponent.js)
**Single Responsibility**: Navigation and routing
- ✅ Tree navigation state management
- ✅ SPA routing without page reloads
- ✅ Mobile responsiveness
- ✅ State persistence

### App (js/App.js)
**Single Responsibility**: Application orchestration
- ✅ Component initialization
- ✅ Lifecycle management
- ✅ Error handling
- ✅ Global coordination

## Benefits

1. **Modularity**: Each component is self-contained
2. **Maintainability**: Changes are isolated to specific files
3. **Reusability**: Components can be used across different page types
4. **Testability**: Each component can be tested independently
5. **Scalability**: Easy to add new components
6. **Debugging**: Clear separation of concerns

## Example: Changing Auto-Play Speed

**Before (Monolithic)**:
- Had to search through 600+ lines of mixed code
- Risk of breaking other functionality
- Hard to test changes

**After (Modular)**:
1. Open `js/components/PhotoWidget.js`
2. Find `startAutoTransition()` method
3. Change `3000` to `5000` (line 95)
4. Done! No other files affected

## Future Enhancements

This architecture makes it trivial to add:
- New photo widget features
- Additional navigation components
- Page-specific components
- Third-party integrations
- Testing frameworks
