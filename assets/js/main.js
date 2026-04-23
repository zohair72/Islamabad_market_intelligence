/**
 * Main Application Controller
 * Purpose: Initializes and manages the Islamabad Market Intelligence Dashboard
 * Connects all components: DataLoader, MapHandler, Business, Sector, Market, Analytics
 * 
 * @author Market Intelligence Team
 * @version 1.0.0
 */

// Import all required classes
import DataLoader from './data/dataLoader.js';
import MapHandler from './utils/mapHandler.js';
import ChartHandler from './utils/chartHandler.js';
import BusinessFactory from './classes/BusinessFactory.js';
import RestaurantBusiness from './classes/RestaurantBusiness.js';
import RetailBusiness from './classes/RetailBusiness.js';
import TechBusiness from './classes/TechBusiness.js';
import MedicalBusiness from './classes/MedicalBusiness.js';
import SalonBusiness from './classes/SalonBusiness.js';
import GymBusiness from './classes/GymBusiness.js';
import Sector from './classes/Sector.js';
import Market from './classes/Market.js';
import Analytics from './classes/Analytics.js';

// Global error handlers
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showErrorMessage('An unexpected error occurred. Please refresh the page.');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showErrorMessage('Failed to load data. Please check your connection and refresh.');
});

/**
 * Display error message to user
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md';
    errorDiv.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="text-2xl">⚠️</span>
            <span class="flex-1">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 font-bold hover:text-gray-200">✕</button>
        </div>
    `;
    document.body.appendChild(errorDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// Global application state
let appState = {
    sectors: [],              // Raw sector data from JSON
    businesses: [],           // Raw business data from JSON
    categories: [],           // Raw category data from JSON
    sectorObjects: new Map(), // Map of Sector class instances (sectorId -> Sector)
    marketObjects: new Map(), // Map of Market class instances (sectorId -> Market)
    selectedSector: null,     // Currently selected sector ID
    comparisonSector: null,   // Sector selected for comparison
    mapHandler: null,         // MapHandler instance
    activeFilters: {
        category: null,
        priceRange: null
    }
};

// Make appState globally available for ChartHandler
window.appState = appState;
Object.assign(window, {
    BusinessFactory,
    RestaurantBusiness,
    RetailBusiness,
    TechBusiness,
    MedicalBusiness,
    SalonBusiness,
    GymBusiness,
    Sector,
    Market,
    Analytics
});

// DOM element references
const ELEMENTS = {
    // Map
    map: document.getElementById('map'),

    // Sidebar
    marketFilter: document.getElementById('market-filter'),
    sectorCheckboxes: document.querySelectorAll('.sector-checkbox'),
    applyFiltersBtn: document.getElementById('apply-filters'),

    // Stats
    totalMarkets: document.getElementById('total-markets'),
    totalSectors: document.getElementById('total-sectors'),
    totalBusinesses: document.getElementById('total-businesses'),

    // Metrics
    metricRevenue: document.getElementById('metric-revenue'),
    metricBusinesses: document.getElementById('metric-businesses'),
    metricEmployment: document.getElementById('metric-employment'),
    metricMargin: document.getElementById('metric-margin'),

    // Business table
    businessTableBody: document.getElementById('business-table-body'),

    // Mobile menu
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    mobileMenu: document.getElementById('mobile-menu')
};

/**
 * Main initialization function
 * Loads data, initializes map, creates class instances, and sets up UI
 */
async function initializeApp() {
    try {
        console.log('🚀 Initializing Islamabad Market Intelligence Dashboard...');

        // Show loading state
        showLoading(true);

        // Step 1: Load all JSON data
        console.log('📊 Loading data...');
        const data = await DataLoader.loadAllData();

        // Store raw data in state
        appState.sectors = data.sectors;
        appState.businesses = data.businesses;
        appState.categories = data.categories;

        // Validate data
        DataLoader.validateData(data);

        // Step 2: Initialize map
        console.log('🗺️ Initializing map...');
        appState.mapHandler = new MapHandler('map');
        appState.mapHandler.initializeMap();

        // Step 3: Create class instances
        console.log('🏗️ Creating class instances...');
        createClassInstances(appState.sectors, appState.businesses);

        // Add markers after market objects are created
        appState.mapHandler.addSectorMarkers(appState.sectors);

        // Step 4: Populate UI
        console.log('🎨 Populating UI...');
        populateSectorList(appState.sectors);
        updateDashboardStats();
        displayAllBusinesses();

        // Step 5: Attach event listeners
        console.log('🔗 Attaching event listeners...');
        attachEventListeners();

        // Step 6: Set up global functions for popup buttons
        setupGlobalFunctions();

        // Hide loading state
        showLoading(false);

        // Step 7: Render dashboard charts
        renderDashboardCharts();

        console.log('✅ Dashboard initialized successfully!');
        console.log(`📍 Loaded ${appState.sectors.length} sectors`);
        console.log(`🏢 Loaded ${appState.businesses.length} businesses`);

    } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        showError('Failed to load dashboard. Please refresh the page.');
        showLoading(false);
    }
}

