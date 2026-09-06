/**
 * Native Device Location Service
 * Direct access to browser/device native GPS location services.
 * Completely independent of Google Maps or any third-party Maps API.
 */

export interface DevicePosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  source: 'device_gps' | 'manual';
  altitude?: number | null;
  speed?: number | null;
}

export type LocationPermissionState = 'granted' | 'prompt' | 'denied' | 'unsupported';

export type DeviceLocationErrorCode =
  | 'PERMISSION_DENIED'
  | 'LOCATION_SERVICES_DISABLED'
  | 'GPS_TIMEOUT'
  | 'POSITION_UNAVAILABLE'
  | 'UNSUPPORTED'
  | 'UNKNOWN_ERROR';

export class DeviceLocationError extends Error {
  code: DeviceLocationErrorCode;
  originalError?: GeolocationPositionError | Error;

  constructor(code: DeviceLocationErrorCode, message: string, originalError?: GeolocationPositionError | Error) {
    super(message);
    this.name = 'DeviceLocationError';
    this.code = code;
    this.originalError = originalError;
  }
}

/**
 * Check location permission status using native permissions API
 */
export async function checkDeviceLocationPermission(): Promise<LocationPermissionState> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    console.log('Location permission: unsupported');
    return 'unsupported';
  }

  try {
    if (navigator.permissions && navigator.permissions.query) {
      const status = await navigator.permissions.query({ name: 'geolocation' });
      console.log('Location permission:', status.state);
      return status.state as LocationPermissionState;
    }
  } catch (err) {
    // Some browsers or iframe environments restrict permissions.query
    console.warn('Could not query permissions.query directly:', err);
  }

  return 'prompt';
}

/**
 * Request device GPS coordinates using native Geolocation API.
 * Follows the robust fallback sequence:
 * 1. High Accuracy mode (GPS hardware lock)
 * 2. If timeout or signal failure, retries with lower accuracy mode (cellular/Wi-Fi triangulation)
 * 3. Returns genuine device coordinates or throws a typed error.
 * NEVER substitutes fake or default coordinates on failure.
 */
export async function acquireDevicePosition(): Promise<DevicePosition> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    console.error('Device location error: Geolocation is not supported in this browser/environment.');
    throw new DeviceLocationError('UNSUPPORTED', 'Geolocation is not supported by your device or browser.');
  }

  // Attempt 1: High accuracy (Device GPS hardware)
  try {
    const position = await fetchPositionWithTimeout({
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0
    });

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;
    const timestamp = position.timestamp || Date.now();

    console.log('Location permission: granted');
    console.log('Location coordinates:', { latitude, longitude });
    console.log('Location accuracy:', accuracy);

    return {
      latitude,
      longitude,
      accuracy,
      timestamp,
      source: 'device_gps',
      altitude: position.coords.altitude,
      speed: position.coords.speed
    };
  } catch (firstError: any) {
    console.warn('High-accuracy GPS fix failed or timed out. Attempting fallback accuracy...', firstError);

    // If permission was explicitly denied, do not retry
    if (firstError.code === 1 /* PERMISSION_DENIED */) {
      console.log('Location permission: denied');
      console.error('Device location error: Permission denied by user');
      throw new DeviceLocationError(
        'PERMISSION_DENIED',
        'Location permission was denied. Location permission is required to automatically detect your location.',
        firstError
      );
    }

    // Attempt 2: Fallback with standard/coarse accuracy (Wi-Fi / Cell tower)
    try {
      const position = await fetchPositionWithTimeout({
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 30000
      });

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const accuracy = position.coords.accuracy;
      const timestamp = position.timestamp || Date.now();

      console.log('Location permission: granted');
      console.log('Location coordinates:', { latitude, longitude });
      console.log('Location accuracy:', accuracy);

      return {
        latitude,
        longitude,
        accuracy,
        timestamp,
        source: 'device_gps',
        altitude: position.coords.altitude,
        speed: position.coords.speed
      };
    } catch (secondError: any) {
      console.error('Fallback location acquisition failed:', secondError);

      if (secondError.code === 1 /* PERMISSION_DENIED */) {
        throw new DeviceLocationError(
          'PERMISSION_DENIED',
          'Location permission was denied. Location permission is required to automatically detect your location.',
          secondError
        );
      } else if (secondError.code === 2 /* POSITION_UNAVAILABLE */) {
        throw new DeviceLocationError(
          'LOCATION_SERVICES_DISABLED',
          'Location services are turned off or unavailable on this device.',
          secondError
        );
      } else if (secondError.code === 3 /* TIMEOUT */) {
        throw new DeviceLocationError(
          'GPS_TIMEOUT',
          'GPS acquisition timed out. Your device GPS signal may be weak or obstructed.',
          secondError
        );
      } else {
        throw new DeviceLocationError(
          'POSITION_UNAVAILABLE',
          secondError.message || 'Device location is currently unavailable.',
          secondError
        );
      }
    }
  }
}

function fetchPositionWithTimeout(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

/**
 * Optional reverse geocoding to provide supplementary human-readable context.
 * Never blocks the report flow or coordinate storage.
 */
export async function getSupplementaryAddress(
  latitude: number,
  longitude: number
): Promise<{
  formattedAddress?: string;
  city?: string;
  ward?: string;
  locality?: string;
}> {
  try {
    // Lightweight, free public reverse geocode
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (res.ok) {
      const data = await res.json();
      const road = data.address?.road || data.address?.pedestrian || data.address?.suburb || '';
      const locality = data.address?.suburb || data.address?.neighbourhood || data.address?.city_district || '';
      const city = data.address?.city || data.address?.town || data.address?.state || '';
      const formatted = data.display_name || `${road}, ${locality}, ${city}`;

      return {
        formattedAddress: formatted,
        city,
        ward: locality || 'Local Ward',
        locality: road || locality
      };
    }
  } catch (e) {
    // Non-blocking: fail gracefully
    console.debug('Supplementary geocoding skipped (non-blocking):', e);
  }

  return {};
}

/**
 * Approximate Location Helper for Community View Privacy
 * When public community users view a report, masks exact GPS precision
 * to approximately ~1km grid or neighborhood level to protect resident privacy.
 */
export function approximateLocationForPrivacy(latitude: number, longitude: number, fallbackLabel?: string): string {
  if (fallbackLabel && fallbackLabel.trim()) {
    return fallbackLabel;
  }
  // Truncate to 2 decimal places (~1.1 km precision)
  const approxLat = latitude.toFixed(2);
  const approxLng = longitude.toFixed(2);
  return `Near coordinates (${approxLat}, ${approxLng})`;
}
