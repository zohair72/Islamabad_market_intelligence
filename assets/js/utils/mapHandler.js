/**
 * MapHandler Class
 * Purpose: Manages Leaflet map interactions and sector visualization for Islamabad Market Intelligence
 * Handles marker creation, sector highlighting, filtering, and interactive map features
 * 
 * @class MapHandler
 * @author Market Intelligence Team
 * @version 1.0.0
 */

export default class MapHandler {
    // Private fields using # for strict encapsulation
    #map;
    #markers;
    #selectedSector;
    #mapElementId;
    #defaultCenter;
    #defaultZoom;
    #sectorData;

    /**
     * Creates a new MapHandler instance
     * @param {string} mapElementId - ID of the HTML element to render the map
     * @throws {Error} If map element doesn't exist
     */
    constructor(mapElementId) {
        if (!mapElementId || typeof mapElementId !== 'string') {
            throw new Error('Map element ID must be a valid string');
        }

        const mapElement = document.getElementById(mapElementId);
        if (!mapElement) {
            throw new Error(`Map element with ID "${mapElementId}" not found`);
        }

        this.#mapElementId = mapElementId;
        this.#markers = new Map(); // Use Map for efficient lookups
        this.#selectedSector = null;
        this.#defaultCenter = [33.6844, 73.0479]; // Islamabad coordinates
        this.#defaultZoom = 12;
        this.#sectorData = new Map();
        this.#map = null;
    }

