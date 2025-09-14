/**
 * Template Engine Component
 * Renders templates with data - the "V" in MVC
 */
class TemplateEngine {
    constructor() {
        this.templates = new Map();
        this.data = new Map();
    }

    async loadTemplate(templateName) {
        try {
            const response = await fetch(`/templates/${templateName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load template: ${response.status}`);
            }
            const template = await response.text();
            this.templates.set(templateName, template);
            return template;
        } catch (error) {
            console.error('TemplateEngine: Error loading template:', error);
            return null;
        }
    }

    async loadData(dataName) {
        try {
            const response = await fetch(`/data/${dataName}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load data: ${response.status}`);
            }
            const data = await response.json();
            this.data.set(dataName, data);
            return data;
        } catch (error) {
            console.error('TemplateEngine: Error loading data:', error);
            return null;
        }
    }

    render(templateName, dataName, itemKey) {
        const template = this.templates.get(templateName);
        const data = this.data.get(dataName);
        
        if (!template) {
            console.error('TemplateEngine: Template not found:', templateName);
            return null;
        }
        
        if (!data) {
            console.error('TemplateEngine: Data not found:', dataName);
            return null;
        }

        const itemData = data[itemKey];
        if (!itemData) {
            console.error('TemplateEngine: Item not found in data:', itemKey);
            return null;
        }

        return this.processTemplate(template, itemData);
    }

    processTemplate(template, data) {
        let result = template;
        
        // Replace basic variables
        result = result.replace(/\{\{PLANT_NAME\}\}/g, data.name || '');
        result = result.replace(/\{\{SCIENTIFIC_NAME\}\}/g, data.scientificName || '');
        result = result.replace(/\{\{PLANT_TYPE\}\}/g, data.type || 'Plant');
        result = result.replace(/\{\{DESCRIPTION\}\}/g, data.description || '');
        result = result.replace(/\{\{ABOUT_PARAGRAPH\}\}/g, data.about || '');
        result = result.replace(/\{\{HEIGHT\}\}/g, data.height || '');
        result = result.replace(/\{\{SPREAD\}\}/g, data.spread || '');
        result = result.replace(/\{\{GROWTH_RATE\}\}/g, data.growthRate || '');
        result = result.replace(/\{\{SOIL_PREFERENCE\}\}/g, data.soilPreference || '');
        result = result.replace(/\{\{SUN_EXPOSURE\}\}/g, data.sunExposure || '');
        result = result.replace(/\{\{WATER_NEEDS\}\}/g, data.waterNeeds || '');
        result = result.replace(/\{\{NATIVE_HABITAT\}\}/g, data.nativeHabitat || '');
        result = result.replace(/\{\{LANDSCAPING_USES\}\}/g, data.landscapingUses || '');
        result = result.replace(/\{\{LEAVES_DESCRIPTION\}\}/g, data.leavesDescription || '');
        result = result.replace(/\{\{BARK_DESCRIPTION\}\}/g, data.barkDescription || '');
        result = result.replace(/\{\{FRUIT_DESCRIPTION\}\}/g, data.fruitDescription || '');
        result = result.replace(/\{\{GROWING_CONDITIONS\}\}/g, data.growingConditions || '');
        result = result.replace(/\{\{LOCATION_INFO\}\}/g, data.locationInfo || '');
        result = result.replace(/\{\{WILDLIFE_VALUE\}\}/g, data.wildlifeValue || '');

        // Handle seasons
        if (data.seasons) {
            Object.keys(data.seasons).forEach(season => {
                const seasonData = data.seasons[season];
                result = result.replace(new RegExp(`\\{\\{${season.toUpperCase()}_DESCRIPTION\\}\\}`, 'g'), seasonData.description || '');
                result = result.replace(new RegExp(`\\{\\{${season.toUpperCase()}_CHARACTERISTICS\\}\\}`, 'g'), 
                    seasonData.characteristics ? seasonData.characteristics.map(c => `<li>${c}</li>`).join('') : '');
            });
        }

        // Handle photography
        if (data.photography) {
            result = result.replace(/\{\{PHOTOGRAPHY_INTRO\}\}/g, data.photography.intro || '');
            result = result.replace(/\{\{PHOTOGRAPHY_TIPS\}\}/g, 
                data.photography.tips ? data.photography.tips.map(tip => `<li><strong>${tip.split(':')[0]}:</strong> ${tip.split(':')[1] || ''}</li>`).join('') : '');
            result = result.replace(/\{\{COMPOSITION_TIPS\}\}/g, 
                data.photography.composition ? data.photography.composition.map(tip => `<li>${tip}</li>`).join('') : '');
        }

        // Handle slug variables
        const slug = data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : '';
        result = result.replace(/\{\{PLANT_SLUG\}\}/g, slug);
        result = result.replace(/\{\{PLANT_SLUG_UNDERSCORE\}\}/g, slug.replace(/-/g, '_'));

        // Handle park-specific variables
        result = result.replace(/\{\{PARK_NAME\}\}/g, data.name || '');
        result = result.replace(/\{\{PARK_ADDRESS\}\}/g, data.address || '');
        result = result.replace(/\{\{PARK_CITY_STATE\}\}/g, data.cityState || '');
        result = result.replace(/\{\{LATITUDE\}\}/g, data.latitude || 47.7544);
        result = result.replace(/\{\{LONGITUDE\}\}/g, data.longitude || -122.1556);
        result = result.replace(/\{\{LOCATION_NAME\}\}/g, data.name || 'Living in Woodinville');
        
        // Handle new info card variables
        result = result.replace(/\{\{TRAIL_LENGTH_DISPLAY\}\}/g, data.trailLengthDisplay || data.trailLength || 'Trail info');
        result = result.replace(/\{\{DOGS_DISPLAY\}\}/g, data.dogsAllowed ? 'block' : 'none');
        result = result.replace(/\{\{PLAYGROUND_DISPLAY\}\}/g, data.hasPlayground ? 'block' : 'none');
        result = result.replace(/\{\{WATER_DISPLAY\}\}/g, data.waterAccess ? 'block' : 'none');
        result = result.replace(/\{\{WATERFALL_DISPLAY\}\}/g, data.hasWaterfall ? 'block' : 'none');
        result = result.replace(/\{\{LAKE_DISPLAY\}\}/g, data.hasLake ? 'block' : 'none');

        return result;
    }

    async renderPlantPage(plantSlug) {
        // Load template and data
        await this.loadTemplate('plant-template');
        await this.loadData('plants');
        
        // Render the page
        return this.render('plant-template', 'plants', plantSlug);
    }

    async renderParkPage(parkSlug) {
        // Load template and data
        await this.loadTemplate('park-template');
        await this.loadData('parks');
        
        // Render the page
        return this.render('park-template', 'parks', parkSlug);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateEngine;
} else {
    window.TemplateEngine = TemplateEngine;
}
