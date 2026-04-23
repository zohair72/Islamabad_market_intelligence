/**
 * Analytics Utility Class
 * Purpose: Provides static analytical methods for market intelligence data
 * This class contains utility functions for data analysis, trend detection, and insights generation
 * All methods are static and don't require instantiation
 * 
 * @class Analytics
 * @author Market Intelligence Team
 * @version 1.0.0
 */

export default class Analytics {
    /**
     * Calculate category distribution in a sector
     * @param {Sector} sector - Sector to analyze
     * @returns {Object} Object with category names as keys and percentage as values
     * @throws {Error} If sector is invalid
     */
    static calculateCategoryDistribution(sector) {
        if (!sector || typeof sector.getBusinesses !== 'function') {
            throw new Error('Invalid sector object provided');
        }

        const businesses = sector.getBusinesses();
        const totalBusinesses = businesses.length;

        if (totalBusinesses === 0) {
            return {};
        }

        const categoryCount = {};
        const categoryPercentage = {};

        // Count businesses per category
        businesses.forEach(business => {
            const category = business.getCategory();
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        });

        // Calculate percentages
        Object.keys(categoryCount).forEach(category => {
            const percentage = (categoryCount[category] / totalBusinesses) * 100;
            categoryPercentage[category] = {
                count: categoryCount[category],
                percentage: parseFloat(percentage.toFixed(2))
            };
        });

        return categoryPercentage;
    }

