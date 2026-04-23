/**
 * MedicalBusiness Class
 * Purpose: Represents a medical/healthcare business
 * Extends Business base class and implements polymorphic methods
 * 
 * @class MedicalBusiness
 * @extends Business
 * @author Market Intelligence Team
 * @version 1.0.0
 */

import Business from './Business.js';

export default class MedicalBusiness extends Business {
    // Private fields specific to medical businesses
    #serviceType;
    #doctors;

    /**
     * Creates a new MedicalBusiness instance
     * @param {string} name - Medical facility name
     * @param {string} priceRange - Price range (Budget/Mid/Premium)
     * @param {number} footfall - Daily patient footfall
     * @param {string} serviceType - Service type (General/Specialist/Diagnostic/Hospital)
     * @param {number} doctors - Number of doctors
     */
    constructor(name, priceRange, footfall, serviceType = 'General', doctors = 2) {
        super(name, 'Medical', priceRange, footfall);

        this.#serviceType = serviceType;
        this.#doctors = doctors;
    }

    /**
     * Get service type
     * @returns {string} Medical service type
     */
    getServiceType() {
        return this.#serviceType;
    }

    /**
     * Get number of doctors
     * @returns {number} Number of doctors
     */
    getDoctors() {
        return this.#doctors;
    }

    /**
     * Calculate medical-specific daily revenue
     * Overrides abstract method from Business class
     * @returns {number} Estimated daily revenue in PKR
     */
    calculateRevenue() {
        // Average consultation/service fee based on price range
        const averageFees = {
            'Budget': 800,      // PKR 800 per patient (basic clinic)
            'Mid': 2000,        // PKR 2000 per patient (specialist)
            'Premium': 5000     // PKR 5000 per patient (premium hospital)
        };

        const averageFee = averageFees[this.getPriceRange()] || 2000;

        // Medical has high conversion rate (80%) - most visitors are patients
        const conversionRate = 0.80;
        const actualPatients = Math.floor(this.getFootfall() * conversionRate);

        // Service type multiplier
        const serviceMultipliers = {
            'General': 1.0,
            'Specialist': 1.5,
            'Diagnostic': 1.3,
            'Hospital': 2.0
        };
        const serviceMultiplier = serviceMultipliers[this.#serviceType] || 1.0;

        // More doctors = more capacity
        const doctorFactor = Math.min(this.#doctors / 2, 2.0);

        return Math.round(actualPatients * averageFee * serviceMultiplier * doctorFactor);
    }

    /**
     * Calculate market impact for medical businesses
     * Overrides abstract method from Business class
     * Medical has very high impact due to essential service
     * @returns {number} Market impact score
     */
    getMarketImpact() {
        // Medical services have very high community impact
        const baseImpact = this.getFootfall() * 1.5;

        // Service type bonus
        const serviceBonus = {
            'General': 200,
            'Specialist': 400,
            'Diagnostic': 350,
            'Hospital': 600
        };
        const bonus = serviceBonus[this.#serviceType] || 200;

        // More doctors = more impact
        const doctorBonus = this.#doctors * 50;

        return Math.round(baseImpact + bonus + doctorBonus);
    }

    /**
     * Get detailed medical business description
     * Overrides method from Business class
     * @returns {string} Detailed description
     */
    getDescription() {
        return `${this.getName()} - ${this.#serviceType} Medical Facility with ${this.#doctors} doctor(s) (${this.getPriceRange()} pricing)`;
    }

    /**
     * Get profit margin for medical
     * Overrides base method with medical-specific margins
     * @returns {number} Profit margin percentage
     */
    getProfitMargin() {
        // Medical has good margins but high operational costs
        const margins = {
            'Budget': 25,
            'Mid': 35,
            'Premium': 45
        };
        return margins[this.getPriceRange()] || 30;
    }

    /**
     * Get operating hours
     * @returns {string} Operating hours description
     */
    getOperatingHours() {
        const serviceType = this.#serviceType;
        if (serviceType === 'Hospital') return '24/7';
        if (serviceType === 'Diagnostic') return '8am-8pm';
        return '9am-6pm';
    }

    /**
     * Get average wait time estimate
     * @returns {string} Wait time description
     */
    getAverageWaitTime() {
        const patientsPerDoctor = this.getFootfall() / this.#doctors;
        if (patientsPerDoctor > 50) return '45-60 minutes';
        if (patientsPerDoctor > 30) return '30-45 minutes';
        return '15-30 minutes';
    }
}
