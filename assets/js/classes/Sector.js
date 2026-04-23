/**
 * Sector Class
 * Purpose: Represents a geographic sector/area in Islamabad with multiple businesses
 * Manages business collections and provides sector-level analytics
 * 
 * @class Sector
 * @author Market Intelligence Team
 * @version 1.0.0
 */

export default class Sector {
    // Private fields using # for strict encapsulation
    #name;
    #coordinates;
    #businesses;
    #population;
    #accessibility;

    /**
     * Creates a new Sector instance
     * @param {string} name - Sector name (e.g., "F-7", "Blue Area")
     * @param {Object} coordinates - Geographic coordinates {lat: number, lng: number}
     * @param {number} population - Estimated area population
     * @param {number} accessibility - Accessibility score (1-10)
     * @throws {Error} If any parameter is invalid
     */
    constructor(name, coordinates, population, accessibility) {
        // Validation
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new Error('Sector name must be a non-empty string');
        }

        if (!coordinates || typeof coordinates !== 'object') {
            throw new Error('Coordinates must be an object');
        }

        if (typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
            throw new Error('Coordinates must have valid lat and lng numbers');
        }

        if (coordinates.lat < -90 || coordinates.lat > 90) {
            throw new Error('Latitude must be between -90 and 90');
        }

        if (coordinates.lng < -180 || coordinates.lng > 180) {
            throw new Error('Longitude must be between -180 and 180');
        }

        if (typeof population !== 'number' || population < 0) {
            throw new Error('Population must be a non-negative number');
        }

        if (typeof accessibility !== 'number' || accessibility < 1 || accessibility > 10) {
            throw new Error('Accessibility score must be between 1 and 10');
        }

