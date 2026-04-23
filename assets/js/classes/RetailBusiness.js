/**
 * RetailBusiness Class
 * Purpose: Represents a retail/shopping business with specific calculations
 * Extends Business base class and implements polymorphic methods
 * 
 * @class RetailBusiness
 * @extends Business
 * @author Market Intelligence Team
 * @version 1.0.0
 */

import Business from './Business.js';

export default class RetailBusiness extends Business {
    // Private fields specific to retail
    #storeSize;
    #brandType;

    /**
     * Creates a new RetailBusiness instance
     * @param {string} name - Store name
     * @param {string} priceRange - Price range (Budget/Mid/Premium)
     * @param {number} footfall - Daily footfall
     * @param {string} storeSize - Store size in sq ft
     * @param {string} brandType - Brand type (Local/National/International)
     */
    constructor(name, priceRange, footfall, storeSize = '1000', brandType = 'Local') {
        super(name, 'Retail', priceRange, footfall);

        this.#storeSize = storeSize;
        this.#brandType = brandType;
    }

    /**
     * Get store size
     * @returns {string} Store size in sq ft
     */
    getStoreSize() {
        return this.#storeSize;
    }

    /**
     * Get brand type
     * @returns {string} Brand type
     */
    getBrandType() {
        return this.#brandType;
    }

    /**
     * Calculate retail-specific daily revenue
     * Overrides abstract method from Business class
     * @returns {number} Estimated daily revenue in PKR
     */
    calculateRevenue() {
        // Average purchase per customer based on price range
        const averagePurchases = {
            'Budget': 800,      // PKR 800 per customer
            'Mid': 2500,        // PKR 2500 per customer
            'Premium': 6000     // PKR 6000 per customer
        };

        const averagePurchase = averagePurchases[this.getPriceRange()] || 2000;

        // Retail has moderate conversion rate (25%)
        const conversionRate = 0.25;
        const actualCustomers = Math.floor(this.getFootfall() * conversionRate);

        // Brand type multiplier
        const brandMultipliers = {
            'Local': 0.9,
            'National': 1.1,
            'International': 1.3
        };
        const brandMultiplier = brandMultipliers[this.#brandType] || 1.0;

        // Store size factor (larger stores = more revenue)
        const sizeNum = parseInt(this.#storeSize) || 1000;
        const sizeFactor = Math.min(sizeNum / 1000, 2.0);

        return Math.round(actualCustomers * averagePurchase * brandMultiplier * sizeFactor);
    }

    /**
     * Calculate market impact for retail
     * Overrides abstract method from Business class
     * Retail has very high impact due to shopping attraction
     * @returns {number} Market impact score
     */
    getMarketImpact() {
        // Retail creates high foot traffic and attracts shoppers
        const baseImpact = this.getFootfall() * 1.2;

        // Brand recognition bonus
        const brandBonus = {
            'Local': 100,
            'National': 300,
            'International': 500
        };
        const bonus = brandBonus[this.#brandType] || 100;

        return Math.round(baseImpact + bonus);
    }

    /**
     * Get detailed retail description
     * Overrides method from Business class
     * @returns {string} Detailed description
     */
    getDescription() {
        return `${this.getName()} - ${this.#brandType} Retail Store (${this.#storeSize} sq ft, ${this.getPriceRange()} pricing)`;
    }

    /**
     * Get profit margin for retail
     * Overrides base method with retail-specific margins
     * @returns {number} Profit margin percentage
     */
    getProfitMargin() {
        // Retail margins vary by brand type
        const margins = {
            'Budget': 20,
            'Mid': 30,
            'Premium': 40
        };
        return margins[this.getPriceRange()] || 25;
    }

    /**
     * Get inventory turnover estimate
     * @returns {string} Inventory turnover description
     */
    getInventoryTurnover() {
        const priceRange = this.getPriceRange();
        if (priceRange === 'Budget') return 'High (15-20 days)';
        if (priceRange === 'Mid') return 'Medium (30-45 days)';
        return 'Low (60-90 days)';
    }
}
