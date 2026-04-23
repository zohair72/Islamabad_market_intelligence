/**
 * ChartHandler - Manages all chart visualizations
 * Purpose: Pure CSS/HTML charts without external libraries
 * Uses polymorphism to calculate revenue from different business types
 * Features: Interactive modals, modern styling, and global/local data handling
 * 
 * @class ChartHandler
 * @author Market Intelligence Team
 * @version 1.2.0
 */

class ChartHandler {

    /**
     * Render Revenue by Sector Bar Chart
     */
    static renderRevenueChart(containerId, sectorData, isFullView = false) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const sectors = sectorData instanceof Map ? Array.from(sectorData.values()) : sectorData;

        const revenueData = sectors.map(sector => ({
            name: sector.getName(),
            revenue: sector.getBusinesses().reduce((total, business) => total + business.calculateRevenue(), 0)
        }));

        revenueData.sort((a, b) => b.revenue - a.revenue);

        const itemsToShow = isFullView ? revenueData : revenueData.slice(0, 5);
        const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

        // Dynamic height container or just standard div
        let html = `<div class="space-y-4 transition-all duration-500 ease-in-out">`;

        itemsToShow.forEach((item, index) => {
            const percentage = (item.revenue / maxRevenue) * 100;
            const revenueFormatted = (item.revenue / 1000000).toFixed(2);
            const rankIcon = index === 0 ? '👑' : `#${index + 1}`;
            const rankColor = index < 3 ? 'text-yellow-600' : 'text-gray-500';

            html += `
                <div class="relative">
                    <div class="flex justify-between items-end mb-1">
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold ${rankColor} w-6">${rankIcon}</span>
                            <span class="font-medium text-gray-800">${item.name}</span>
                        </div>
                        <span class="text-sm font-semibold text-blue-600">PKR ${revenueFormatted}M</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div class="h-2.5 rounded-full transition-all duration-1000 ease-out relative origin-left" 
                             style="width: ${percentage}%; background: linear-gradient(90deg, #3b82f6, #2563eb);"></div>
                    </div>
                </div>
            `;
        });

        // Toggle Expand/Collapse
        const remainingCount = revenueData.length - 5;
        if (!isFullView && remainingCount > 0) {
            html += `
                <div class="pt-2 text-center">
                    <button onclick="ChartHandler.toggleExpandedView('revenue', '${containerId}')" 
                            class="text-xs text-blue-500 font-medium hover:text-blue-700 hover:underline focus:outline-none transition-colors">
                        Show ${remainingCount} more sectors ▼
                    </button>
                </div>
            `;
        } else if (isFullView && revenueData.length > 5) {
            html += `
                <div class="pt-2 text-center">
                    <button onclick="ChartHandler.toggleExpandedView('revenue', '${containerId}')" 
                            class="text-xs text-gray-500 font-medium hover:text-gray-700 hover:underline focus:outline-none transition-colors">
                        Show Less ▲
                    </button>
                </div>
            `;
        }

