/**
 * SalonBusiness Class
 * Purpose: Represents a salon/beauty business
 * Extends Business base class and implements polymorphic methods
 * 
 * @class SalonBusiness
 * @extends Business
 * @author Market Intelligence Team
 * @version 1.0.0
 */

import Business from './Business.js';

export default class SalonBusiness extends Business {
    // Private fields specific to salons
    #serviceOffered;
    #staffCount;

    /**
     * Creates a new SalonBusiness instance
     * @param {string} name - Salon name
     * @param {string} priceRange - Price range (Budget/Mid/Premium)
     * @param {number} footfall - Daily footfall
     * @param {string} serviceOffered - Services offered (Basic/Full Service/Luxury)
     * @param {number} staffCount - Number of staff members
     */
    constructor(name, priceRange, footfall, serviceOffered = 'Full Service', staffCount = 3) {
        super(name, 'Salon', priceRange, footfall);

        this.#serviceOffered = serviceOffered;
        this.#staffCount = staffCount;
    }

    /**
     * Get service offered
     * @returns {string} Service type
     */
    getServiceOffered() {
        return this.#serviceOffered;
    }

    /**
     * Get staff count
     * @returns {number} Number of staff
     */
    getStaffCount() {
        return this.#staffCount;
    }

    /**
     * Calculate salon-specific daily revenue
     * Overrides abstract method from Business class
     * @returns {number} Estimated daily revenue in PKR
     */
    calculateRevenue() {
        // Average service price based on price range
        const averagePrices = {
            'Budget': 1000,     // PKR 1000 per customer (basic cuts)
            'Mid': 2500,        // PKR 2500 per customer (full service)
            'Premium': 5000     // PKR 5000 per customer (luxury treatments)
        };

        const averagePrice = averagePrices[this.getPriceRange()] || 2000;

        // Salons have good conversion rate (60%) - appointments + walk-ins
        const conversionRate = 0.60;
        const actualCustomers = Math.floor(this.getFootfall() * conversionRate);

        // Service type multiplier
        const serviceMultipliers = {
            'Basic': 0.8,
            'Full Service': 1.0,
            'Luxury': 1.4,
            'Spa': 1.6
        };
        const serviceMultiplier = serviceMultipliers[this.#serviceOffered] || 1.0;

        // More staff = more capacity
        const staffFactor = Math.min(this.#staffCount / 3, 1.8);

        return Math.round(actualCustomers * averagePrice * serviceMultiplier * staffFactor);
    }

    /**
     * Calculate market impact for salons
     * Overrides abstract method from Business class
     * Salons have moderate impact
     * @returns {number} Market impact score
     */
    getMarketImpact() {
        // Salons create moderate local impact
        const baseImpact = this.getFootfall() * 0.7;

        // Service quality bonus
        const serviceBonus = {
            'Basic': 50,
            'Full Service': 100,
            'Luxury': 200,
            'Spa': 250
        };
        const bonus = serviceBonus[this.#serviceOffered] || 100;

        // Staff employment impact
        const staffBonus = this.#staffCount * 30;

        return Math.round(baseImpact + bonus + staffBonus);
    }

    /**
     * Get detailed salon description
     * Overrides method from Business class
     * @returns {string} Detailed description
     */
    getDescription() {
        return `${this.getName()} - ${this.#serviceOffered} Salon with ${this.#staffCount} staff (${this.getPriceRange()} pricing)`;
    }

    /**
     * Get profit margin for salons
     * Overrides base method with salon-specific margins
     * @returns {number} Profit margin percentage
     */
    getProfitMargin() {
        // Salons have good margins on services
        const margins = {
            'Budget': 30,
            'Mid': 40,
            'Premium': 50
        };
        return margins[this.getPriceRange()] || 35;
    }

    /**
     * Get average service time
     * @returns {string} Service time description
     */
    getAverageServiceTime() {
        const serviceType = this.#serviceOffered;
        if (serviceType === 'Basic') return '30-45 minutes';
        if (serviceType === 'Full Service') return '1-2 hours';
        return '2-3 hours';
    }

    /**
     * Get popular services
     * @returns {Array<string>} List of popular services
     */
    getPopularServices() {
        const priceRange = this.getPriceRange();
        if (priceRange === 'Budget') return ['Haircut', 'Shave', 'Basic Styling'];
        if (priceRange === 'Mid') return ['Haircut', 'Color', 'Facial', 'Styling'];
        return ['Premium Haircut', 'Color Treatment', 'Spa Services', 'Bridal Makeup'];
    }
}
