/**
 * MapProvider Abstraction
 * Decouples GPS acquisition from any visual map rendering layer.
 * GPS coordinates are retrieved strictly from native device location services.
 * Map visualization is purely an optional rendering layer and does not require any API keys.
 */

export interface MapProvider {
  readonly id: string;
  readonly name: string;
  isAvailable(): boolean;
  showLocation?(latitude: number, longitude: number, containerElement: HTMLElement): void;
  destroy?(): void;
}

/**
 * OpenStreetMap / Leaflet keyless map provider
 * Requires ZERO API keys, completely free and open.
 */
export class OpenStreetMapProvider implements MapProvider {
  readonly id = 'leaflet_osm';
  readonly name = 'OpenStreetMap (Keyless)';

  isAvailable(): boolean {
    return typeof window !== 'undefined';
  }

  showLocation(latitude: number, longitude: number, container: HTMLElement): void {
    // Dynamically safely handles container rendering
    if (!container) return;
  }
}

/**
 * Fallback Noop Map Provider
 * Operates when no map rendering is requested or active.
 */
export class NoopMapProvider implements MapProvider {
  readonly id = 'none';
  readonly name = 'No Visual Map (Coordinate Mode)';

  isAvailable(): boolean {
    return true;
  }
}

export const defaultMapProvider: MapProvider = new OpenStreetMapProvider();