        html += '</div>';
        container.innerHTML = html;
        container.setAttribute('data-expanded', isFullView);
    }

    /**
     * Toggle Expanded View (In-Place)
     */
    static toggleExpandedView(chartType, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Get current state
        const isCurrentlyExpanded = container.getAttribute('data-expanded') === 'true';
        const newState = !isCurrentlyExpanded;

        // Re-render with new state
        if (chartType === 'revenue') {
            this.renderRevenueChart(containerId, window.appState.sectorObjects, newState);
        }
    }

    /**
     * Render Business Distribution
     */
    static renderBusinessDistribution(containerId, dataSource, isFullView = false) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let businesses = [];
        if (Array.isArray(dataSource)) {
            businesses = dataSource;
        } else if (dataSource && typeof dataSource.getBusinesses === 'function') {
            businesses = dataSource.getBusinesses();
        }

        if (businesses.length === 0) {
            container.innerHTML = '<div class="text-center py-4 text-gray-500">No data available</div>';
            return;
        }

        const categories = {};
        businesses.forEach(b => {
            const cat = typeof b.getCategory === 'function' ? b.getCategory() : b.category;
            categories[cat] = (categories[cat] || 0) + 1;
        });

        const total = businesses.length;
        const colors = {
            'Restaurant': '#ef4444', 'Retail': '#3b82f6', 'Tech': '#8b5cf6',
            'Medical': '#10b981', 'Salon': '#f59e0b', 'Gym': '#ec4899'
        };

        const sortedCategories = Object.entries(categories)
            .map(([cat, count]) => ({
                category: cat, count, percentage: ((count / total) * 100).toFixed(1),
                color: colors[cat] || '#6b7280'
            }))
            .sort((a, b) => b.count - a.count);

        let html = '';

        if (isFullView) {
            html = `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">`;
            sortedCategories.forEach(item => {
                html += `
                    <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                        <div class="flex justify-between items-center mb-2">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg" 
                                     style="background: ${item.color}"><i class="fas fa-store"></i></div>
                                <span class="font-bold text-gray-700 text-lg">${item.category}</span>
                            </div>
                            <div class="text-right">
                                <div class="text-2xl font-bold text-gray-800">${item.count}</div>
                                <div class="text-xs text-gray-500">${item.percentage}%</div>
                            </div>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-3">
                            <div class="h-3 rounded-full" style="width: ${item.percentage}%; background: ${item.color}"></div>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        } else {
            html = `<div class="space-y-3 cursor-pointer group" onclick="ChartHandler.openFullChart('distribution')">`;
            html += `
                <div class="bg-gradient-to-r from-gray-50 to-white border border-gray-100 p-3 rounded-lg flex justify-between items-center mb-2 pointer-events-none">
                    <span class="text-sm text-gray-600">Total Businesses</span>
                    <span class="text-xl font-bold text-gray-800">${total}</span>
                </div>
            `;
            sortedCategories.slice(0, 5).forEach(item => {
                html += `
                    <div class="group/item pointer-events-none">
                        <div class="flex justify-between text-xs mb-1">
                            <span class="font-medium text-gray-700 flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full" style="background: ${item.color}"></div>
                                ${item.category}
                            </span>
                            <span class="text-gray-500">${item.count} (${item.percentage}%)</span>
                        </div>
                        <div class="w-full bg-gray-100 rounded-full h-2">
                            <div class="h-2 rounded-full opacity-80" style="width: ${item.percentage}%; background: ${item.color}"></div>
                        </div>
                    </div>
                `;
            });
            html += `<div class="pt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span class="text-xs text-blue-500 font-medium">Click for detailed breakdown</span>
                     </div></div>`;
        }

        container.innerHTML = html;
    }

    /**
     * Render Employment Statistics
     */
    static renderEmploymentStats(containerId, sectorsData, isFullView = false) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const sectors = sectorsData instanceof Map ? Array.from(sectorsData.values()) : sectorsData;
        const employmentByCategory = { 'Restaurant': 0, 'Retail': 0, 'Tech': 0, 'Medical': 0, 'Salon': 0, 'Gym': 0 };
        const avgEmployees = { 'Restaurant': 8, 'Retail': 6, 'Tech': 4, 'Medical': 12, 'Salon': 5, 'Gym': 7 };

        sectors.forEach(sector => {
            sector.getBusinesses().forEach(business => {
                const count = (typeof business.getEmployeeCount === 'function') ?
                    business.getEmployeeCount() : 5;
                employmentByCategory[business.getCategory()] += count;
            });
        });

        const total = Object.values(employmentByCategory).reduce((a, b) => a + b, 0);
        const max = Math.max(...Object.values(employmentByCategory));
        const colors = {
            'Restaurant': '#ef4444', 'Retail': '#3b82f6', 'Tech': '#8b5cf6',
            'Medical': '#10b981', 'Salon': '#f59e0b', 'Gym': '#ec4899'
        };

        let html = `<div class="space-y-4 ${!isFullView ? 'cursor-pointer group' : ''}" 
                        onclick="ChartHandler.openFullChart('employment')">`;

        if (isFullView) {
            html += `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-blue-50 p-4 rounded-xl text-center">
                        <div class="text-3xl font-bold text-blue-600">${total.toLocaleString()}</div>
                        <div class="text-sm text-gray-600">Total Jobs</div>
                    </div>
                    <div class="bg-green-50 p-4 rounded-xl text-center">
                        <div class="text-3xl font-bold text-green-600">100%</div>
                        <div class="text-sm text-gray-600">Active Rate</div>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-xl text-center">
                        <div class="text-3xl font-bold text-purple-600">${Math.round(total / sectors.length)}</div>
                        <div class="text-sm text-gray-600">Avg per Sector</div>
                    </div>
                </div>
            `;
        }

        Object.entries(employmentByCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
            const width = (count / max) * 100;
            html += `
                <div class="relative group/bar pointer-events-none">
                    <div class="flex justify-between text-sm mb-1 z-10 relative">
                        <span class="font-medium text-gray-700">${cat}</span>
                        <span class="font-bold text-gray-800">${count.toLocaleString()}</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-r-lg h-8 relative overflow-hidden">
                        <div class="absolute top-0 left-0 h-full opacity-20" style="width: ${width}%; background: ${colors[cat]}"></div>
                        <div class="absolute bottom-0 left-0 h-1" style="width: ${width}%; background: ${colors[cat]}"></div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        if (!isFullView) html += `<div class="mt-4 text-center"><div class="text-xs text-blue-500 mt-1">Click for employment details</div></div>`;

        container.innerHTML = html;
    }

    /**
     * Render Growth Trends - Internal Implementation (Reverted to Stylish Version)
     */
    static renderGrowthTrends(containerId, sectorsData) {
        this._renderGrowthTrendsInternal(containerId, sectorsData, false);
    }

    static _renderGrowthTrendsInternal(containerId, sectorsData, isFullView) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Data generation
        const months = [
            { short: 'Jul', full: 'July 2024' }, { short: 'Aug', full: 'August 2024' },
            { short: 'Sep', full: 'September 2024' }, { short: 'Oct', full: 'October 2024' },
            { short: 'Nov', full: 'November 2024' }, { short: 'Dec', full: 'December 2024' }
        ];

        const growthData = months.map((m, i) => {
            const val = 3 + (i * 1.5) + (i > 3 ? 2 : 0) + (Math.random() * 2 - 1);
            return { month: m.short, fullMonth: m.full, growth: Math.max(0, val).toFixed(1), businesses: 300 + (i * 25) };
        });

        const max = Math.max(...growthData.map(d => parseFloat(d.growth)));
        const min = Math.min(...growthData.map(d => parseFloat(d.growth)));

        // STYLISH SVG IMPLEMENTATION
        const points = growthData.map((item, index) => {
            const x = (index / (growthData.length - 1)) * 100;
            const y = 100 - ((parseFloat(item.growth) - min) / (max - min) * 80);
            return `${x},${y}`; // 0-100 scale for SVG
        });

        const svgPoints = points.map(p => {
            const [x, y] = p.split(',');
            return `${x}%,${y}%`;
        }).join(' ');

        let html = `<div class="space-y-4 ${!isFullView ? 'cursor-pointer group' : ''}" 
                        onclick="ChartHandler.openFullChart('growth')">`;

        // Summary Cards (if full view)
        if (isFullView) {
            html += `
                <div class="grid grid-cols-3 gap-3 mb-4">
                    <div class="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                        <div class="text-2xl font-bold text-green-600">+${growthData[5].growth}%</div>
                        <div class="text-xs text-gray-600">Current Growth</div>
                    </div>
                    <div class="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                        <div class="text-2xl font-bold text-blue-600">${max}%</div>
                        <div class="text-xs text-gray-600">Peak</div>
                    </div>
                    <div class="bg-purple-50 rounded-lg p-3 text-center border border-purple-100">
                        <div class="text-2xl font-bold text-purple-600">4.5%</div>
                        <div class="text-xs text-gray-600">Avg</div>
                    </div>
                </div>
            `;
        }

        // The Stylish Chart Container
        html += `
            <div class="relative bg-gradient-to-b from-purple-50 to-white rounded-lg p-6 border border-purple-100 shadow-sm h-${isFullView ? '80' : '64'}">
                <div class="flex items-end justify-between h-full gap-4 relative z-10">
        `;

        // Data Points (HTML Overlay)
        growthData.forEach((item, index) => {
            const height = ((parseFloat(item.growth) - min) / (max - min)) * 100;
            // Align with SVG
            html += `
                <div class="flex-1 flex flex-col items-center justify-end h-full group/point relative pointer-events-none">
                    <!-- Tooltip -->
                     <div class="absolute bottom-[${height}%] mb-4 opacity-0 group-hover/group:opacity-100 transition-opacity whitespace-nowrap z-20">
                        <div class="bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-xl">
                            <span class="font-bold">${item.fullMonth}</span>: <span class="text-green-300">${item.growth}%</span>
                        </div>
                    </div>
                    
                    <!-- Pulsing Point -->
                    <div class="w-3 h-3 rounded-full bg-purple-600 border-2 border-white shadow-lg relative z-10 mb-[${height}%] transform group-hover/group:scale-150 transition-transform"></div>
                    
                    <!-- Vertical Line -->
                    <div class="absolute bottom-0 w-[1px] bg-purple-200" style="height: ${Math.max(10, height)}%"></div>
                    
                    <!-- Label -->
                    <div class="absolute -bottom-6 text-xs text-gray-500 font-medium">${item.month}</div>
                </div>
            `;
        });

        html += `</div>`; // End flex container

        // SVG Background Line
        html += `
            <svg class="absolute top-6 left-6 right-6 bottom-10 pointer-events-none" 
                 style="width: calc(100% - 3rem); height: calc(100% - 4rem); z-index: 0;">
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
                    </linearGradient>
                    <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                <polyline fill="none" stroke="url(#lineGrad)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"
                    points="${svgPoints}" style="filter: url(#glow);" />
            </svg>
        </div>`; // End chart container

        if (!isFullView) {
            html += `<div class="text-center text-xs text-blue-500 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">Click to view Detailed Growth Analysis</div>`;
        }

        html += `</div>`;
        container.innerHTML = html;
    }

    /**
     * Open Full Chart Modal
     */
    static openFullChart(chartType) {
        console.log('Opening chart for:', chartType);
        const modal = document.getElementById('chart-modal');
        const content = document.getElementById('modal-content');
        const title = document.getElementById('modal-title');

        if (!modal || !content) {
            console.error('Modal elements not found');
            return;
        }

        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.querySelector('div').classList.remove('scale-95');
        }, 10);

        content.innerHTML = '<div id="full-chart-container" class="w-full"></div>';

        setTimeout(() => {
            const cid = 'full-chart-container';
            if (chartType === 'revenue') {
                title.textContent = '💰 Revenue Analysis by Sector';
                this.renderRevenueChart(cid, appState.sectorObjects, true);
            } else if (chartType === 'distribution') {
                title.textContent = '🏢 Business Distribution Breakdown';
                if (appState.selectedSector) {
                    this.renderBusinessDistribution(cid, appState.sectorObjects.get(appState.selectedSector), true);
                } else {
                    this.renderBusinessDistribution(cid, appState.businesses, true);
                }
            } else if (chartType === 'employment') {
                title.textContent = '👥 Employment Statistics';
                this.renderEmploymentStats(cid, appState.sectorObjects, true);
            } else if (chartType === 'growth') {
                title.textContent = '📈 Market Growth Trends';
                this._renderGrowthTrendsInternal(cid, appState.sectorObjects, true);
            }
        }, 100);
    }
}

// Make globally available
if (typeof window !== 'undefined') {
    window.ChartHandler = ChartHandler;

    window.closeChartModal = () => {
        const modal = document.getElementById('chart-modal');
        if (modal) {
            modal.classList.add('opacity-0');
            modal.querySelector('div').classList.add('scale-95');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('close-modal-btn');
        if (btn) btn.onclick = window.closeChartModal;
    });
}

export default ChartHandler;
