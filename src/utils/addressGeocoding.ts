/**
 * Geocoding & Coordinate Resolution according to Report Address
 * Resolves realistic, distinct latitude/longitude coordinates based on street address,
 * locality, area, and city.
 */

const KNOWN_CITIES: Record<string, { lat: number; lng: number }> = {
  'yamuna vihar': { lat: 28.6992, lng: 77.2798 },
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'new delhi': { lat: 28.6139, lng: 77.2090 },
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'bengaluru': { lat: 12.9716, lng: 77.5946 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'chennai': { lat: 13.0827, lng: 80.2707 },
  'hyderabad': { lat: 17.3850, lng: 78.4867 },
  'pune': { lat: 18.5204, lng: 73.8567 },
  'ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'jaipur': { lat: 26.9124, lng: 75.7873 },
  'lucknow': { lat: 26.8467, lng: 80.9462 },
  'chandigarh': { lat: 30.7333, lng: 76.7794 },
  'noida': { lat: 28.5355, lng: 77.3910 },
  'gurgaon': { lat: 28.4595, lng: 77.0266 },
  'gurugram': { lat: 28.4595, lng: 77.0266 },
  'indore': { lat: 22.7196, lng: 75.8577 }
};

/**
 * Deterministically generates a geographic offset based on the address string
 * so reports with different addresses have distinct, realistic positions
 * distributed across the neighborhood grid without colliding.
 */
export function generateAddressOffset(addressStr: string): { deltaLat: number; deltaLng: number } {
  let hash1 = 5381;
  let hash2 = 52711;
  const str = addressStr.toLowerCase().trim();

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash1 = (hash1 * 33) ^ char;
    hash2 = (hash2 * 31) ^ char;
  }

  // Normalized offsets in the range -0.0055 to +0.0055 (~500m spread)
  const norm1 = ((Math.abs(hash1) % 10000) / 10000) - 0.5;
  const norm2 = ((Math.abs(hash2) % 10000) / 10000) - 0.5;

  return {
    deltaLat: norm1 * 0.010,
    deltaLng: norm2 * 0.010
  };
}

/**
 * Resolves coordinates for an address with online geocoding and instant deterministic fallback.
 */
export async function resolveCoordinatesFromAddress(
  address: {
    streetAddress?: string;
    area?: string;
    landmark?: string;
    city?: string;
    ward?: string;
    exactAddress?: string;
  },
  fallbackCoords: { lat: number; lng: number }
): Promise<{ latitude: number; longitude: number }> {
  const cityKey = (address.city || '').toLowerCase().trim();
  const areaKey = (address.area || '').toLowerCase().trim();

  let baseLat = fallbackCoords.lat;
  let baseLng = fallbackCoords.lng;

  // Check if known city or locality is mentioned
  if (KNOWN_CITIES[areaKey]) {
    baseLat = KNOWN_CITIES[areaKey].lat;
    baseLng = KNOWN_CITIES[areaKey].lng;
  } else if (KNOWN_CITIES[cityKey]) {
    baseLat = KNOWN_CITIES[cityKey].lat;
    baseLng = KNOWN_CITIES[cityKey].lng;
  }

  // Attempt real-time Nominatim search with a strict 2-second timeout
  const query = [address.streetAddress, address.area, address.city]
    .filter(Boolean)
    .join(', ');

  if (query.length > 5 && typeof window !== 'undefined') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        {
          signal: controller.signal,
          headers: { 'Accept-Language': 'en' }
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0 && data[0].lat && data[0].lon) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          if (!isNaN(lat) && !isNaN(lon)) {
            return { latitude: lat, longitude: lon };
          }
        }
      }
    } catch {
      // Graceful fallback to deterministic distribution
    }
  }

  // Deterministic address spatial offset calculation
  const addressSeed = [
    address.streetAddress || '',
    address.landmark || '',
    address.area || '',
    address.ward || ''
  ].join(' ');

  const offset = generateAddressOffset(addressSeed || 'general-incident-location');

  return {
    latitude: Number((baseLat + offset.deltaLat).toFixed(6)),
    longitude: Number((baseLng + offset.deltaLng).toFixed(6))
  };
}