/**
 * Create Sector, Business, and Market class instances from JSON data
 * @param {Array} sectorsData - Raw sector data from JSON
 * @param {Array} businessesData - Raw business data from JSON
 */
function createClassInstances(sectorsData, businessesData) {
    try {
        // Create Sector instances
        sectorsData.forEach(sectorData => {
            const sector = new Sector(
                sectorData.name,
                sectorData.coordinates,
                sectorData.population,
                sectorData.accessibility
            );

            appState.sectorObjects.set(sectorData.id, sector);
        });

        // Create Business instances and add to sectors
        businessesData.forEach(businessData => {
            try {
                // Use BusinessFactory to create appropriate subclass (POLYMORPHISM!)
                const business = BusinessFactory.createBusiness(businessData);

                // Add business to its sector
                const sector = appState.sectorObjects.get(businessData.sectorId);
                if (sector) {
                    sector.addBusiness(business);
                } else {
                    console.warn(`Sector ${businessData.sectorId} not found for business ${businessData.name}`);
                }
            } catch (error) {
                console.warn(`Error creating business ${businessData.name}:`, error.message);
            }
        });

        // Create Market instances for each sector
        appState.sectorObjects.forEach((sector, sectorId) => {
            const market = new Market(sector);
            appState.marketObjects.set(sectorId, market);
        });

        console.log(`✓ Created ${appState.sectorObjects.size} sector instances`);
        console.log(`✓ Created ${appState.marketObjects.size} market instances`);

        // Demonstrate polymorphism with first sector that has businesses
        if (appState.sectorObjects.size > 0) {
            for (const sector of appState.sectorObjects.values()) {
                if (sector.getBusinesses().length > 0) {
                    demonstratePolymorphism(sector);
                    break;
                }
            }
        }

    } catch (error) {
        console.error('Error creating class instances:', error);
        throw error;
    }
}

/**
 * Demonstrate Polymorphism - Same method calls, different behaviors
 * This function shows how different business types respond differently to the same method calls
 * @param {Sector} sector - Sector containing various business types
 */
function demonstratePolymorphism(sector) {
    console.log('\n=== 🎯 POLYMORPHISM DEMONSTRATION ===');
    console.log(`Sector: ${sector.getName()}`);
    console.log('Calling the SAME methods on different business types...\n');

    const businesses = sector.getBusinesses();

    // Take first 6 businesses (one of each type ideally)
    const sampleBusinesses = businesses.slice(0, Math.min(6, businesses.length));

    sampleBusinesses.forEach((business, index) => {
        console.log(`${index + 1}. ${business.getName()}`);
        console.log(`   Type: ${business.getCategory()}`);
        console.log(`   Revenue: PKR ${business.calculateRevenue().toLocaleString()}/day`);
        console.log(`   Market Impact: ${business.getMarketImpact().toLocaleString()}`);
        console.log(`   Description: ${business.getDescription()}`);
        console.log(`   Profit Margin: ${business.getProfitMargin()}%`);
        console.log('   ---');
    });

    console.log('✅ POLYMORPHISM: Same method names (calculateRevenue, getMarketImpact, getDescription)');
    console.log('   but DIFFERENT implementations and results based on business type!');
    console.log('=== END POLYMORPHISM DEMONSTRATION ===\n');
}

/**
 * Render all dashboard charts
 * Uses polymorphism to calculate revenue from different business types
 */
function renderDashboardCharts() {
    console.log('📊 Rendering dashboard charts...');

    // Only render if we have data
    if (!appState.sectorObjects || appState.sectorObjects.size === 0) {
        console.warn('No sector data available for charts');
        return;
    }

    try {
        // Render Revenue by Sector (top 10)
        ChartHandler.renderRevenueChart('chart-revenue-sector', appState.sectorObjects);

        // Render Global Business Distribution
        ChartHandler.renderBusinessDistribution('chart-business-distribution', appState.businesses);

        // Render Growth Trends
        ChartHandler.renderGrowthTrends('chart-growth-trends', appState.sectorObjects);

        // Render Employment Statistics
        ChartHandler.renderEmploymentStats('chart-employment', appState.sectorObjects);

        console.log('✅ Dashboard charts rendered successfully');
    } catch (error) {
        console.error('Error rendering dashboard charts:', error);
    }
}

