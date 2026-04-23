/**
 * Market Class
 * Purpose: Represents a market analysis for a sector using composition pattern
 * Provides demand-supply analysis, competition scoring, and market recommendations
 * Demonstrates polymorphism through method overriding and composition
 * 
 * @class Market
 * @author Market Intelligence Team
 * @version 1.0.0
 */

export default class Market {
    // Private fields using # for strict encapsulation
    #sector;
    #demandScore;
    #competitionScore;
    #recommendation;
    #analysisDate;

    /**
     * Creates a new Market instance using composition with Sector
     * @param {Sector} sector - Sector object to analyze
     * @throws {Error} If sector is invalid
     */
    constructor(sector) {
        // Validation
        if (!sector || typeof sector.getName !== 'function') {
            throw new Error('Invalid sector object provided');
        }

        this.#sector = sector;
        this.#analysisDate = new Date();

        // Calculate initial scores
        this.#demandScore = this.calculateDemandScore();
        this.#competitionScore = this.calculateCompetitionScore();
        this.#recommendation = this.generateRecommendation();
    }

    /**
     * Calculate demand score based on footfall and population
     * Higher footfall and population indicate higher demand
     * @returns {number} Demand score (1-100)
     */
    calculateDemandScore() {
        const population = this.#sector.getPopulation();
        const totalFootfall = this.#sector.getTotalFootfall();
        const accessibility = this.#sector.getAccessibility();

        // Normalize population (assuming max 100,000 for a sector)
        const populationScore = Math.min((population / 100000) * 40, 40);

        // Normalize footfall (assuming max 10,000 daily footfall)
        const footfallScore = Math.min((totalFootfall / 10000) * 40, 40);

        // Accessibility contributes to demand (max 20 points)
        const accessibilityScore = accessibility * 2;

        // Add dummy variety factor (Market Sentiment)
        const marketSentiment = (Math.random() * 30) - 15; // +/- 15 variance

        const totalScore = populationScore + footfallScore + accessibilityScore + marketSentiment;

        // Return score capped at 100, min 20
        return Math.max(20, Math.min(Math.round(totalScore), 100));
    }

    /**
     * Calculate competition score based on business density
     * Higher competition means more saturated market
     * @returns {number} Competition score (1-100)
     */
    calculateCompetitionScore() {
        const businesses = this.#sector.getBusinesses();
        const businessCount = businesses.length;
        const population = this.#sector.getPopulation();
        const competitionDensity = this.#sector.getCompetitionDensity();

        // Business count score (more businesses = higher competition)
        const businessScore = Math.min(businessCount * 3, 40);

        // Density score (businesses per 1000 people)
        const densityScore = Math.min(competitionDensity * 4, 40);

        // Category saturation (if many businesses in same category)
        const categoryDist = this.#sector.getCategoryDistribution();
        const maxCategoryCount = Math.max(...Object.values(categoryDist), 0);
        const saturationScore = Math.min(maxCategoryCount * 5, 20);

        // Add dummy variety factor (External Competition)
        const externalFactor = (Math.random() * 25) - 10;

        const totalScore = businessScore + densityScore + saturationScore + externalFactor;

        return Math.max(10, Math.min(Math.round(totalScore), 100));
    }

    /**
     * Generate market recommendation based on demand vs competition analysis
     * @returns {string} Recommendation ("Good", "Average", "Saturated")
     */
    generateRecommendation() {
        const demand = this.#demandScore;
        const competition = this.#competitionScore;

        // Calculate opportunity score (demand - competition)
        const opportunityScore = demand - competition;

        if (opportunityScore > 20) {
            return 'Good'; // High demand, low competition
        } else if (opportunityScore > -10) {
            return 'Average'; // Balanced market
        } else {
            return 'Saturated'; // High competition, lower demand
        }
    }

    /**
     * Recalculate all scores (useful after sector changes)
     */
    recalculateScores() {
        this.#demandScore = this.calculateDemandScore();
        this.#competitionScore = this.calculateCompetitionScore();
        this.#recommendation = this.generateRecommendation();
        this.#analysisDate = new Date();
    }

    /**
     * Get the underlying sector object
     * @returns {Sector} The sector being analyzed
     */
    getSector() {
        return this.#sector;
    }

    /**
     * Get demand score
     * @returns {number} Current demand score
     */
    getDemandScore() {
        return this.#demandScore;
    }

    /**
     * Get competition score
     * @returns {number} Current competition score
     */
    getCompetitionScore() {
        return this.#competitionScore;
    }

    /**
     * Get recommendation
     * @returns {string} Current market recommendation
     */
    getRecommendation() {
        return this.#recommendation;
    }

    /**
     * Get complete market analysis
     * @returns {Object} Comprehensive market analysis object
     */
    getMarketAnalysis() {
        const sectorSummary = this.#sector.getSectorSummary();

        return {
            sectorName: this.#sector.getName(),
            analysisDate: this.#analysisDate.toISOString(),
            scores: {
                demand: this.#demandScore,
                competition: this.#competitionScore,
                opportunity: this.#demandScore - this.#competitionScore
            },
            recommendation: this.#recommendation,
            recommendationDetails: this.getRecommendationDetails(),
            sectorData: {
                population: this.#sector.getPopulation(),
                accessibility: this.#sector.getAccessibility(),
                totalBusinesses: this.#sector.getBusinesses().length,
                totalFootfall: this.#sector.getTotalFootfall(),
                competitionDensity: this.#sector.getCompetitionDensity(),
                totalRevenue: this.#sector.getTotalRevenue()
            },
            distribution: sectorSummary.distribution,
            topBusinesses: this.#sector.getTopBusinesses(3)
        };
    }

