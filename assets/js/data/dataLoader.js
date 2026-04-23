/**
 * DataLoader Class
 * Purpose: Loads and manages JSON data files for the Islamabad Market Intelligence Dashboard
 * Provides async methods to fetch sectors, businesses, and categories data
 * 
 * @class DataLoader
 * @author Market Intelligence Team
 * @version 1.0.0
 */

export default class DataLoader {
    /**
     * Load sectors data from JSON file
     * @returns {Promise<Array>} Promise resolving to array of sector objects
     * @throws {Error} If fetch fails or JSON is invalid
     */
    static async loadSectors() {
        try {
            const response = await fetch('./assets/js/data/sectors.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`✓ Loaded ${data.length} sectors`);
            return data;
        } catch (error) {
            console.error('Error loading sectors:', error);
            throw new Error(`Failed to load sectors: ${error.message}`);
        }
    }

    /**
     * Load businesses data from JSON file
     * @returns {Promise<Array>} Promise resolving to array of business objects
     * @throws {Error} If fetch fails or JSON is invalid
     */
    static async loadBusinesses() {
        try {
            const response = await fetch('./assets/js/data/businesses.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`✓ Loaded ${data.length} businesses`);
            return data;
        } catch (error) {
            console.error('Error loading businesses:', error);
            throw new Error(`Failed to load businesses: ${error.message}`);
        }
    }

    /**
     * Load categories data from JSON file
     * @returns {Promise<Array>} Promise resolving to array of category objects
     * @throws {Error} If fetch fails or JSON is invalid
     */
    static async loadCategories() {
        try {
            const response = await fetch('./assets/js/data/categories.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`✓ Loaded ${data.length} categories`);
            return data;
        } catch (error) {
            console.error('Error loading categories:', error);
            throw new Error(`Failed to load categories: ${error.message}`);
        }
    }

    /**
     * Load all data files concurrently
     * @returns {Promise<Object>} Promise resolving to object with sectors, businesses, and categories
     * @throws {Error} If any fetch fails
     */
    static async loadAllData() {
        try {
            console.log('Loading all market data...');

            const [sectors, businesses, categories] = await Promise.all([
                this.loadSectors(),
                this.loadBusinesses(),
                this.loadCategories()
            ]);

            console.log('✓ All data loaded successfully');

            return {
                sectors,
                businesses,
                categories
            };
        } catch (error) {
            console.error('Error loading all data:', error);
            throw new Error(`Failed to load market data: ${error.message}`);
        }
    }

    /**
     * Get businesses for a specific sector
     * @param {Array} businesses - Array of all businesses
     * @param {string} sectorId - Sector ID to filter by
     * @returns {Array} Filtered array of businesses
     */
    static getBusinessesBySector(businesses, sectorId) {
        if (!Array.isArray(businesses)) {
            throw new Error('Businesses must be an array');
        }

        return businesses.filter(business => business.sectorId === sectorId);
    }

    /**
     * Get businesses by category
     * @param {Array} businesses - Array of all businesses
     * @param {string} category - Category to filter by
     * @returns {Array} Filtered array of businesses
     */
    static getBusinessesByCategory(businesses, category) {
        if (!Array.isArray(businesses)) {
            throw new Error('Businesses must be an array');
        }

        return businesses.filter(business =>
            business.category.toLowerCase() === category.toLowerCase()
        );
    }

    /**
     * Get businesses by price range
     * @param {Array} businesses - Array of all businesses
     * @param {string} priceRange - Price range to filter by (Budget/Mid/Premium)
     * @returns {Array} Filtered array of businesses
     */
    static getBusinessesByPriceRange(businesses, priceRange) {
        if (!Array.isArray(businesses)) {
            throw new Error('Businesses must be an array');
        }

        return businesses.filter(business => business.priceRange === priceRange);
    }

    /**
     * Get sector by ID
     * @param {Array} sectors - Array of all sectors
     * @param {string} sectorId - Sector ID to find
     * @returns {Object|null} Sector object or null if not found
     */
    static getSectorById(sectors, sectorId) {
        if (!Array.isArray(sectors)) {
            throw new Error('Sectors must be an array');
        }

        return sectors.find(sector => sector.id === sectorId) || null;
    }

    /**
     * Get category by ID
     * @param {Array} categories - Array of all categories
     * @param {string} categoryId - Category ID to find
     * @returns {Object|null} Category object or null if not found
     */
    static getCategoryById(categories, categoryId) {
        if (!Array.isArray(categories)) {
            throw new Error('Categories must be an array');
        }

        return categories.find(category => category.id === categoryId) || null;
    }

    /**
     * Get statistics for all loaded data
     * @param {Object} data - Object containing sectors, businesses, and categories
     * @returns {Object} Statistics object
     */
    static getDataStatistics(data) {
        const { sectors, businesses, categories } = data;

        return {
            totalSectors: sectors.length,
            totalBusinesses: businesses.length,
            totalCategories: categories.length,
            averageBusinessesPerSector: (businesses.length / sectors.length).toFixed(2),
            totalPopulation: sectors.reduce((sum, sector) => sum + sector.population, 0),
            averageAccessibility: (sectors.reduce((sum, sector) => sum + sector.accessibility, 0) / sectors.length).toFixed(2)
        };
    }

    /**
     * Validate loaded data structure
     * @param {Object} data - Data object to validate
     * @returns {boolean} True if valid, throws error otherwise
     * @throws {Error} If data structure is invalid
     */
    static validateData(data) {
        if (!data || typeof data !== 'object') {
            throw new Error('Data must be an object');
        }

        if (!Array.isArray(data.sectors) || data.sectors.length === 0) {
            throw new Error('Sectors data is missing or empty');
        }

        if (!Array.isArray(data.businesses) || data.businesses.length === 0) {
            throw new Error('Businesses data is missing or empty');
        }

        if (!Array.isArray(data.categories) || data.categories.length === 0) {
            throw new Error('Categories data is missing or empty');
        }

        console.log('✓ Data validation passed');
        return true;
    }
}
