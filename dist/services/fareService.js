"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateFare = exports.calculateFare = void 0;
const DEFAULT_CONFIG = {
    baseFare: 50, // e.g., 50 units
    costPerKm: 15, // 15 units per km
    costPerMinute: 2, // 2 units per minute
    minimumFare: 100 // Minimum 100 units
};
const calculateFare = (distanceKm, durationMin, config = DEFAULT_CONFIG) => {
    const total = config.baseFare + (distanceKm * config.costPerKm) + (durationMin * config.costPerMinute);
    return Math.max(total, config.minimumFare);
};
exports.calculateFare = calculateFare;
const estimateFare = (pickupLat, pickupLng, dropoffLat, dropoffLng) => {
    // Basic straight-line distance estimation for prototype purposes
    // In production, use Google Maps Matrix API or similar
    const R = 6371; // Earth radius in km
    const dLat = (dropoffLat - pickupLat) * Math.PI / 180;
    const dLon = (dropoffLng - pickupLng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(pickupLat * Math.PI / 180) * Math.cos(dropoffLat * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    // Estimate duration: assume average 30 km/h for urban ride
    const duration = (distance / 30) * 60;
    return (0, exports.calculateFare)(distance, duration);
};
exports.estimateFare = estimateFare;
//# sourceMappingURL=fareService.js.map