    /**
     * Initialize the Leaflet map with OpenStreetMap tiles
     * @returns {Object} Leaflet map instance
     */
    initializeMap() {
        try {
            // Create map instance
            this.#map = L.map(this.#mapElementId, {
                center: this.#defaultCenter,
                zoom: this.#defaultZoom,
                minZoom: 10,
                maxZoom: 18,
                zoomControl: true,
                scrollWheelZoom: true,
                dragging: true,
                touchZoom: true,
                doubleClickZoom: true
            });

            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18,
                minZoom: 10
            }).addTo(this.#map);

            // Add scale control
            L.control.scale({
                position: 'bottomleft',
                imperial: false,
                metric: true
            }).addTo(this.#map);

            // Handle map resize
            window.addEventListener('resize', () => {
                if (this.#map) {
                    this.#map.invalidateSize();
                }
            });

            console.log('✓ Map initialized successfully');
            return this.#map;

        } catch (error) {
            console.error('Error initializing map:', error);
            throw new Error(`Failed to initialize map: ${error.message}`);
        }
    }

    /**
     * Add markers for all sectors on the map
     * @param {Array} sectorsData - Array of sector objects from JSON
     * @returns {number} Number of markers added
     */
    addSectorMarkers(sectorsData) {
        if (!Array.isArray(sectorsData) || sectorsData.length === 0) {
            throw new Error('Sectors data must be a non-empty array');
        }

        if (!this.#map) {
            throw new Error('Map must be initialized before adding markers');
        }

        let markersAdded = 0;

        sectorsData.forEach(sector => {
            try {
                // Validate sector data
                if (!sector.coordinates || !sector.coordinates.lat || !sector.coordinates.lng) {
                    console.warn(`Skipping sector ${sector.id}: missing coordinates`);
                    return;
                }

                // Store sector data for later reference
                this.#sectorData.set(sector.id, sector);

                // Create custom icon based on sector type
                const icon = this.#createSectorIcon(sector.type);

                // Create marker
                const marker = L.marker(
                    [sector.coordinates.lat, sector.coordinates.lng],
                    { icon: icon }
                );

                // Create and bind popup
                const popupContent = this.createSectorPopup(sector);
                marker.bindPopup(popupContent, {
                    maxWidth: 300,
                    className: 'sector-popup'
                });

                // Add click event
                marker.on('click', () => {
                    this.highlightSector(sector.id);
                });

                // Add marker to map
                marker.addTo(this.#map);

                // Store marker reference
                this.#markers.set(sector.id, {
                    marker: marker,
                    sector: sector,
                    originalIcon: icon
                });

                markersAdded++;

            } catch (error) {
                console.error(`Error adding marker for sector ${sector.id}:`, error);
            }
        });

        console.log(`✓ Added ${markersAdded} sector markers to map`);
        return markersAdded;
    }

    /**
     * Create custom icon for sector marker based on type
     * @param {string} type - Sector type (residential/commercial/residential-commercial)
     * @returns {Object} Leaflet icon object
     * @private
     */
    #createSectorIcon(type) {
        let color = '#3b82f6'; // Default blue

        switch (type) {
            case 'residential':
                color = '#3b82f6'; // Blue
                break;
            case 'commercial':
                color = '#ef4444'; // Red
                break;
            case 'residential-commercial':
                color = '#8b5cf6'; // Purple
                break;
            default:
                color = '#6b7280'; // Gray
        }

        return L.divIcon({
            className: 'custom-marker',
            html: `
                <div style="
                    background-color: ${color};
                    width: 24px;
                    height: 24px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    border: 2px solid white;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                ">
                    <div style="
                        width: 12px;
                        height: 12px;
                        background-color: white;
                        border-radius: 50%;
                        position: absolute;
                        top: 4px;
                        left: 4px;
                    "></div>
                </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24]
        });
    }

    /**
     * Create highlighted icon for selected sector
     * @returns {Object} Leaflet icon object
     * @private
     */
    #createHighlightedIcon() {
        return L.divIcon({
            className: 'custom-marker highlighted',
            html: `
                <div style="
                    background-color: #f59e0b;
                    width: 32px;
                    height: 32px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    border: 3px solid white;
                    box-shadow: 0 4px 10px rgba(245, 158, 11, 0.5);
                    animation: pulse 1.5s infinite;
                ">
                    <div style="
                        width: 16px;
                        height: 16px;
                        background-color: white;
                        border-radius: 50%;
                        position: absolute;
                        top: 6px;
                        left: 6px;
                    "></div>
                </div>
                <style>
                    @keyframes pulse {
                        0%, 100% { transform: rotate(-45deg) scale(1); }
                        50% { transform: rotate(-45deg) scale(1.1); }
                    }
                </style>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });
    }

    /**
     * Helper to get scores from appState
     * @param {string} sectorId
     * @param {string} type - 'demand' or 'competition'
     * @returns {string|number} Score or N/A
     * @private
     */
    #getScore(sectorId, type) {
        // Safe access to global state
        if (typeof window !== 'undefined' && window.appState &&
            window.appState.marketObjects && window.appState.marketObjects.has(sectorId)) {
            const market = window.appState.marketObjects.get(sectorId);
            return type === 'demand' ? market.getDemandScore() : market.getCompetitionScore();
        }
        return 'N/A';
    }

    /**
     * Create HTML content for sector popup
     * @param {Object} sector - Sector object
     * @returns {string} HTML string for popup content
     */
    createSectorPopup(sector) {
        const typeLabel = sector.type.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');

        return `
            <div class="sector-popup-content" style="padding: 8px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">
                    ${sector.name}
                </h3>
                <div style="font-size: 13px; color: #4b5563; margin-bottom: 8px;">
                    <div style="margin-bottom: 4px;">
                        <i class="fas fa-map-marker-alt" style="width: 16px; color: #3b82f6;"></i>
                        <strong>Type:</strong> ${typeLabel}
                    </div>
                    <div style="margin-bottom: 4px;">
                        <i class="fas fa-users" style="width: 16px; color: #10b981;"></i>
                        <strong>Population:</strong> ${sector.population.toLocaleString()}
                    </div>
                    <div style="margin-bottom: 4px;">
                        <i class="fas fa-road" style="width: 16px; color: #f59e0b;"></i>
                        <strong>Accessibility:</strong> ${sector.accessibility}/10
                    </div>
                    <!-- Added Scores -->
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span><strong>Demand:</strong></span>
                            <span style="color: #10b981; font-weight: bold;">${this.#getScore(sector.id, 'demand')}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span><strong>Competition:</strong></span>
                            <span style="color: #ef4444; font-weight: bold;">${this.#getScore(sector.id, 'competition')}</span>
                        </div>
                    </div>
                </div>
                <button 
                    onclick="window.viewSectorDetails('${sector.id}')"
                    style="
                        width: 100%;
                        padding: 6px 12px;
                        background-color: #3b82f6;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: 500;
                    "
                    onmouseover="this.style.backgroundColor='#2563eb'"
                    onmouseout="this.style.backgroundColor='#3b82f6'"
                >
                    View Details
                </button>
            </div>
        `;
    }

    /**
     * Highlight a specific sector on the map
     * @param {string} sectorId - ID of the sector to highlight
     * @returns {boolean} True if sector was highlighted successfully
     */
    highlightSector(sectorId) {
        if (!sectorId) {
            console.warn('Sector ID is required for highlighting');
            return false;
        }

        const markerData = this.#markers.get(sectorId);
        if (!markerData) {
            console.warn(`Sector ${sectorId} not found in markers`);
            return false;
        }

        try {
            // Clear previous highlight
            this.clearHighlight();

            // Set highlighted icon
            const highlightedIcon = this.#createHighlightedIcon();
            markerData.marker.setIcon(highlightedIcon);

            // Open popup
            markerData.marker.openPopup();

            // Pan to marker
            this.#map.panTo(markerData.marker.getLatLng(), {
                animate: true,
                duration: 0.5
            });

            // Store selected sector
            this.#selectedSector = sectorId;

            console.log(`✓ Highlighted sector: ${sectorId}`);
            return true;

        } catch (error) {
            console.error(`Error highlighting sector ${sectorId}:`, error);
            return false;
        }
    }

    /**
     * Clear any sector highlighting
     */
    clearHighlight() {
        if (this.#selectedSector) {
            const markerData = this.#markers.get(this.#selectedSector);
            if (markerData) {
                // Restore original icon
                markerData.marker.setIcon(markerData.originalIcon);
                markerData.marker.closePopup();
            }
            this.#selectedSector = null;
        }
    }

    /**
     * Filter markers by category (show only sectors with businesses in that category)
     * @param {string} category - Category to filter by
     * @param {Array} businesses - Array of all businesses
     */
    filterMarkersByCategory(category, businesses) {
        if (!category || !Array.isArray(businesses)) {
            console.warn('Invalid category or businesses data');
            return;
        }

        // Get sector IDs that have businesses in this category
        const sectorsWithCategory = new Set(
            businesses
                .filter(b => b.category.toLowerCase() === category.toLowerCase())
                .map(b => b.sectorId)
        );

        // Show/hide markers based on filter
        this.#markers.forEach((markerData, sectorId) => {
            if (sectorsWithCategory.has(sectorId)) {
                markerData.marker.addTo(this.#map);
            } else {
                markerData.marker.remove();
            }
        });

        console.log(`✓ Filtered map to show ${sectorsWithCategory.size} sectors with ${category} businesses`);
    }

    /**
     * Reset map to default state
     */
    resetMap() {
        try {
            // Clear highlight
            this.clearHighlight();

            // Show all markers
            this.#markers.forEach(markerData => {
                markerData.marker.addTo(this.#map);
            });

            // Reset view
            this.#map.setView(this.#defaultCenter, this.#defaultZoom, {
                animate: true,
                duration: 0.5
            });

            console.log('✓ Map reset to default state');

        } catch (error) {
            console.error('Error resetting map:', error);
        }
    }

    /**
     * Add sector boundaries (polygons) to the map
     * @param {Array} sectorsData - Sectors with boundary coordinates
     */
    addSectorBoundaries(sectorsData) {
        if (!Array.isArray(sectorsData)) {
            console.warn('Invalid sectors data for boundaries');
            return;
        }

        sectorsData.forEach(sector => {
            if (sector.boundaries && Array.isArray(sector.boundaries)) {
                const polygon = L.polygon(sector.boundaries, {
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.1,
                    weight: 2
                });

                polygon.bindPopup(this.createSectorPopup(sector));

                polygon.on('click', () => {
                    this.highlightSector(sector.id);
                });

                polygon.on('mouseover', function () {
                    this.setStyle({ fillOpacity: 0.3 });
                });

                polygon.on('mouseout', function () {
                    this.setStyle({ fillOpacity: 0.1 });
                });

                polygon.addTo(this.#map);
            }
        });
    }

    /**
     * Get nearby sectors within a specified radius
     * @param {string} sectorId - ID of the center sector
     * @param {number} radius - Radius in kilometers (default: 5)
     * @returns {Array} Array of nearby sector objects with distances
     */
    getNearbySectors(sectorId, radius = 5) {
        const centerSector = this.#sectorData.get(sectorId);

        if (!centerSector || !centerSector.coordinates) {
            console.warn(`Sector ${sectorId} not found or missing coordinates`);
            return [];
        }

        const nearbySectors = [];
        const centerLat = centerSector.coordinates.lat;
        const centerLng = centerSector.coordinates.lng;

        this.#sectorData.forEach((sector, id) => {
            // Skip the center sector itself
            if (id === sectorId) return;

            if (sector.coordinates) {
                const distance = this.#calculateDistance(
                    centerLat,
                    centerLng,
                    sector.coordinates.lat,
                    sector.coordinates.lng
                );

                if (distance <= radius) {
                    nearbySectors.push({
                        id: sector.id,
                        name: sector.name,
                        distance: parseFloat(distance.toFixed(2)),
                        coordinates: sector.coordinates
                    });
                }
            }
        });

        // Sort by distance
        nearbySectors.sort((a, b) => a.distance - b.distance);

        console.log(`✓ Found ${nearbySectors.length} sectors within ${radius}km of ${sectorId}`);
        return nearbySectors;
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     * @param {number} lat1 - Latitude of first point
     * @param {number} lng1 - Longitude of first point
     * @param {number} lat2 - Latitude of second point
     * @param {number} lng2 - Longitude of second point
     * @returns {number} Distance in kilometers
     * @private
     */
    #calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.#toRadians(lat2 - lat1);
        const dLng = this.#toRadians(lng2 - lng1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.#toRadians(lat1)) * Math.cos(this.#toRadians(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance;
    }

    /**
     * Convert degrees to radians
     * @param {number} degrees - Angle in degrees
     * @returns {number} Angle in radians
     * @private
     */
    #toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Get the current map instance
     * @returns {Object|null} Leaflet map instance
     */
    getMap() {
        return this.#map;
    }

    /**
     * Get all markers
     * @returns {Map} Map of sector IDs to marker data
     */
    getMarkers() {
        return new Map(this.#markers); // Return a copy
    }

    /**
     * Get selected sector ID
     * @returns {string|null} Currently selected sector ID
     */
    getSelectedSector() {
        return this.#selectedSector;
    }

    /**
     * Fit map bounds to show all markers
     */
    fitBounds() {
        if (this.#markers.size === 0) {
            console.warn('No markers to fit bounds');
            return;
        }

        const group = L.featureGroup(
            Array.from(this.#markers.values()).map(data => data.marker)
        );

        this.#map.fitBounds(group.getBounds(), {
            padding: [50, 50],
            animate: true
        });
    }

    /**
     * Destroy the map instance and clean up
     */
    destroy() {
        if (this.#map) {
            this.#map.remove();
            this.#map = null;
        }
        this.#markers.clear();
        this.#sectorData.clear();
        this.#selectedSector = null;
        console.log('✓ Map destroyed and cleaned up');
    }
}
