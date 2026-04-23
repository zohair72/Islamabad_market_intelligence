/**
 * TechBusiness Class
 * Purpose: Represents a technology/electronics business
 * Extends Business base class and implements polymorphic methods
 * 
 * @class TechBusiness
 * @extends Business
 * @author Market Intelligence Team
 * @version 1.0.0
 */

import Business from './Business.js';

export default class TechBusiness extends Business {
    // Private fields specific to tech businesses
    #specialization;
    #serviceType;

    /**
     * Creates a new TechBusiness instance
     * @param {string} name - Business name
     * @param {string} priceRange - Price range (Budget/Mid/Premium)
     * @param {number} footfall - Daily footfall
     * @param {string} specialization - Tech specialization (Laptops, Phones, Accessories, etc.)
     * @param {string} serviceType - Service type (Sales/Repair/Both)
     */
    constructor(name, priceRange, footfall, specialization = 'General', serviceType = 'Sales') {
        super(name, 'Tech', priceRange, footfall);

        this.#specialization = specialization;
        this.#serviceType = serviceType;
    }

    /**
     * Get specialization
     * @returns {string} Tech specialization
     */
    getSpecialization() {
        return this.#specialization;
    }

    /**
     * Get service type
     * @returns {string} Service type
     */
    getServiceType() {
        return this.#serviceType;
    }

    /**
     * Calculate tech-specific daily revenue
     * Overrides abstract method from Business class
     * @returns {number} Estimated daily revenue in PKR
     */
    calculateRevenue() {
        // Average sale per customer based on price range
        const averageSales = {
            'Budget': 3000,      // PKR 3000 per customer (accessories, repairs)
            'Mid': 15000,        // PKR 15000 per customer (phones, tablets)
            'Premium': 80000     // PKR 80000 per customer (laptops, high-end devices)
        };

        const averageSale = averageSales[this.getPriceRange()] || 15000;

        // Tech has lower conversion rate (15%) but higher ticket size
        const conversionRate = 0.15;
        const actualCustomers = Math.floor(this.getFootfall() * conversionRate);

        // Specialization multiplier
        const specializationMultipliers = {
            'Laptops': 1.5,
            'Phones': 1.2,
            'Accessories': 0.7,
            'Gaming': 1.3,
            'General': 1.0
        };
        const specializationMultiplier = specializationMultipliers[this.#specialization] || 1.0;

        // Service type factor
        const serviceMultipliers = {
            'Sales': 1.0,
            'Repair': 0.6,
            'Both': 1.3
        };
        const serviceMultiplier = serviceMultipliers[this.#serviceType] || 1.0;

        return Math.round(actualCustomers * averageSale * specializationMultiplier * serviceMultiplier);
    }

    /**
     * Calculate market impact for tech businesses
     * Overrides abstract method from Business class
     * Tech has moderate impact
     * @returns {number} Market impact score
     */
    getMarketImpact() {
        // Tech businesses have moderate impact
        const baseImpact = this.getFootfall() * 0.6;

        // Specialization bonus
        const specializationBonus = {
            'Laptops': 200,
            'Phones': 150,
            'Gaming': 180,
            'Accessories': 80,
            'General': 100
        };
        const bonus = specializationBonus[this.#specialization] || 100;

        return Math.round(baseImpact + bonus);
    }

    /**
     * Get detailed tech business description
     * Overrides method from Business class
     * @returns {string} Detailed description
     */
    getDescription() {
        return `${this.getName()} - ${this.#specialization} Tech Store (${this.#serviceType}, ${this.getPriceRange()} pricing)`;
    }

    /**
     * Get profit margin for tech
     * Overrides base method with tech-specific margins
     * @returns {number} Profit margin percentage
     */
    getProfitMargin() {
        // Tech margins vary significantly
        const margins = {
            'Budget': 10,   // Low margin on accessories
            'Mid': 15,      // Moderate on phones
            'Premium': 20   // Better on laptops
        };
        return margins[this.getPriceRange()] || 15;
    }

    /**
     * Get warranty offering
     * @returns {string} Warranty description
     */
    getWarrantyOffering() {
        const priceRange = this.getPriceRange();
        if (priceRange === 'Budget') return '3-6 months';
        if (priceRange === 'Mid') return '1 year';
        return '1-2 years with extended options';
    }
}