/**
 * Render sector-specific charts when a sector is selected
 * @param {string} sectorName - Name of the selected sector
 */
function renderSectorCharts(sectorName) {
    const sector = appState.sectorObjects.get(sectorName);

    if (!sector) {
        console.warn('Sector not found:', sectorName);
        return;
    }

    try {
        // Render Business Distribution for selected sector
        ChartHandler.renderBusinessDistribution('chart-business-distribution', sector);

        console.log('✅ Sector charts rendered for:', sectorName);
    } catch (error) {
        console.error('Error rendering sector charts:', error);
    }
}

/**
 * Refresh all charts with current data
 */
function refreshAllCharts() {
    console.log('🔄 Refreshing all charts...');

    // Re-render dashboard charts
    renderDashboardCharts();

    // Re-render sector charts if a sector is selected
    if (appState.selectedSector) {
        renderSectorCharts(appState.selectedSector);
    }

    console.log('✅ Charts refreshed successfully');
}

/**
 * Populate sector list in sidebar
 * @param {Array} sectors - Array of sector data
 */
function populateSectorList(sectors) {
    const marketFilter = ELEMENTS.marketFilter;
    if (!marketFilter) return;

    // Keep "All Markets" option
    marketFilter.innerHTML = '<option value="all">All Markets</option>';

    // Sort sectors alphabetically
    const sortedSectors = [...sectors].sort((a, b) => a.name.localeCompare(b.name));

    // Add sector options
    sortedSectors.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector.id;
        option.textContent = sector.name;
        marketFilter.appendChild(option);
    });
}

/**
 * Update dashboard statistics
 */
function updateDashboardStats() {
    // Update quick stats in sidebar
    if (ELEMENTS.totalMarkets) {
        ELEMENTS.totalMarkets.textContent = appState.sectors.length;
    }

    if (ELEMENTS.totalSectors) {
        ELEMENTS.totalSectors.textContent = appState.sectorObjects.size;
    }

    if (ELEMENTS.totalBusinesses) {
        ELEMENTS.totalBusinesses.textContent = appState.businesses.length;
    }

    // Calculate overall metrics
    let totalRevenue = 0;
    let totalEmployment = 0;
    let totalProfitMargin = 0;
    let businessCount = 0;

    appState.sectorObjects.forEach(sector => {
        totalRevenue += sector.getTotalRevenue();
        sector.getBusinesses().forEach(business => {
            totalEmployment += business.getFootfall() * 0.1; // Estimate: 10% of footfall as employees
            totalProfitMargin += parseFloat(business.getProfitMargin());
            businessCount++;
        });
    });

    // Update metric cards
    if (ELEMENTS.metricRevenue) {
        ELEMENTS.metricRevenue.textContent = `PKR ${(totalRevenue / 1000000).toFixed(1)}M`;
    }

    if (ELEMENTS.metricBusinesses) {
        ELEMENTS.metricBusinesses.textContent = businessCount;
    }

    if (ELEMENTS.metricEmployment) {
        ELEMENTS.metricEmployment.textContent = Math.round(totalEmployment);
    }

    if (ELEMENTS.metricMargin) {
        const avgMargin = businessCount > 0 ? (totalProfitMargin / businessCount) : 0;
        ELEMENTS.metricMargin.textContent = `${avgMargin.toFixed(1)}%`;
    }
}

/**
 * Display all businesses in the table
 * @param {Array} businessesToDisplay - Optional filtered list of businesses
 */
