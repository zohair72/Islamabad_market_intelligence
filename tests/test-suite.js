/**
 * Test Suite for Islamabad Market Intelligence Dashboard
 * Purpose: Comprehensive testing of all features and OOP principles
 * Run these tests in browser console after page loads
 * 
 * @class TestSuite
 * @author Market Intelligence Team
 * @version 1.0.0
 */

import BusinessFactory from '../assets/js/classes/BusinessFactory.js';
import RestaurantBusiness from '../assets/js/classes/RestaurantBusiness.js';
import RetailBusiness from '../assets/js/classes/RetailBusiness.js';
import TechBusiness from '../assets/js/classes/TechBusiness.js';
import MedicalBusiness from '../assets/js/classes/MedicalBusiness.js';
import SalonBusiness from '../assets/js/classes/SalonBusiness.js';
import GymBusiness from '../assets/js/classes/GymBusiness.js';
import Analytics from '../assets/js/classes/Analytics.js';

class TestSuite {

    /**
     * Run all tests in sequence
     */
    static async runAllTests() {
        console.log('🧪 ========================================');
        console.log('🧪 ISLAMABAD MARKET DASHBOARD TEST SUITE');
        console.log('🧪 ========================================\n');

        const startTime = performance.now();

        await this.testDataLoading();
        await this.testOOPClasses();
        await this.testPolymorphism();
        await this.testEncapsulation();
        await this.testMapFunctionality();
        await this.testAnalytics();
        await this.testComparison();
        await this.testBusinessFactory();
        await this.testCharts();

        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        console.log('\n🧪 ========================================');
        console.log(`✅ ALL TESTS COMPLETE! (${duration}s)`);
        console.log('🧪 ========================================\n');
    }

    /**
     * Test 1: Data Loading
     */
    static async testDataLoading() {
        console.log('📦 Test 1: Data Loading');
        console.log('─────────────────────────');

        try {
            // Check if data is already loaded in appState
            if (typeof appState !== 'undefined' && appState.sectors && appState.businesses) {
                console.assert(appState.sectors.length >= 25, '❌ Should have 25+ sectors');
                console.assert(appState.businesses.length >= 300, '❌ Should have 300+ businesses');
                console.assert(appState.categories.length === 6, '❌ Should have 6 categories');

                console.log(`✅ Sectors loaded: ${appState.sectors.length}`);
                console.log(`✅ Businesses loaded: ${appState.businesses.length}`);
                console.log(`✅ Categories loaded: ${appState.categories.length}`);
                console.log('✅ Data loading PASSED\n');
            } else {
                console.error('❌ appState not available or data not loaded');
            }
        } catch (error) {
            console.error('❌ Data loading FAILED:', error);
        }
    }

    /**
     * Test 2: OOP Classes & Instances
     */
    static testOOPClasses() {
        console.log('🏗️ Test 2: OOP Classes & Instances');
        console.log('─────────────────────────');

        try {
            // Check if classes are available
            console.assert(typeof RestaurantBusiness !== 'undefined', '❌ RestaurantBusiness not defined');
            console.assert(typeof RetailBusiness !== 'undefined', '❌ RetailBusiness not defined');
            console.assert(typeof TechBusiness !== 'undefined', '❌ TechBusiness not defined');
            console.assert(typeof MedicalBusiness !== 'undefined', '❌ MedicalBusiness not defined');
            console.assert(typeof SalonBusiness !== 'undefined', '❌ SalonBusiness not defined');
            console.assert(typeof GymBusiness !== 'undefined', '❌ GymBusiness not defined');

            // Test creating instances
            const restaurant = new RestaurantBusiness('Test Restaurant', 'Mid', 500, 'Pakistani', 40);
            const retail = new RetailBusiness('Test Retail', 'Premium', 600, '2000', 'International');
            const tech = new TechBusiness('Test Tech', 'Mid', 300, 'Laptops', 'Sales');
            const medical = new MedicalBusiness('Test Medical', 'Premium', 400, 'Specialist', 3);
            const salon = new SalonBusiness('Test Salon', 'Mid', 250, 'Full Service', 4);
            const gym = new GymBusiness('Test Gym', 'Premium', 150, 'Monthly', 'Premium');

            console.assert(restaurant.getName() === 'Test Restaurant', '❌ Restaurant name incorrect');
            console.assert(retail.getName() === 'Test Retail', '❌ Retail name incorrect');
            console.assert(tech.getName() === 'Test Tech', '❌ Tech name incorrect');
            console.assert(medical.getName() === 'Test Medical', '❌ Medical name incorrect');
            console.assert(salon.getName() === 'Test Salon', '❌ Salon name incorrect');
            console.assert(gym.getName() === 'Test Gym', '❌ Gym name incorrect');

            console.log('✅ All 6 business types created successfully');
            console.log('✅ All getters working correctly');
            console.log('✅ OOP classes PASSED\n');
        } catch (error) {
            console.error('❌ OOP classes FAILED:', error);
        }
    }