        this.#name = name.trim();
        this.#coordinates = { lat: coordinates.lat, lng: coordinates.lng };
        this.#businesses = [];
        this.#population = population;
        this.#accessibility = accessibility;
    }

    /**
     * Get the sector name
     * @returns {string} The sector name
     */
    getName() {
        return this.#name;
    }

    /**
     * Get the sector coordinates
     * @returns {Object} Coordinates object {lat, lng}
     */
    getCoordinates() {
        // Return a copy to prevent external modification
        return { ...this.#coordinates };
    }

    /**
     * Get the sector population
     * @returns {number} The estimated population
     */
    getPopulation() {
        return this.#population;
    }

    /**
     * Get the accessibility score
     * @returns {number} Accessibility score (1-10)
     */
    getAccessibility() {
        return this.#accessibility;
    }

    /**
     * Add a business to the sector
     * @param {Business} business - Business instance to add
     * @throws {Error} If business is invalid or already exists
     */
    addBusiness(business) {
        if (!business || typeof business.getName !== 'function') {
            throw new Error('Invalid business object');
        }

        // Check for duplicate business names
        const exists = this.#businesses.some(b => b.getName() === business.getName());
        if (exists) {
            throw new Error(`Business "${business.getName()}" already exists in this sector`);
        }

        this.#businesses.push(business);
    }

    /**
     * Remove a business from the sector
     * @param {string} businessName - Name of the business to remove
     * @returns {boolean} True if removed, false if not found
     */
    removeBusiness(businessName) {
        const initialLength = this.#businesses.length;
        this.#businesses = this.#businesses.filter(b => b.getName() !== businessName);
        return this.#businesses.length < initialLength;
    }

    /**
     * Get all businesses in the sector
     * @returns {Array} Array of Business objects (copy to prevent modification)
     */
    getBusinesses() {
        return [...this.#businesses];
    }

    /**
     * Get businesses filtered by category
     * @param {string} category - Category to filter by
     * @returns {Array} Array of businesses matching the category
     */
    getBusinessesByCategory(category) {
        if (!category || typeof category !== 'string') {
            throw new Error('Category must be a valid string');
        }

        return this.#businesses.filter(b =>
            b.getCategory().toLowerCase() === category.toLowerCase()
        );
    }

    /**
     * Get businesses filtered by price range
     * @param {string} priceRange - Price range to filter by (Budget/Mid/Premium)
     * @returns {Array} Array of businesses matching the price range
     */
    getBusinessesByPriceRange(priceRange) {
        if (!['Budget', 'Mid', 'Premium'].includes(priceRange)) {
            throw new Error('Price range must be Budget, Mid, or Premium');
        }

        return this.#businesses.filter(b => b.getPriceRange() === priceRange);
    }

    /**
     * Calculate total footfall across all businesses
     * @returns {number} Sum of all business footfalls
     */
    getTotalFootfall() {
        return this.#businesses.reduce((total, business) => {
            return total + business.getFootfall();
        }, 0);
    }

    /**
     * Calculate competition density (businesses per 1000 population)
     * @returns {number} Competition density ratio
     */
    getCompetitionDensity() {
        if (this.#population === 0) return 0;

        const businessCount = this.#businesses.length;
        const density = (businessCount / this.#population) * 1000;

        return parseFloat(density.toFixed(2));
    }

    /**
     * Get category distribution in the sector
     * @returns {Object} Object with categories as keys and counts as values
     */
    getCategoryDistribution() {
        const distribution = {};

        this.#businesses.forEach(business => {
            const category = business.getCategory();
            distribution[category] = (distribution[category] || 0) + 1;
        });

        return distribution;
    }

    /**
     * Get price range distribution
     * @returns {Object} Object with price ranges and their counts
     */
    getPriceRangeDistribution() {
        const distribution = {
            Budget: 0,
            Mid: 0,
            Premium: 0
        };

        this.#businesses.forEach(business => {
            const priceRange = business.getPriceRange();
            distribution[priceRange]++;
        });

        return distribution;
    }

    /**
     * Calculate total revenue for the sector
     * @returns {number} Total daily revenue across all businesses
     */
    getTotalRevenue() {
        return this.#businesses.reduce((total, business) => {
            return total + business.calculateRevenue();
        }, 0);
    }

    /**
     * Get average footfall per business
     * @returns {number} Average footfall
     */
    getAverageFootfall() {
        if (this.#businesses.length === 0) return 0;

        const totalFootfall = this.getTotalFootfall();
        return Math.round(totalFootfall / this.#businesses.length);
    }

    /**
     * Get comprehensive sector summary
     * @returns {Object} Complete sector analysis object
     */
    getSectorSummary() {
        return {
            name: this.#name,
            coordinates: this.getCoordinates(),
            population: this.#population,
            accessibility: this.#accessibility,
            statistics: {
                totalBusinesses: this.#businesses.length,
                totalFootfall: this.getTotalFootfall(),
                averageFootfall: this.getAverageFootfall(),
                totalDailyRevenue: this.getTotalRevenue(),
                competitionDensity: this.getCompetitionDensity()
            },
            distribution: {
                categories: this.getCategoryDistribution(),
                priceRanges: this.getPriceRangeDistribution()
            },
            rating: this.getSectorRating()
        };
    }

    /**
     * Get sector rating based on various factors
     * @returns {string} Sector rating (Excellent/Good/Average/Fair/Poor)
     */
    getSectorRating() {
        const businessCount = this.#businesses.length;
        const accessibility = this.#accessibility;
        const density = this.getCompetitionDensity();

        // Calculate composite score (0-100)
        const businessScore = Math.min(businessCount * 5, 30); // Max 30 points
        const accessibilityScore = accessibility * 4; // Max 40 points
        const densityScore = density < 5 ? 30 : density < 10 ? 20 : 10; // Max 30 points

        const totalScore = businessScore + accessibilityScore + densityScore;

        if (totalScore >= 80) return 'Excellent';
        if (totalScore >= 60) return 'Good';
        if (totalScore >= 40) return 'Average';
        if (totalScore >= 20) return 'Fair';
        return 'Poor';
    }

    /**
     * Find top performing businesses by revenue
     * @param {number} limit - Number of top businesses to return
     * @returns {Array} Array of top businesses with their info
     */
    getTopBusinesses(limit = 5) {
        return this.#businesses
            .map(business => ({
                name: business.getName(),
                category: business.getCategory(),
                revenue: business.calculateRevenue(),
                footfall: business.getFootfall()
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, limit);
    }

    /**
     * String representation of the sector
     * @returns {string} Sector description
     */
    toString() {
        return `${this.#name} - ${this.#businesses.length} businesses, Population: ${this.#population.toLocaleString()}`;
    }
}