    /**
     * Get detailed recommendation explanation
     * @returns {Object} Detailed recommendation with reasons
     */
    getRecommendationDetails() {
        const demand = this.#demandScore;
        const competition = this.#competitionScore;
        const recommendation = this.#recommendation;

        const details = {
            recommendation: recommendation,
            demandLevel: demand >= 70 ? 'High' : demand >= 40 ? 'Medium' : 'Low',
            competitionLevel: competition >= 70 ? 'High' : competition >= 40 ? 'Medium' : 'Low',
            reasons: []
        };

        // Add specific reasons
        if (demand >= 70) {
            details.reasons.push('High population and footfall indicate strong demand');
        }
        if (competition >= 70) {
            details.reasons.push('Market is highly competitive with many existing businesses');
        }
        if (this.#sector.getAccessibility() >= 8) {
            details.reasons.push('Excellent accessibility attracts more customers');
        }
        if (this.#sector.getCompetitionDensity() > 10) {
            details.reasons.push('High business density may indicate market saturation');
        }

        return details;
    }

    /**
     * Compare this market with another market
     * @param {Market} otherMarket - Another Market instance to compare with
     * @returns {Object} Comparison object with detailed analysis
     * @throws {Error} If otherMarket is invalid
     */
    compareWith(otherMarket) {
        if (!otherMarket || !(otherMarket instanceof Market)) {
            throw new Error('Invalid market object for comparison');
        }

        const thisAnalysis = this.getMarketAnalysis();
        const otherAnalysis = otherMarket.getMarketAnalysis();

        return {
            comparison: {
                market1: {
                    name: thisAnalysis.sectorName,
                    demandScore: this.#demandScore,
                    competitionScore: this.#competitionScore,
                    recommendation: this.#recommendation
                },
                market2: {
                    name: otherAnalysis.sectorName,
                    demandScore: otherMarket.getDemandScore(),
                    competitionScore: otherMarket.getCompetitionScore(),
                    recommendation: otherMarket.getRecommendation()
                }
            },
            differences: {
                demandDifference: this.#demandScore - otherMarket.getDemandScore(),
                competitionDifference: this.#competitionScore - otherMarket.getCompetitionScore(),
                populationDifference: this.#sector.getPopulation() - otherMarket.getSector().getPopulation(),
                businessCountDifference: this.#sector.getBusinesses().length - otherMarket.getSector().getBusinesses().length
            },
            betterMarket: this.determineBetterMarket(otherMarket),
            insights: this.generateComparisonInsights(otherMarket)
        };
    }

    /**
     * Determine which market is better for new business
     * @param {Market} otherMarket - Market to compare with
     * @returns {string} Name of the better market
     * @private
     */
    determineBetterMarket(otherMarket) {
        const thisOpportunity = this.#demandScore - this.#competitionScore;
        const otherOpportunity = otherMarket.getDemandScore() - otherMarket.getCompetitionScore();

        if (thisOpportunity > otherOpportunity) {
            return this.#sector.getName();
        } else if (otherOpportunity > thisOpportunity) {
            return otherMarket.getSector().getName();
        } else {
            return 'Equal opportunity';
        }
    }

    /**
     * Generate insights from market comparison
     * @param {Market} otherMarket - Market to compare with
     * @returns {Array<string>} Array of insight strings
     * @private
     */
    generateComparisonInsights(otherMarket) {
        const insights = [];
        const demandDiff = this.#demandScore - otherMarket.getDemandScore();
        const competitionDiff = this.#competitionScore - otherMarket.getCompetitionScore();

        if (Math.abs(demandDiff) > 20) {
            insights.push(`${demandDiff > 0 ? this.#sector.getName() : otherMarket.getSector().getName()} has significantly higher demand`);
        }

        if (Math.abs(competitionDiff) > 20) {
            insights.push(`${competitionDiff > 0 ? this.#sector.getName() : otherMarket.getSector().getName()} has higher competition`);
        }

        if (this.#recommendation === 'Good' && otherMarket.getRecommendation() !== 'Good') {
            insights.push(`${this.#sector.getName()} offers better business opportunities`);
        }

        return insights;
    }

    /**
     * Get market health status
     * @returns {string} Health status (Healthy/Moderate/Struggling)
     */
    getMarketHealth() {
        const revenue = this.#sector.getTotalRevenue();
        const businessCount = this.#sector.getBusinesses().length;

        if (businessCount === 0) return 'No Data';

        const avgRevenue = revenue / businessCount;

        if (avgRevenue >= 50000) return 'Healthy';
        if (avgRevenue >= 20000) return 'Moderate';
        return 'Struggling';
    }

    /**
     * Get investment potential score
     * @returns {number} Investment potential (1-100)
     */
    getInvestmentPotential() {
        const opportunityScore = this.#demandScore - this.#competitionScore;
        const accessibility = this.#sector.getAccessibility();
        const marketHealth = this.getMarketHealth();

        let baseScore = 50 + opportunityScore;

        // Adjust for accessibility
        baseScore += accessibility * 2;

        // Adjust for market health
        if (marketHealth === 'Healthy') baseScore += 10;
        else if (marketHealth === 'Struggling') baseScore -= 10;

        return Math.max(0, Math.min(100, Math.round(baseScore)));
    }

    /**
     * String representation of the market
     * @returns {string} Market description
     */
    toString() {
        return `Market Analysis for ${this.#sector.getName()} - ${this.#recommendation} (Demand: ${this.#demandScore}, Competition: ${this.#competitionScore})`;
    }
}