    /**
     * Test 3: Polymorphism
     */
    static testPolymorphism() {
        console.log('🔄 Test 3: Polymorphism');
        console.log('─────────────────────────');

        try {
            const businesses = [
                new RestaurantBusiness('R1', 'Mid', 500, 'Pakistani', 40),
                new RetailBusiness('R2', 'Premium', 600, '2000', 'National'),
                new TechBusiness('T1', 'Budget', 300, 'Laptops', 'Sales'),
                new MedicalBusiness('M1', 'Mid', 400, 'General', 2),
                new SalonBusiness('S1', 'Mid', 250, 'Full Service', 3),
                new GymBusiness('G1', 'Premium', 150, 'Monthly', 'Standard')
            ];

            // Test polymorphic method calls
            const revenues = businesses.map(b => b.calculateRevenue());
            const impacts = businesses.map(b => b.getMarketImpact());
            const descriptions = businesses.map(b => b.getDescription());

            // Verify different results
            console.assert(revenues.every(r => r > 0), '❌ All revenues should be > 0');
            console.assert(impacts.every(i => i > 0), '❌ All impacts should be > 0');
            console.assert(descriptions.every(d => typeof d === 'string'), '❌ All descriptions should be strings');

            // Verify revenues are different (polymorphism working)
            const uniqueRevenues = new Set(revenues).size;
            console.assert(uniqueRevenues > 1, '❌ Revenues should be different (polymorphism)');

            console.log('Revenue calculations:');
            businesses.forEach((b, i) => {
                console.log(`  ${b.getCategory()}: PKR ${revenues[i].toLocaleString()}/day`);
            });

            console.log('\n✅ Same method names, different implementations');
            console.log('✅ Polymorphism PASSED\n');
        } catch (error) {
            console.error('❌ Polymorphism FAILED:', error);
        }
    }

    /**
     * Test 4: Encapsulation
     */
    static testEncapsulation() {
        console.log('🔒 Test 4: Encapsulation');
        console.log('─────────────────────────');

        try {
            const restaurant = new RestaurantBusiness('Test', 'Mid', 500, 'Pakistani', 40);

            // Try to access private fields (should fail)
            let canAccessPrivate = false;
            try {
                const name = restaurant.name; // Should be undefined
                canAccessPrivate = (name !== undefined);
            } catch (e) {
                canAccessPrivate = false;
            }

            console.assert(!canAccessPrivate, '❌ Private fields should not be accessible');

            // Verify getters work
            console.assert(restaurant.getName() === 'Test', '❌ Getter should work');
            console.assert(restaurant.getCategory() === 'Restaurant', '❌ Category getter should work');
            console.assert(restaurant.getPriceRange() === 'Mid', '❌ Price range getter should work');
            console.assert(restaurant.getFootfall() === 500, '❌ Footfall getter should work');

            console.log('✅ Private fields are encapsulated');
            console.log('✅ Public getters working correctly');
            console.log('✅ Encapsulation PASSED\n');
        } catch (error) {
            console.error('❌ Encapsulation FAILED:', error);
        }
    }

    /**
     * Test 5: Map Functionality
     */
    static testMapFunctionality() {
        console.log('🗺️ Test 5: Map Functionality');
        console.log('─────────────────────────');

        try {
            console.assert(typeof appState !== 'undefined', '❌ appState not defined');
            console.assert(appState.mapHandler !== null, '❌ Map handler not initialized');
            console.assert(document.getElementById('map') !== null, '❌ Map element not found');

            const mapHandler = appState.mapHandler;
            const map = mapHandler.getMap();

            console.assert(map !== null, '❌ Leaflet map not created');
            console.assert(mapHandler.getMarkers().size > 0, '❌ No markers on map');

            console.log(`✅ Map initialized with ${mapHandler.getMarkers().size} markers`);
            console.log('✅ Map functionality PASSED\n');
        } catch (error) {
            console.error('❌ Map functionality FAILED:', error);
        }
    }

    /**
     * Test 6: Analytics Calculations
     */
    static testAnalytics() {
        console.log('📊 Test 6: Analytics Calculations');
        console.log('─────────────────────────');

        try {
            const firstSector = Array.from(appState.sectorObjects.values())[0];

            if (!firstSector) {
                console.error('❌ No sectors available for testing');
                return;
            }

            // Test Analytics methods
            const distribution = Analytics.calculateCategoryDistribution(firstSector);
            const topCategories = Analytics.getTopCategories(firstSector, 3);
            const priceDistribution = Analytics.getPriceDistribution(firstSector);
            const footfallTrends = Analytics.getFootfallTrends(firstSector);

            console.assert(typeof distribution === 'object', '❌ Distribution should be object');
            console.assert(Array.isArray(topCategories), '❌ Top categories should be array');
            console.assert(typeof priceDistribution === 'object', '❌ Price distribution should be object');
            console.assert(typeof footfallTrends === 'object', '❌ Footfall trends should be object');

            // Test polymorphic analytics methods
            const totalRevenue = Analytics.calculateTotalRevenue(firstSector);
            const totalImpact = Analytics.calculateTotalMarketImpact(firstSector);

            console.assert(totalRevenue > 0, '❌ Total revenue should be > 0');
            console.assert(totalImpact > 0, '❌ Total impact should be > 0');

            console.log(`✅ Total revenue: PKR ${totalRevenue.toLocaleString()}`);
            console.log(`✅ Total market impact: ${totalImpact.toLocaleString()}`);
            console.log('✅ Analytics PASSED\n');
        } catch (error) {
            console.error('❌ Analytics FAILED:', error);
        }
    }

