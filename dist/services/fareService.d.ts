export interface FareConfig {
    baseFare: number;
    costPerKm: number;
    costPerMinute: number;
    minimumFare: number;
}
export declare const calculateFare: (distanceKm: number, durationMin: number, config?: FareConfig) => number;
export declare const estimateFare: (pickupLat: number, pickupLng: number, dropoffLat: number, dropoffLng: number) => number;
