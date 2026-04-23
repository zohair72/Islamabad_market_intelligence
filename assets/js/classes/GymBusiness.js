/**
 * GymBusiness Class
 * Purpose: Represents a gym/fitness business
 * Extends Business base class and implements polymorphic methods
 * 
 * @class GymBusiness
 * @extends Business
 * @author Market Intelligence Team
 * @version 1.0.0
 */

import Business from './Business.js';

export default class GymBusiness extends Business {
    // Private fields specific to gyms
    #membershipType;
    #equipment;

    /**
     * Creates a new GymBusiness instance
     * @param {string} name - Gym name
     * @param {string} priceRange - Price range (Budget/Mid/Premium)
     * @param {number} footfall - Daily footfall (member visits)
     * @param {string} membershipType - Membership type (Monthly/Quarterly/Annual)
     * @param {string} equipment - Equipment level (Basic/Standard/Premium)
     */
    constructor(name, priceRange, footfall, membershipType = 'Monthly', equipment = 'Standard') {
        super(name, 'Gym', priceRange, footfall);

        this.#membershipType = membershipType;
        this.#equipment = equipment;
    }

    /**
     * Get membership type
     * @returns {string} Membership type
     */
    getMembershipType() {
        return this.#membershipType;
    }

    /**
     * Get equipment level
     * @returns {string} Equipment level
     */
    getEquipment() {
        return this.#equipment;
    }

    /**
     * Calculate gym-specific daily revenue
     * Overrides abstract method from Business class
     * Gyms have recurring revenue model
     * @returns {number} Estimated daily revenue in PKR
     */
    calculateRevenue() {
        // Monthly membership fees based on price range
        const monthlyFees = {
            'Budget': 2000,     // PKR 2000/month
            'Mid': 5000,        // PKR 5000/month
            'Premium': 12000    // PKR 12000/month
        };

        const monthlyFee = monthlyFees[this.getPriceRange()] || 5000;

        // Estimate active members from daily footfall
        // Assume each member visits 3 times per week on average
        const estimatedMembers = Math.round(this.getFootfall() * 7 / 3);

        // Membership type affects revenue
        const membershipMultipliers = {
            'Monthly': 1.0,
            'Quarterly': 0.95,  // Slight discount
            'Annual': 0.85      // Better discount
        };
        const membershipMultiplier = membershipMultipliers[this.#membershipType] || 1.0;

        // Equipment quality attracts more members
        const equipmentMultipliers = {
            'Basic': 0.9,
            'Standard': 1.0,
            'Premium': 1.2,
            'Luxury': 1.4
        };
        const equipmentMultiplier = equipmentMultipliers[this.#equipment] || 1.0;

        // Calculate daily revenue from monthly memberships
        const monthlyRevenue = estimatedMembers * monthlyFee * membershipMultiplier * equipmentMultiplier;
        const dailyRevenue = monthlyRevenue / 30;

        return Math.round(dailyRevenue);
    }

    /**
     * Calculate market impact for gyms
     * Overrides abstract method from Business class
     * Gyms have good impact on community health
     * @returns {number} Market impact score
     */
    getMarketImpact() {
        // Gyms promote health and wellness in the community
        const baseImpact = this.getFootfall() * 0.9;

        // Equipment quality bonus
        const equipmentBonus = {
            'Basic': 80,
            'Standard': 150,
            'Premium': 250,
            'Luxury': 350
        };
        const bonus = equipmentBonus[this.#equipment] || 150;

        return Math.round(baseImpact + bonus);
    }

    /**
     * Get detailed gym description
     * Overrides method from Business class
     * @returns {string} Detailed description
     */
    getDescription() {
        return `${this.getName()} - Fitness Center with ${this.#equipment} equipment (${this.#membershipType} memberships, ${this.getPriceRange()} pricing)`;
    }

    /**
     * Get profit margin for gyms
     * Overrides base method with gym-specific margins
     * @returns {number} Profit margin percentage
     */
    getProfitMargin() {
        // Gyms have excellent margins with recurring revenue
        const margins = {
            'Budget': 35,
            'Mid': 45,
            'Premium': 55
        };
        return margins[this.getPriceRange()] || 40;
    }

    /**
     * Get estimated member count
     * @returns {number} Estimated number of active members
     */
    getEstimatedMembers() {
        // Each member visits ~3 times per week
        return Math.round(this.getFootfall() * 7 / 3);
    }

    /**
     * Get operating hours
     * @returns {string} Operating hours description
     */
    getOperatingHours() {
        const priceRange = this.getPriceRange();
        if (priceRange === 'Budget') return '6am-10pm';
        if (priceRange === 'Mid') return '5am-11pm';
        return '24/7';
    }

    /**
     * Get facilities offered
     * @returns {Array<string>} List of facilities
     */
    getFacilities() {
        const equipment = this.#equipment;
        if (equipment === 'Basic') return ['Cardio', 'Free Weights', 'Locker Room'];
        if (equipment === 'Standard') return ['Cardio', 'Free Weights', 'Machines', 'Locker Room', 'Shower'];
        return ['Cardio', 'Free Weights', 'Machines', 'Pool', 'Sauna', 'Personal Training', 'Classes'];
    }
}