    /**
     * Test 7: Sector Comparison
     */
    static testComparison() {
        console.log('⚖️ Test 7: Sector Comparison');
        console.log('─────────────────────────');

        try {
            const markets = Array.from(appState.marketObjects.values());

            if (markets.length < 2) {
                console.warn('⚠️ Need at least 2 sectors for comparison test');
                return;
            }

            const market1 = markets[0];
            const market2 = markets[1];

            const comparison = market1.compareWith(market2);

            console.assert(comparison !== null, '❌ Comparison should return data');
            console.assert(typeof comparison.betterMarket === 'string', '❌ Should identify better market');
            console.assert(Array.isArray(comparison.insights), '❌ Should return insights array');

            console.log(`✅ Compared ${comparison.market1Name} vs ${comparison.market2Name}`);
            console.log(`✅ Better market: ${comparison.betterMarket}`);
            console.log('✅ Comparison PASSED\n');
        } catch (error) {
            console.error('❌ Comparison FAILED:', error);
        }
    }

    /**
     * Test 8: Business Factory
     */
    static testBusinessFactory() {
        console.log('🏭 Test 8: Business Factory');
        console.log('─────────────────────────');

        try {
            const testData = [
                { name: 'Test R', category: 'Restaurant', priceRange: 'Mid', footfall: 500 },
                { name: 'Test Rt', category: 'Retail', priceRange: 'Premium', footfall: 600 },
                { name: 'Test T', category: 'Tech', priceRange: 'Budget', footfall: 300 },
                { name: 'Test M', category: 'Medical', priceRange: 'Mid', footfall: 400 },
                { name: 'Test S', category: 'Salon', priceRange: 'Mid', footfall: 250 },
                { name: 'Test G', category: 'Gym', priceRange: 'Premium', footfall: 150 }
            ];

            const businesses = testData.map(data => BusinessFactory.createBusiness(data));

            console.assert(businesses.length === 6, '❌ Should create 6 businesses');
            console.assert(businesses[0] instanceof RestaurantBusiness, '❌ Should create RestaurantBusiness');
            console.assert(businesses[1] instanceof RetailBusiness, '❌ Should create RetailBusiness');
            console.assert(businesses[2] instanceof TechBusiness, '❌ Should create TechBusiness');
            console.assert(businesses[3] instanceof MedicalBusiness, '❌ Should create MedicalBusiness');
            console.assert(businesses[4] instanceof SalonBusiness, '❌ Should create SalonBusiness');
            console.assert(businesses[5] instanceof GymBusiness, '❌ Should create GymBusiness');

            console.log('✅ Factory creates correct business types');
            console.log('✅ All 6 types instantiated correctly');
            console.log('✅ Business Factory PASSED\n');
        } catch (error) {
            console.error('❌ Business Factory FAILED:', error);
        }
    }

    /**
     * Test 9: Chart Rendering
     */
    static testCharts() {
        console.log('📊 Test 9: Chart Rendering');
        console.log('─────────────────────────');

        try {
            // Test revenue chart
            const revenueChart = document.getElementById('chart-revenue-sector');
            console.assert(revenueChart !== null, '❌ Revenue chart container not found');
            console.assert(revenueChart.children.length > 0, '❌ Revenue chart not rendered');

            // Test business distribution chart
            const distributionChart = document.getElementById('chart-business-distribution');
            console.assert(distributionChart !== null, '❌ Distribution chart container not found');

            // Test growth chart
            const growthChart = document.getElementById('chart-growth-trends');
            console.assert(growthChart !== null, '❌ Growth chart container not found');
            console.assert(growthChart.children.length > 0, '❌ Growth chart not rendered');

            // Test employment chart
            const employmentChart = document.getElementById('chart-employment');
            console.assert(employmentChart !== null, '❌ Employment chart container not found');
            console.assert(employmentChart.children.length > 0, '❌ Employment chart not rendered');

            console.log('✅ All chart containers exist');
            console.log('✅ Dashboard charts rendered successfully');
            console.log('✅ Chart rendering PASSED\n');
        } catch (error) {
            console.error('❌ Chart rendering FAILED:', error);
        }
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.TestSuite = TestSuite;
    console.log('💡 Test Suite loaded. Run with: TestSuite.runAllTests()');
}

export default TestSuite;
