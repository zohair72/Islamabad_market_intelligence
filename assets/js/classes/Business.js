/**
 * Business Class (Abstract Base Class)
 * Purpose: Represents an individual business entity with encapsulated properties
 * This class serves as the ABSTRACT base class for all business types
 * Child classes MUST override: calculateRevenue(), getMarketImpact()
 * 
 * @class Business
 * @author Market Intelligence Team
 * @version 2.0.0 - Refactored for Polymorphism
 */

export default class Business {
    // Private fields using # for strict encapsulation
    #name;
    #category;
    #priceRange;
    #footfall;
    #employeeCount;

    /**
     * Creates a new Business instance
     * @param {string} name - The name of the business
     * @param {string} category - Business category (Restaurant, Retail, Tech, Medical, Salon, Gym)
     * @param {string} priceRange - Price range (Budget/Mid/Premium)
     * @param {number} footfall - Estimated daily footfall number
     * @throws {Error} If any parameter is invalid
     */
    constructor(name, category, priceRange, footfall) {
        // Validation
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new Error('Business name must be a non-empty string');
        }
        if (!category || typeof category !== 'string') {
            throw new Error('Category must be a valid string');
        }
        if (!['Budget', 'Mid', 'Premium'].includes(priceRange)) {
            throw new Error('Price range must be Budget, Mid, or Premium');
        }
        if (typeof footfall !== 'number' || footfall < 0) {
            throw new Error('Footfall must be a non-negative number');
        }

        this.#name = name.trim();
        this.#category = category.trim();
        this.#priceRange = priceRange;
        this.#footfall = footfall;
        // Dummy data for employment stats
        this.#employeeCount = Math.floor(Math.random() * 40) + 5;
    }

    /**
     * Get the business name
     * @returns {string} The business name
     */
    getName() {
        return this.#name;
    }

    /**
     * Get the business category
     * @returns {string} The business category
     */
    getCategory() {
        return this.#category;
    }

    /**
     * Get the price range
     * @returns {string} The price range (Budget/Mid/Premium)
     */
    getPriceRange() {
        return this.#priceRange;
    }

    /**
     * Get the daily footfall
     * @returns {number} The estimated daily footfall
     */
    getFootfall() {
        return this.#footfall;
    }

    /**
     * Get employee count (Encapsulation)
     * @returns {number} The number of employees
     */
    getEmployeeCount() {
        return this.#employeeCount;
    }

    /**
     * Get formatted business information
     * @returns {Object} Complete business information object
     */
    getBusinessInfo() {
        return {
            name: this.#name,
            category: this.#category,
            priceRange: this.#priceRange,
            footfall: this.#footfall,
            estimatedRevenue: this.calculateRevenue(),
            marketImpact: this.getMarketImpact(),
            description: this.getDescription()
        };
    }

    /**
     * Calculate estimated daily revenue
     * ABSTRACT METHOD - Must be implemented by child classes
     * Each business type calculates revenue differently based on their model
     * @returns {number} Estimated daily revenue in PKR
     * @throws {Error} If not overridden by child class
     */
    calculateRevenue() {
        throw new Error(`calculateRevenue() must be implemented by ${this.#category} child class`);
    }

    /**
     * Calculate market impact score
     * ABSTRACT METHOD - Must be implemented by child classes
     * Different business types have different impacts on the local market
     * @returns {number} Market impact score
     * @throws {Error} If not overridden by child class
     */
    getMarketImpact() {
        throw new Error(`getMarketImpact() must be implemented by ${this.#category} child class`);
    }

    /**
     * Get business description
     * Can be overridden by child classes for more specific descriptions
     * @returns {string} Business description
     */
    getDescription() {
        return `${this.#name} - ${this.#category} business in ${this.#priceRange} price range`;
    }

    /**
     * Get monthly revenue estimate
     * @returns {number} Estimated monthly revenue in PKR
     */
    getMonthlyRevenue() {
        return this.calculateRevenue() * 30;
    }

    /**
     * Get annual revenue estimate
     * @returns {number} Estimated annual revenue in PKR
     */
    getAnnualRevenue() {
        return this.calculateRevenue() * 365;
    }

    /**
     * Update footfall data
     * @param {number} newFootfall - New footfall value
     * @throws {Error} If footfall is invalid
     */
    updateFootfall(newFootfall) {
        if (typeof newFootfall !== 'number' || newFootfall < 0) {
            throw new Error('Footfall must be a non-negative number');
        }
        this.#footfall = newFootfall;
    }

    /**
     * Get business performance rating based on revenue
     * @returns {string} Performance rating (Excellent/Good/Average/Poor)
     */
    getPerformanceRating() {
        const dailyRevenue = this.calculateRevenue();

        if (dailyRevenue >= 100000) return 'Excellent';
        if (dailyRevenue >= 50000) return 'Good';
        if (dailyRevenue >= 20000) return 'Average';
        return 'Poor';
    }

    /**
     * Get profit margin estimate
     * Can be overridden by child classes for specific calculations
     * @returns {number} Estimated profit margin percentage
     */
    getProfitMargin() {
        // Default profit margin varies by price range
        const margins = {
            'Budget': 15,
            'Mid': 25,
            'Premium': 35
        };
        return margins[this.#priceRange] || 20;
    }

    /**
     * String representation of the business
     * @returns {string} Business description
     */
    toString() {
        return `${this.#name} (${this.#category}) - ${this.#priceRange} Range - ${this.#footfall} daily footfall`;
    }
}
