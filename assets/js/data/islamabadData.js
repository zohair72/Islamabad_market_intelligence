/**
 * Islamabad Market Data
 * Purpose: Contains sample data for Islamabad markets, sectors, and businesses
 * This file serves as the data source for the dashboard application
 */

export const islamabadMarkets = [
    {
        id: 'M001',
        name: 'Blue Area',
        location: { lat: 33.7077, lng: 73.0478 },
        type: 'Commercial'
    },
    {
        id: 'M002',
        name: 'F-7 Markaz',
        location: { lat: 33.7215, lng: 73.0433 },
        type: 'Retail'
    },
    {
        id: 'M003',
        name: 'Jinnah Super Market',
        location: { lat: 33.7294, lng: 73.0931 },
        type: 'Mixed'
    }
];

export const islamabadSectors = [
    {
        id: 'S001',
        name: 'Information Technology',
        industryType: 'Technology',
        marketId: 'M001'
    },
    {
        id: 'S002',
        name: 'Retail & Fashion',
        industryType: 'Retail',
        marketId: 'M002'
    },
    {
        id: 'S003',
        name: 'Food & Beverage',
        industryType: 'Hospitality',
        marketId: 'M003'
    }
];

export const islamabadBusinesses = [
    {
        id: 'B001',
        name: 'Tech Solutions Pvt Ltd',
        sectorId: 'S001',
        marketId: 'M001',
        revenue: 5000000,
        employees: 50
    },
    {
        id: 'B002',
        name: 'Fashion Hub',
        sectorId: 'S002',
        marketId: 'M002',
        revenue: 2000000,
        employees: 25
    },
    {
        id: 'B003',
        name: 'Café Delight',
        sectorId: 'S003',
        marketId: 'M003',
        revenue: 1500000,
        employees: 15
    }
];

/**
 * Get all market data
 * @returns {Object} Complete market data
 */
export function getAllMarketData() {
    return {
        markets: islamabadMarkets,
        sectors: islamabadSectors,
        businesses: islamabadBusinesses
    };
}
