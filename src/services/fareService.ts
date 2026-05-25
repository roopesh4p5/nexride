export interface FareConfig {
    baseFare: number;
    costPerKm: number;
    costPerMinute: number;
    minimumFare: number;
}

const DEFAULT_CONFIG: FareConfig = {
    baseFare: 50,      // e.g., 50 units
    costPerKm: 15,     // 15 units per km
    costPerMinute: 2,  // 2 units per minute
    minimumFare: 100   // Minimum 100 units
};

export const calculateFare = (distanceKm: number, durationMin: number, config: FareConfig = DEFAULT_CONFIG): number => {
    const total = config.baseFare + (distanceKm * config.costPerKm) + (durationMin * config.costPerMinute);
    return Math.max(total, config.minimumFare);
};

export const estimateFare = (pickupLat: number, pickupLng: number, dropoffLat: number, dropoffLng: number): number => {
    // Basic straight-line distance estimation for prototype purposes
    // In production, use Google Maps Matrix API or similar
    const R = 6371; // Earth radius in km
    const dLat = (dropoffLat - pickupLat) * Math.PI / 180;
    const dLon = (dropoffLng - pickupLng) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(pickupLat * Math.PI / 180) * Math.cos(dropoffLat * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // Estimate duration: assume average 30 km/h for urban ride
    const duration = (distance / 30) * 60;

    return calculateFare(distance, duration);
};
