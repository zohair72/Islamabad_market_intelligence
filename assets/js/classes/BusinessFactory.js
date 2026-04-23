/**
 * BusinessFactory Class
 * Purpose: Factory pattern to create appropriate Business subclass instances
 * Based on category, creates the correct specialized business type
 * This demonstrates the Factory Design Pattern
 * 
 * @class BusinessFactory
 * @author Market Intelligence Team
 * @version 1.0.0
 */

import RestaurantBusiness from './RestaurantBusiness.js';
import RetailBusiness from './RetailBusiness.js';
import TechBusiness from './TechBusiness.js';
import MedicalBusiness from './MedicalBusiness.js';
import SalonBusiness from './SalonBusiness.js';
import GymBusiness from './GymBusiness.js';

export default class BusinessFactory {
    /**
     * Create appropriate Business subclass based on category
     * @param {Object} data - Business data object
     * @param {string} data.name - Business name
     * @param {string} data.category - Business category
     * @param {string} data.priceRange - Price range (Budget/Mid/Premium)
     * @param {number} data.footfall - Daily footfall
     * @returns {Business} Appropriate Business subclass instance
     * @throws {Error} If category is unknown
     */
    static createBusiness(data) {
        const { name, category, priceRange, footfall, ...extraData } = data;

        // Validate required fields
        if (!name || !category || !priceRange || footfall === undefined) {
            throw new Error('Missing required business data fields');
        }

        // Create appropriate subclass based on category
        switch (category) {
            case 'Restaurant':
                return new RestaurantBusiness(
                    name,
                    priceRange,
                    footfall,
                    extraData.cuisineType || 'Pakistani',
                    extraData.seatingCapacity || 40
                );

            case 'Retail':
                return new RetailBusiness(
                    name,
                    priceRange,
                    footfall,
                    extraData.storeSize || '1000',
                    extraData.brandType || 'Local'
                );

            case 'Tech':
                return new TechBusiness(
                    name,
                    priceRange,
                    footfall,
                    extraData.specialization || 'General',
                    extraData.serviceType || 'Sales'
                );

            case 'Medical':
                return new MedicalBusiness(
                    name,
                    priceRange,
                    footfall,
                    extraData.serviceType || 'General',
                    extraData.doctors || 2
                );

            case 'Salon':
                return new SalonBusiness(
                    name,
                    priceRange,
                    footfall,
                    extraData.serviceOffered || 'Full Service',
                    extraData.staffCount || 3
                );

            case 'Gym':
                return new GymBusiness(
                    name,
                    priceRange,
                    footfall,
                    extraData.membershipType || 'Monthly',
                    extraData.equipment || 'Standard'
                );

            default:
                throw new Error(`Unknown business category: ${category}. Valid categories are: Restaurant, Retail, Tech, Medical, Salon, Gym`);
        }
    }

    /**
     * Create multiple businesses from an array of data
     * @param {Array<Object>} dataArray - Array of business data objects
     * @returns {Array<Business>} Array of Business subclass instances
     */
    static createMultipleBusinesses(dataArray) {
        if (!Array.isArray(dataArray)) {
            throw new Error('Data must be an array');
        }

        return dataArray.map(data => {
            try {
                return this.createBusiness(data);
            } catch (error) {
                console.error(`Error creating business from data:`, data, error);
                return null;
            }
        }).filter(business => business !== null);
    }

    /**
     * Get list of supported business categories
     * @returns {Array<string>} List of supported categories
     */
    static getSupportedCategories() {
        return ['Restaurant', 'Retail', 'Tech', 'Medical', 'Salon', 'Gym'];
    }

    /**
     * Check if a category is supported
     * @param {string} category - Category to check
     * @returns {boolean} True if supported
     */
    static isCategorySupported(category) {
        return this.getSupportedCategories().includes(category);
    }
}
