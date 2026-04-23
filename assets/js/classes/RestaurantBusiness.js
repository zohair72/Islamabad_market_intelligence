/**
 * RestaurantBusiness Class
 * Purpose: Represents a restaurant business with specific revenue and impact calculations
 * Extends Business base class and implements polymorphic methods
 * 
 * @class RestaurantBusiness
 * @extends Business
 * @author Market Intelligence Team
 * @version 1.0.0
 */

import Business from './Business.js';

export default class RestaurantBusiness extends Business {
    // Private fields specific to restaurants
    #cuisineType;
    #seatingCapacity;

    /**
     * Creates a new RestaurantBusiness instance
     * @param {string} name - Restaurant name
     * @param {string} priceRange - Price range (Budget/Mid/Premium)
     * @param {number} footfall - Daily footfall
     * @param {string} cuisineType - Type of cuisine (Pakistani, Chinese, Italian, etc.)
     * @param {number} seatingCapacity - Number of seats available
     */
    constructor(name, priceRange, footfall, cuisineType = 'Pakistani', seatingCapacity = 40) {
        super(name, 'Restaurant', priceRange, footfall);

        this.#cuisineType = cuisineType;
        this.#seatingCapacity = seatingCapacity;
    }

    /**
     * Get cuisine type
     * @returns {string} Cuisine type
     */
    getCuisineType() {
        return this.#cuisineType;
    }

    /**
     * Get seating capacity
     * @returns {number} Seating capacity
     */
    getSeatingCapacity() {
        return this.#seatingCapacity;
    }

    /**
     * Calculate restaurant-specific daily revenue
     * Overrides abstract method from Business class
     * @returns {number} Estimated daily revenue in PKR
     */
    calculateRevenue() {
        // Average bill per customer based on price range
        const averageBills = {
            'Budget': 600,      // PKR 600 per customer
            'Mid': 1800,        // PKR 1800 per customer
            'Premium': 4000     // PKR 4000 per customer
        };

        const averageBill = averageBills[this.getPriceRange()] || 1500;

        // Restaurants have higher conversion rate (40%) due to dining intent
        const conversionRate = 0.40;
        const actualCustomers = Math.floor(this.getFootfall() * conversionRate);

        // Cuisine type multiplier
        const cuisineMultipliers = {
            'Pakistani': 1.0,
            'Chinese': 1.1,
            'Italian': 1.2,
            'Fast Food': 0.9,
            'Continental': 1.3
        };
        const cuisineMultiplier = cuisineMultipliers[this.#cuisineType] || 1.0;

        // Seating capacity factor (more seats = more revenue potential)
        const capacityFactor = Math.min(this.#seatingCapacity / 40, 1.5);

        return Math.round(actualCustomers * averageBill * cuisineMultiplier * capacityFactor);
    }

    /**
     * Calculate market impact for restaurants
     * Overrides abstract method from Business class
     * Restaurants have high impact due to foot traffic and employment
     * @returns {number} Market impact score
     */
    getMarketImpact() {
        // Restaurants create significant foot traffic and employment
        const baseImpact = this.getFootfall() * 0.8;

        // Larger restaurants have more impact
        const capacityBonus = this.#seatingCapacity * 2;

        return Math.round(baseImpact + capacityBonus);
    }

    /**
     * Get detailed restaurant description
     * Overrides method from Business class
     * @returns {string} Detailed description
     */
    getDescription() {
        return `${this.getName()} - ${this.#cuisineType} Restaurant with ${this.#seatingCapacity} seats (${this.getPriceRange()} pricing)`;
    }

    /**
     * Get profit margin for restaurants
     * Overrides base method with restaurant-specific margins
     * @returns {number} Profit margin percentage
     */
    getProfitMargin() {
        // Restaurants typically have lower margins due to food costs
        const margins = {
            'Budget': 12,
            'Mid': 18,
            'Premium': 25
        };
        return margins[this.getPriceRange()] || 15;
    }

    /**
     * Get peak hours estimate
     * @returns {string} Peak hours description
     */
    getPeakHours() {
        const priceRange = this.getPriceRange();
        if (priceRange === 'Budget') return 'Lunch: 12-3pm, Dinner: 7-10pm';
        if (priceRange === 'Mid') return 'Lunch: 1-3pm, Dinner: 8-11pm';
        return 'Dinner: 8pm-12am';
    }
}