function displayAllBusinesses(businessesToDisplay = null) {
    const tableBody = ELEMENTS.businessTableBody;
    if (!tableBody) return;

    tableBody.innerHTML = '';

    const businesses = businessesToDisplay || appState.businesses;

    // Limit to first 50 for performance
    const displayLimit = 50;
    const limitedBusinesses = businesses.slice(0, displayLimit);

    limitedBusinesses.forEach(businessData => {
        const sector = appState.sectors.find(s => s.id === businessData.sectorId);
        const sectorName = sector ? sector.name : 'Unknown';

        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-6 py-4 font-medium text-gray-900">${businessData.name}</td>
            <td class="px-6 py-4 text-gray-700">${businessData.category}</td>
            <td class="px-6 py-4 text-gray-700">${sectorName}</td>
            <td class="px-6 py-4 text-gray-700">PKR ${((businessData.footfall * 0.3 * getPriceValue(businessData.priceRange)) / 1000).toFixed(1)}K</td>
            <td class="px-6 py-4 text-gray-700">${Math.round(businessData.footfall * 0.1)}</td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
            </td>
        `;

        tableBody.appendChild(row);
    });

    if (businesses.length > displayLimit) {
        const moreRow = document.createElement('tr');
        moreRow.innerHTML = `
            <td colspan="6" class="px-6 py-4 text-center text-gray-500 italic">
                Showing ${displayLimit} of ${businesses.length} businesses
            </td>
        `;
        tableBody.appendChild(moreRow);
    }
}

/**
 * Get numeric price value for calculations
 * @param {string} priceRange - Price range (Budget/Mid/Premium)
 * @returns {number} Price value
 */
function getPriceValue(priceRange) {
    const prices = {
        'Budget': 500,
        'Mid': 1500,
        'Premium': 3500
    };
    return prices[priceRange] || 1000;
}

/**
 * Select a sector and display its analytics
 * @param {string} sectorId - ID of the sector to select
 */
function selectSector(sectorId) {
    if (!sectorId || sectorId === 'all') {
        resetDashboard();
        return;
    }

    try {
        // Update state
        appState.selectedSector = sectorId;

        // Highlight on map
        appState.mapHandler.highlightSector(sectorId);

        // Display analytics
        displaySectorAnalytics(sectorId);

        // Update UI
        console.log(`✓ Selected sector: ${sectorId}`);

    } catch (error) {
        console.error('Error selecting sector:', error);
        showError('Failed to select sector');
    }
}

/**
 * Display analytics for selected sector
 * @param {string} sectorId - ID of the sector
 */
function displaySectorAnalytics(sectorId) {
    const market = appState.marketObjects.get(sectorId);
    const sector = appState.sectorObjects.get(sectorId);

    if (!market || !sector) {
        console.warn('Market or sector not found:', sectorId);
        return;
    }

    // Get market analysis
    const analysis = market.getMarketAnalysis();

    // Update metrics with sector-specific data
    const sectorRevenue = sector.getTotalRevenue();
    const sectorBusinesses = sector.getBusinesses().length;
    const sectorEmployment = Math.round(sector.getTotalFootfall() * 0.1);

    if (ELEMENTS.metricRevenue) {
        ELEMENTS.metricRevenue.textContent = `PKR ${(sectorRevenue / 1000000).toFixed(1)}M`;
    }

    if (ELEMENTS.metricBusinesses) {
        ELEMENTS.metricBusinesses.textContent = sectorBusinesses;
    }

    if (ELEMENTS.metricEmployment) {
        ELEMENTS.metricEmployment.textContent = sectorEmployment;
    }

    // Filter and display businesses from this sector
    const sectorBusinessesData = appState.businesses.filter(b => b.sectorId === sectorId);
    displayAllBusinesses(sectorBusinessesData);

    // Display insights
    displayInsights(market);

    // Render sector-specific charts
    renderSectorCharts(sectorId);

    console.log('📊 Analytics displayed for:', analysis.sectorName);
}

/**
 * Display insights for a market
 * @param {Market} market - Market instance
 */
function displayInsights(market) {
    const insights = Analytics.generateInsights(market);

    console.log('💡 Generated insights:', insights);

    // You can display these in a dedicated insights panel
    // For now, we'll log them to console
    insights.forEach(insight => {
        console.log(`${insight.icon} [${insight.priority}] ${insight.message}`);
    });
}

/**
 * Filter businesses by category
 * @param {string} category - Category to filter by
 */
function filterByCategory(category) {
    if (!category) {
        resetDashboard();
        return;
    }

    try {
        // Update state
        appState.activeFilters.category = category;

        // Filter map markers
        appState.mapHandler.filterMarkersByCategory(category, appState.businesses);

        // Filter business table
        const filteredBusinesses = appState.businesses.filter(
            b => b.category.toLowerCase() === category.toLowerCase()
        );

        displayAllBusinesses(filteredBusinesses);

        console.log(`✓ Filtered by category: ${category}`);

    } catch (error) {
        console.error('Error filtering by category:', error);
    }
}

/**
 * Reset dashboard to initial state
 */
function resetDashboard() {
    try {
        // Clear selected sector
        appState.selectedSector = null;
        appState.comparisonSector = null;

        // Clear filters
        appState.activeFilters = {
            category: null,
            priceRange: null
        };

        // Reset map
        if (appState.mapHandler) {
            appState.mapHandler.resetMap();
        }

        // Reset market filter dropdown
        if (ELEMENTS.marketFilter) {
            ELEMENTS.marketFilter.value = 'all';
        }

        // Update stats to show all data
        updateDashboardStats();

        // Display all businesses
        displayAllBusinesses();

        console.log('✓ Dashboard reset to initial state');

    } catch (error) {
        console.error('Error resetting dashboard:', error);
    }
}

/**
 * Attach event listeners to UI elements
 */
function attachEventListeners() {
    // Market filter dropdown
    if (ELEMENTS.marketFilter) {
        ELEMENTS.marketFilter.addEventListener('change', (e) => {
            selectSector(e.target.value);
        });
    }

    // Apply filters button
    if (ELEMENTS.applyFiltersBtn) {
        ELEMENTS.applyFiltersBtn.addEventListener('click', () => {
            const selectedMarket = ELEMENTS.marketFilter?.value;
            if (selectedMarket && selectedMarket !== 'all') {
                selectSector(selectedMarket);
            }
        });
    }

    // Sector checkboxes (for category filtering)
    ELEMENTS.sectorCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Get all checked categories
            const checkedCategories = Array.from(ELEMENTS.sectorCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            // For now, just log - you can implement multi-category filtering
            console.log('Selected categories:', checkedCategories);
        });
    });

    // Mobile menu toggle
    if (ELEMENTS.mobileMenuBtn && ELEMENTS.mobileMenu) {
        ELEMENTS.mobileMenuBtn.addEventListener('click', () => {
            ELEMENTS.mobileMenu.classList.toggle('hidden');
        });
    }

    console.log('✓ Event listeners attached');
}

/**
 * Setup global functions accessible from popup buttons
 */
function setupGlobalFunctions() {
    // Make viewSectorDetails available globally for popup buttons
    window.viewSectorDetails = function (sectorId) {
        selectSector(sectorId);

        // Scroll to analytics section
        const analyticsSection = document.getElementById('analytics-dashboard');
        if (analyticsSection) {
            analyticsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    console.log('✓ Global functions registered');
}

/**
 * Show/hide loading indicator
 * @param {boolean} show - Whether to show loading
 */
function showLoading(show) {
    // You can implement a loading spinner here
    console.log(show ? '⏳ Loading...' : '✓ Loading complete');
}

/**
 * Show error message to user
 * @param {string} message - Error message to display
 */
function showError(message) {
    console.error('❌ Error:', message);
    // You can implement a toast/alert here
    alert(message);
}

/**
 * Compare two sectors
 * @param {string} sector1Id - First sector ID
 * @param {string} sector2Id - Second sector ID
 */
function compareSectors(sector1Id, sector2Id) {
    if (!sector1Id || !sector2Id) {
        console.warn('Both sector IDs required for comparison');
        return;
    }

    const market1 = appState.marketObjects.get(sector1Id);
    const market2 = appState.marketObjects.get(sector2Id);

    if (!market1 || !market2) {
        console.warn('One or both markets not found');
        return;
    }

    try {
        // Use Market's compareWith method
        const comparison = market1.compareWith(market2);

        console.log('📊 Sector Comparison:', comparison);

        // Highlight both sectors on map
        appState.mapHandler.highlightSector(sector1Id);

        // Display comparison results
        // You can create a dedicated comparison panel
        alert(`Comparison Results:\n\nBetter Market: ${comparison.betterMarket}\n\nInsights:\n${comparison.insights.join('\n')}`);

    } catch (error) {
        console.error('Error comparing sectors:', error);
        showError('Failed to compare sectors');
    }
}

/**
 * Get nearby sectors for a given sector
 * @param {string} sectorId - Center sector ID
 * @param {number} radius - Radius in kilometers
 */
function showNearbySectors(sectorId, radius = 5) {
    if (!sectorId) return;

    try {
        const nearbySectors = appState.mapHandler.getNearbySectors(sectorId, radius);

        console.log(`📍 Nearby sectors (within ${radius}km):`, nearbySectors);

        // You can display these in a panel or list
        return nearbySectors;

    } catch (error) {
        console.error('Error getting nearby sectors:', error);
    }
}

/**
 * Final validation on app load
 * Checks that all components are working correctly
 */
async function validateApplication() {
    console.log('\n🔍 ========================================');
    console.log('🔍 APPLICATION VALIDATION');
    console.log('🔍 ========================================\n');

    const checks = [];

    // Check 1: Data loaded
    checks.push({
        name: 'Data Loading',
        pass: appState.sectors.length > 0 && appState.businesses.length > 0 && appState.categories.length > 0,
        details: `${appState.sectors.length} sectors, ${appState.businesses.length} businesses, ${appState.categories.length} categories`
    });

    // Check 2: OOP instances created
    checks.push({
        name: 'OOP Instances',
        pass: appState.sectorObjects.size > 0 && appState.marketObjects.size > 0,
        details: `${appState.sectorObjects.size} sector objects, ${appState.marketObjects.size} market objects`
    });

    // Check 3: Map initialized
    checks.push({
        name: 'Map Initialization',
        pass: appState.mapHandler !== null && appState.mapHandler.getMap() !== null,
        details: appState.mapHandler ? `${appState.mapHandler.getMarkers().size} markers` : 'Not initialized'
    });

    // Check 4: Polymorphism working
    let polymorphismWorks = false;
    try {
        const firstSector = Array.from(appState.sectorObjects.values())[0];
        if (firstSector) {
            const businesses = firstSector.getBusinesses();
            if (businesses.length > 0) {
                const testBusiness = businesses[0];
                polymorphismWorks = typeof testBusiness.calculateRevenue === 'function' &&
                    typeof testBusiness.getMarketImpact === 'function';
            }
        }
    } catch (e) {
        polymorphismWorks = false;
    }

    checks.push({
        name: 'Polymorphism',
        pass: polymorphismWorks,
        details: polymorphismWorks ? 'Business methods callable' : 'Not working'
    });

    // Check 5: UI Elements
    const uiElements = [
        document.getElementById('map'),
        document.getElementById('market-filter'),
        document.getElementById('business-table-body')
    ];
    checks.push({
        name: 'UI Elements',
        pass: uiElements.every(el => el !== null),
        details: `${uiElements.filter(el => el !== null).length}/${uiElements.length} elements found`
    });

    // Log results
    checks.forEach(check => {
        const icon = check.pass ? '✅' : '❌';
        console.log(`${icon} ${check.name}: ${check.details}`);
    });

    const allPassed = checks.every(c => c.pass);

    console.log('\n🔍 ========================================');
    if (allPassed) {
        console.log('🎉 APPLICATION READY FOR USE!');
        console.log('💡 Run TestSuite.runAllTests() for comprehensive testing');
    } else {
        console.error('⚠️ SOME CHECKS FAILED - Review errors above');
    }
    console.log('🔍 ========================================\n');

    return allPassed;
}

// Initialize app on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initializeApp();
        await validateApplication();
    } catch (error) {
        console.error('Fatal error during initialization:', error);
        showError('Failed to initialize dashboard. Please refresh the page.');
    }
});

/**
 * Debug function to check chart rendering
 */
function debugCharts() {
    console.log('=== CHART DEBUG INFO ===');
    console.log('Total sectors:', appState.sectorObjects?.size || 0);
    console.log('Total businesses:', appState.businesses?.length || 0);

    // Check containers
    const containers = [
        'chart-revenue-sector',
        'chart-business-distribution',
        'chart-growth-trends',
        'chart-employment'
    ];

    containers.forEach(id => {
        const el = document.getElementById(id);
        console.log(`Container ${id}:`, el ? 'EXISTS' : 'MISSING');
        if (el) {
            console.log(`  - Has content:`, el.innerHTML.length > 0);
            console.log(`  - Children:`, el.children.length);
        }
    });

    // Check if sector is selected
    if (appState.selectedSector) {
        console.log('Selected sector:', appState.selectedSector);
        const sector = appState.sectorObjects.get(appState.selectedSector);
        console.log('Sector object found:', !!sector);
        if (sector) {
            console.log('Sector businesses:', sector.getBusinesses().length);
        }
    } else {
        console.log('No sector currently selected');
    }
}

// Make it globally accessible
Object.assign(window, {
    debugCharts,
    compareSectors,
    showNearbySectors,
    demonstratePolymorphism,
    filterByCategory,
    resetDashboard
});

// Export functions for external use if needed
export {
    initializeApp,
    selectSector,
    filterByCategory,
    resetDashboard,
    compareSectors,
    showNearbySectors,
    appState
};