    /**
     * Get top N categories by business count
     * @param {Sector} sector - Sector to analyze
     * @param {number} limit - Number of top categories to return (default: 5)
     * @returns {Array} Array of objects with category and count, sorted by count descending
     * @throws {Error} If sector is invalid or limit is not a positive number
     */
    static getTopCategories(sector, limit = 5) {
        if (!sector || typeof sector.getBusinesses !== 'function') {
            throw new Error('Invalid sector object provided');
        }

        if (typeof limit !== 'number' || limit <= 0) {
            throw new Error('Limit must be a positive number');
        }

        const distribution = this.calculateCategoryDistribution(sector);

        return Object.entries(distribution)
            .map(([category, data]) => ({
                category: category,
                count: data.count,
                percentage: data.percentage
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    /**
     * Calculate average price range across all businesses
     * @param {Sector} sector - Sector to analyze
     * @returns {Object} Average price range data with distribution
     * @throws {Error} If sector is invalid
     */
    static calculateAveragePriceRange(sector) {
        if (!sector || typeof sector.getBusinesses !== 'function') {
            throw new Error('Invalid sector object provided');
        }

        const businesses = sector.getBusinesses();

        if (businesses.length === 0) {
            return {
                average: 'N/A',
                distribution: { Budget: 0, Mid: 0, Premium: 0 }
            };
        }

        const priceValues = { Budget: 1, Mid: 2, Premium: 3 };
        const priceLabels = { 1: 'Budget', 2: 'Mid', 3: 'Premium' };

        let totalValue = 0;
        const distribution = { Budget: 0, Mid: 0, Premium: 0 };

        businesses.forEach(business => {
            const priceRange = business.getPriceRange();
            distribution[priceRange]++;
            totalValue += priceValues[priceRange];
        });

        const averageValue = totalValue / businesses.length;
        const averageLabel = priceLabels[Math.round(averageValue)];

        return {
            average: averageLabel,
            averageNumeric: parseFloat(averageValue.toFixed(2)),
            distribution: distribution,
            distributionPercentage: {
                Budget: parseFloat(((distribution.Budget / businesses.length) * 100).toFixed(2)),
                Mid: parseFloat(((distribution.Mid / businesses.length) * 100).toFixed(2)),
                Premium: parseFloat(((distribution.Premium / businesses.length) * 100).toFixed(2))
            }
        };
    }

    /**
     * Get price distribution in the sector
     * @param {Sector} sector - Sector to analyze
     * @returns {Object} Detailed price range distribution
     * @throws {Error} If sector is invalid
     */
    static getPriceDistribution(sector) {
        if (!sector || typeof sector.getBusinesses !== 'function') {
            throw new Error('Invalid sector object provided');
        }

        const businesses = sector.getBusinesses();
        const totalBusinesses = businesses.length;

        if (totalBusinesses === 0) {
            return {
                Budget: { count: 0, percentage: 0 },
                Mid: { count: 0, percentage: 0 },
                Premium: { count: 0, percentage: 0 }
            };
        }

        const distribution = { Budget: 0, Mid: 0, Premium: 0 };

        businesses.forEach(business => {
            const priceRange = business.getPriceRange();
            distribution[priceRange]++;
        });

        return {
            Budget: {
                count: distribution.Budget,
                percentage: parseFloat(((distribution.Budget / totalBusinesses) * 100).toFixed(2))
            },
            Mid: {
                count: distribution.Mid,
                percentage: parseFloat(((distribution.Mid / totalBusinesses) * 100).toFixed(2))
            },
            Premium: {
                count: distribution.Premium,
                percentage: parseFloat(((distribution.Premium / totalBusinesses) * 100).toFixed(2))
            }
        };
    }

    /**
     * Analyze footfall trends and patterns
     * @param {Sector} sector - Sector to analyze
     * @returns {Object} Footfall analysis with statistics
     * @throws {Error} If sector is invalid
     */
    static getFootfallTrends(sector) {
        if (!sector || typeof sector.getBusinesses !== 'function') {
            throw new Error('Invalid sector object provided');
        }

        const businesses = sector.getBusinesses();

        if (businesses.length === 0) {
            return {
                total: 0,
                average: 0,
                min: 0,
                max: 0,
                median: 0,
                trend: 'No data'
            };
        }

        const footfalls = businesses.map(b => b.getFootfall()).sort((a, b) => a - b);
        const total = footfalls.reduce((sum, val) => sum + val, 0);
        const average = total / footfalls.length;
        const min = footfalls[0];
        const max = footfalls[footfalls.length - 1];

        // Calculate median
        const mid = Math.floor(footfalls.length / 2);
        const median = footfalls.length % 2 === 0
            ? (footfalls[mid - 1] + footfalls[mid]) / 2
            : footfalls[mid];

        // Determine trend
        let trend = 'Stable';
        if (average > median * 1.2) trend = 'High variance';
        else if (max > average * 2) trend = 'Outliers present';

        return {
            total: total,
            average: Math.round(average),
            min: min,
            max: max,
            median: Math.round(median),
            trend: trend,
            distribution: {
                low: footfalls.filter(f => f < average * 0.7).length,
                medium: footfalls.filter(f => f >= average * 0.7 && f <= average * 1.3).length,
                high: footfalls.filter(f => f > average * 1.3).length
            }
        };
    }

    /**
     * Generate comprehensive insights for a market
     * @param {Market} market - Market to analyze
     * @returns {Array<Object>} Array of insight objects with type, message, and priority
     * @throws {Error} If market is invalid
     */
    static generateInsights(market) {
        if (!market || typeof market.getMarketAnalysis !== 'function') {
            throw new Error('Invalid market object provided');
        }

        const insights = [];
        const analysis = market.getMarketAnalysis();
        const sector = market.getSector();
        const businesses = sector.getBusinesses();

        // Demand insights
        if (analysis.scores.demand >= 70) {
            insights.push({
                type: 'opportunity',
                priority: 'high',
                message: `High demand detected in ${analysis.sectorName} with a score of ${analysis.scores.demand}/100`,
                icon: 'trending-up'
            });
        } else if (analysis.scores.demand < 40) {
            insights.push({
                type: 'warning',
                priority: 'medium',
                message: `Low demand in ${analysis.sectorName}. Consider market development strategies.`,
                icon: 'alert-triangle'
            });
        }

        // Competition insights
        if (analysis.scores.competition >= 70) {
            insights.push({
                type: 'warning',
                priority: 'high',
                message: `High competition detected. Market saturation risk with ${businesses.length} existing businesses.`,
                icon: 'alert-circle'
            });
        } else if (analysis.scores.competition < 30) {
            insights.push({
                type: 'opportunity',
                priority: 'high',
                message: `Low competition environment. Excellent opportunity for new entrants.`,
                icon: 'star'
            });
        }

        // Opportunity score insights
        if (analysis.scores.opportunity > 30) {
            insights.push({
                type: 'success',
                priority: 'high',
                message: `Strong opportunity score of ${analysis.scores.opportunity}. Recommended for investment.`,
                icon: 'check-circle'
            });
        } else if (analysis.scores.opportunity < -20) {
            insights.push({
                type: 'danger',
                priority: 'high',
                message: `Negative opportunity score indicates oversaturated market. High risk for new businesses.`,
                icon: 'x-circle'
            });
        }

        // Accessibility insights
        if (analysis.sectorData.accessibility >= 8) {
            insights.push({
                type: 'success',
                priority: 'medium',
                message: `Excellent accessibility score of ${analysis.sectorData.accessibility}/10 attracts high footfall.`,
                icon: 'map-pin'
            });
        }

        // Revenue insights
        const avgRevenue = businesses.length > 0 ? analysis.sectorData.totalRevenue / businesses.length : 0;
        if (avgRevenue >= 50000) {
            insights.push({
                type: 'success',
                priority: 'medium',
                message: `High average daily revenue of PKR ${Math.round(avgRevenue).toLocaleString()} per business.`,
                icon: 'dollar-sign'
            });
        }

        // Category diversity insights
        const categoryDist = this.calculateCategoryDistribution(sector);
        const categoryCount = Object.keys(categoryDist).length;

        if (categoryCount >= 5) {
            insights.push({
                type: 'info',
                priority: 'low',
                message: `Diverse market with ${categoryCount} different business categories.`,
                icon: 'grid'
            });
        } else if (categoryCount <= 2) {
            insights.push({
                type: 'warning',
                priority: 'medium',
                message: `Limited category diversity. Market dominated by ${categoryCount} category/categories.`,
                icon: 'layers'
            });
        }

        // Footfall insights
        const footfallTrends = this.getFootfallTrends(sector);
        if (footfallTrends.average >= 500) {
            insights.push({
                type: 'success',
                priority: 'medium',
                message: `Strong average footfall of ${footfallTrends.average} customers per business daily.`,
                icon: 'users'
            });
        }

        return insights;
    }

    /**
     * Calculate market growth potential
     * @param {Market} market - Market to analyze
     * @returns {Object} Growth potential analysis
     * @throws {Error} If market is invalid
     */
    static calculateGrowthPotential(market) {
        if (!market || typeof market.getMarketAnalysis !== 'function') {
            throw new Error('Invalid market object provided');
        }

        const analysis = market.getMarketAnalysis();
        const sector = market.getSector();

        const demandScore = analysis.scores.demand;
        const competitionScore = analysis.scores.competition;
        const accessibility = analysis.sectorData.accessibility;
        const population = analysis.sectorData.population;

        // Calculate growth potential (0-100)
        let growthScore = 0;

        // High demand contributes positively
        growthScore += demandScore * 0.4;

        // Lower competition is better for growth
        growthScore += (100 - competitionScore) * 0.3;

        // Accessibility contributes
        growthScore += accessibility * 2;

        // Population density
        const populationScore = Math.min((population / 50000) * 10, 10);
        growthScore += populationScore;

        growthScore = Math.min(Math.round(growthScore), 100);

        let potential = 'Low';
        if (growthScore >= 70) potential = 'High';
        else if (growthScore >= 50) potential = 'Medium';

        return {
            score: growthScore,
            potential: potential,
            factors: {
                demand: demandScore,
                competition: 100 - competitionScore,
                accessibility: accessibility * 10,
                population: populationScore * 10
            },
            recommendation: growthScore >= 60
                ? 'Strong growth potential - Recommended for expansion'
                : growthScore >= 40
                    ? 'Moderate growth potential - Proceed with caution'
                    : 'Limited growth potential - Not recommended'
        };
    }

    /**
     * Compare multiple markets and rank them
     * @param {Array<Market>} markets - Array of Market objects to compare
     * @returns {Array<Object>} Ranked markets with scores
     * @throws {Error} If markets array is invalid
     */
    static rankMarkets(markets) {
        if (!Array.isArray(markets) || markets.length === 0) {
            throw new Error('Markets must be a non-empty array');
        }

        return markets.map(market => {
            const analysis = market.getMarketAnalysis();
            const growthPotential = this.calculateGrowthPotential(market);

            return {
                name: analysis.sectorName,
                demandScore: analysis.scores.demand,
                competitionScore: analysis.scores.competition,
                opportunityScore: analysis.scores.opportunity,
                growthScore: growthPotential.score,
                recommendation: analysis.recommendation,
                overallScore: (analysis.scores.opportunity + growthPotential.score) / 2
            };
        }).sort((a, b) => b.overallScore - a.overallScore);
    }

    /**
     * Generate executive summary for a market
     * @param {Market} market - Market to summarize
     * @returns {Object} Executive summary with key metrics
     * @throws {Error} If market is invalid
     */
    static generateExecutiveSummary(market) {
        if (!market || typeof market.getMarketAnalysis !== 'function') {
            throw new Error('Invalid market object provided');
        }

        const analysis = market.getMarketAnalysis();
        const insights = this.generateInsights(market);
        const growthPotential = this.calculateGrowthPotential(market);
        const sector = market.getSector();

        return {
            marketName: analysis.sectorName,
            generatedAt: new Date().toISOString(),
            keyMetrics: {
                demandScore: analysis.scores.demand,
                competitionScore: analysis.scores.competition,
                opportunityScore: analysis.scores.opportunity,
                growthPotential: growthPotential.score,
                investmentPotential: market.getInvestmentPotential()
            },
            recommendation: analysis.recommendation,
            topInsights: insights.filter(i => i.priority === 'high').slice(0, 3),
            businessCount: analysis.sectorData.totalBusinesses,
            totalRevenue: analysis.sectorData.totalRevenue,
            topCategories: this.getTopCategories(sector, 3),
            conclusion: this.generateConclusion(market, growthPotential)
        };
    }

    /**
     * Generate conclusion based on market analysis
     * @param {Market} market - Market to analyze
     * @param {Object} growthPotential - Growth potential data
     * @returns {string} Conclusion text
     * @private
     */
    static generateConclusion(market, growthPotential) {
        const recommendation = market.getRecommendation();
        const growth = growthPotential.potential;

        if (recommendation === 'Good' && growth === 'High') {
            return 'Excellent market opportunity with strong growth potential. Highly recommended for new business ventures.';
        } else if (recommendation === 'Good' || growth === 'High') {
            return 'Promising market with good opportunities. Recommended for businesses with proper planning.';
        } else if (recommendation === 'Average') {
            return 'Moderate market conditions. Success depends on differentiation and competitive advantage.';
        } else {
            return 'Challenging market environment. Consider alternative locations or unique value propositions.';
        }
    }

    /**
     * Calculate total revenue using polymorphism
     * Each business type calculates revenue differently through their overridden methods
     * @param {Sector} sector - Sector containing businesses
     * @returns {number} Total revenue from all businesses
     */
    static calculateTotalRevenue(sector) {
        if (!sector || typeof sector.getBusinesses !== 'function') {
            throw new Error('Invalid sector object provided');
        }

        const businesses = sector.getBusinesses();

        // POLYMORPHISM: Each business calculates revenue differently
        // Restaurant, Retail, Tech, Medical, Salon, Gym all have different formulas
        return businesses.reduce((total, business) => {
            return total + business.calculateRevenue();
        }, 0);
    }

    /**
     * Calculate total market impact using polymorphism
     * Each business type has different impact calculations through their overridden methods
     * @param {Sector} sector - Sector containing businesses
     * @returns {number} Total market impact score
     */
    static calculateTotalMarketImpact(sector) {
        if (!sector || typeof sector.getBusinesses !== 'function') {
            throw new Error('Invalid sector object provided');
        }

        const businesses = sector.getBusinesses();

        // POLYMORPHISM: Each business has different impact calculation
        // Medical has highest impact, Tech has moderate, etc.
        return businesses.reduce((total, business) => {
            return total + business.getMarketImpact();
        }, 0);
    }

    /**
     * Get revenue breakdown by business type (demonstrates polymorphism)
     * @param {Sector} sector - Sector to analyze
     * @returns {Object} Revenue breakdown by category
     */
    static getRevenueBreakdownByType(sector) {
        if (!sector || typeof sector.getBusinesses !== 'function') {
            throw new Error('Invalid sector object provided');
        }

        const businesses = sector.getBusinesses();
        const breakdown = {};

        businesses.forEach(business => {
            const category = business.getCategory();
            const revenue = business.calculateRevenue(); // Polymorphic call!

            if (!breakdown[category]) {
                breakdown[category] = {
                    totalRevenue: 0,
                    count: 0,
                    averageRevenue: 0
                };
            }

            breakdown[category].totalRevenue += revenue;
            breakdown[category].count++;
        });

        // Calculate averages
        Object.keys(breakdown).forEach(category => {
            breakdown[category].averageRevenue =
                Math.round(breakdown[category].totalRevenue / breakdown[category].count);
        });

        return breakdown;
    }
}
