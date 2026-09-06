import React, { useState, useEffect, useRef } from 'react';
import {
  Navigation,
  Check,
  AlertTriangle,
  RefreshCw,
  Edit3,
  ExternalLink,
  Loader2,
  Crosshair,
  MapPin,
  Compass,
  Shield,
  Map as MapIcon
} from 'lucide-react';
import {
  acquireDevicePosition,
  checkDeviceLocationPermission,
  getSupplementaryAddress,
  DevicePosition,
  DeviceLocationError
} from '../../services/deviceLocation';
import L from 'leaflet';

export interface LocationReportState {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  source: 'device_gps' | 'manual';
  approximateLocation: string;
  exactAddress: string;
  ward: string;
  isGpsCaptured: boolean;
}

interface DeviceLocationStepProps {
  currentLocation: LocationReportState | null;
  onLocationConfirmed: (location: LocationReportState) => void;
  defaultWard?: string;
  defaultCity?: string;
}

export const DeviceLocationStep: React.FC<DeviceLocationStepProps> = ({
  currentLocation,
  onLocationConfirmed,
  defaultWard = 'Ward 24',
  defaultCity = 'Local Community'
}) => {
  const [detectedPosition, setDetectedPosition] = useState<DevicePosition | null>(() => {
    if (currentLocation && currentLocation.latitude && currentLocation.longitude) {
      return {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        accuracy: currentLocation.accuracy || 15,
        timestamp: currentLocation.timestamp || Date.now(),
        source: currentLocation.source || 'device_gps'
      };
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<{
    code: string;
    message: string;
    isPermanentDenied?: boolean;
    isServicesDisabled?: boolean;
  } | null>(null);

  const [supplementaryAddress, setSupplementaryAddress] = useState<string>(
    currentLocation?.exactAddress || ''
  );
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualAddressInput, setManualAddressInput] = useState(
    currentLocation?.approximateLocation || ''
  );
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMapPreview, setShowMapPreview] = useState(true);

  // Leaflet map container ref for keyless preview
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Handler: Tap "Use Current Location" or "Try Again"
  const handleUseCurrentLocation = async () => {
    setIsLoading(true);
    setErrorState(null);
    setIsManualMode(false);

    try {
      // 1. Log and check permission
      const perm = await checkDeviceLocationPermission();
      console.log('Location permission:', perm);

      // 2. Acquire device GPS via high -> lower fallback sequence
      const position = await acquireDevicePosition();
      setDetectedPosition(position);

      // 3. Trigger non-blocking supplementary reverse geocoding
      getSupplementaryAddress(position.latitude, position.longitude).then((supp) => {
        if (supp.formattedAddress) {
          setSupplementaryAddress(supp.formattedAddress);
        }
      });
    } catch (err: any) {
      console.error('Location detection failed:', err);

      if (err instanceof DeviceLocationError) {
        if (err.code === 'PERMISSION_DENIED') {
          setErrorState({
            code: 'PERMISSION_DENIED',
            message: 'Location permission is required to automatically detect your location.',
            isPermanentDenied: true
          });
        } else if (err.code === 'LOCATION_SERVICES_DISABLED') {
          setErrorState({
            code: 'LOCATION_SERVICES_DISABLED',
            message: 'Location services are turned off on your device.',
            isServicesDisabled: true
          });
        } else if (err.code === 'GPS_TIMEOUT') {
          setErrorState({
            code: 'GPS_TIMEOUT',
            message: 'GPS acquisition timed out. Please ensure you have a clear view of the sky or try again.'
          });
        } else {
          setErrorState({
            code: err.code,
            message: err.message || 'Could not acquire device location.'
          });
        }
      } else {
        setErrorState({
          code: 'UNKNOWN',
          message: err?.message || 'Device location unavailable. Please try again or enter location manually.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: "Use This Location"
  const handleConfirmLocation = () => {
    if (detectedPosition) {
      const approxLoc = manualAddressInput.trim()
        ? manualAddressInput.trim()
        : supplementaryAddress
        ? supplementaryAddress.split(',').slice(0, 2).join(', ')
        : `Coordinates (${detectedPosition.latitude.toFixed(4)}, ${detectedPosition.longitude.toFixed(4)})`;

      const exactLoc = supplementaryAddress || `${approxLoc} [Lat: ${detectedPosition.latitude.toFixed(5)}, Lng: ${detectedPosition.longitude.toFixed(5)}]`;

      onLocationConfirmed({
        latitude: detectedPosition.latitude,
        longitude: detectedPosition.longitude,
        accuracy: detectedPosition.accuracy,
        timestamp: detectedPosition.timestamp,
        source: 'device_gps',
        approximateLocation: approxLoc,
        exactAddress: exactLoc,
        ward: defaultWard,
        isGpsCaptured: true
      });
    }
  };

  // Handler: Manual Location Save
  const handleConfirmManualLocation = () => {
    if (!manualAddressInput.trim()) return;

    onLocationConfirmed({
      latitude: detectedPosition?.latitude || 0,
      longitude: detectedPosition?.longitude || 0,
      accuracy: 0,
      timestamp: Date.now(),
      source: 'manual',
      approximateLocation: manualAddressInput.trim(),
      exactAddress: `${manualAddressInput.trim()}, ${defaultCity}`,
      ward: defaultWard,
      isGpsCaptured: false
    });
  };

  // Optional Keyless Map Preview (Leaflet / OpenStreetMap - Zero API keys)
  useEffect(() => {
    if (!detectedPosition || !showMapPreview) return;
    if (!mapContainerRef.current) return;

    const lat = detectedPosition.latitude;
    const lng = detectedPosition.longitude;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      // Custom neo-brutalist pin
      const icon = L.divIcon({
        className: 'device-gps-pin',
        html: `
          <div style="
            width: 36px;
            height: 36px;
            border-radius: 50% 50% 50% 0;
            background-color: #FF5C00;
            border: 3px solid #000000;
            box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background-color: #E2FF4D;
              border: 2px solid #000000;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);

      leafletMapRef.current = map;
      markerRef.current = marker;
    } else {
      leafletMapRef.current.setView([lat, lng], 16);
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
    }
  }, [detectedPosition, showMapPreview]);

  return (
    <div className="space-y-4">
      {/* INITIAL STATE & LOCATION ACTION */}
      {!detectedPosition && !isLoading && !errorState && !isManualMode && (
        <div className="p-6 rounded-[24px] border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#E2FF4D] border-2 border-black mx-auto flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Crosshair className="w-8 h-8 text-black stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black uppercase tracking-tight text-black flex items-center justify-center gap-1.5">
              <span>📍 Current Location</span>
            </h3>
            <p className="text-xs text-zinc-600 font-semibold max-w-sm mx-auto">
              Allow location access to automatically detect where this issue is.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              id="wizard-use-location-btn"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#FF5C00] hover:bg-[#e65300] text-white font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4 stroke-[3]" />
              <span>Use Current Location</span>
            </button>

            <button
              type="button"
              onClick={() => setIsManualMode(true)}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-tight border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Enter Manually</span>
            </button>
          </div>

          <div className="pt-1 text-[11px] text-zinc-500 font-medium flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-zinc-400" />
            <span>Coordinates fetched directly from device GPS (No third-party Maps API required)</span>
          </div>
        </div>
      )}

      {/* LOADING STATE: Detecting your location... */}
      {isLoading && (
        <div className="p-8 rounded-[24px] border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FF5C00] border-2 border-black mx-auto flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative">
            <Navigation className="w-8 h-8 text-white stroke-[2.5] animate-pulse" />
            <div className="absolute -inset-1 rounded-full border-2 border-dashed border-black animate-spin" />
          </div>

          <div className="space-y-1">
            <h4 className="text-base font-black uppercase tracking-tight text-black flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#FF5C00]" />
              <span>Detecting your location...</span>
            </h4>
            <p className="text-xs text-zinc-500 font-semibold">
              Connecting to device GPS satellites and positioning hardware...
            </p>
          </div>
        </div>
      )}

      {/* ERROR STATES: Permission Denied / Location Services Disabled / Timeout */}
      {errorState && !isLoading && (
        <div className="p-6 rounded-[24px] border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <AlertTriangle className="w-6 h-6 text-black stroke-[2.5]" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="text-sm font-black uppercase tracking-tight text-black">
                {errorState.isServicesDisabled
                  ? 'Location services are turned off'
                  : errorState.isPermanentDenied
                  ? 'Location permission is required'
                  : 'Location Detection Unavailable'}
              </h4>
              <p className="text-xs text-zinc-700 font-medium">
                {errorState.message}
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="px-5 py-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#e65300] text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{errorState.isServicesDisabled ? 'Turn On Location / Retry' : 'Try Again'}</span>
            </button>

            {errorState.isPermanentDenied && (
              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-black text-white font-black text-xs uppercase tracking-tight border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition cursor-pointer flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Settings</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setErrorState(null);
                setIsManualMode(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#E2FF4D] hover:bg-[#d4f33b] text-black font-black text-xs uppercase tracking-tight border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition cursor-pointer flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Enter Location Manually</span>
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS STATE: ✓ Current location detected */}
      {detectedPosition && !isLoading && (
        <div className="space-y-4">
          <div className="p-5 rounded-[24px] border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
            {/* Header / Success Indicator */}
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#E2FF4D] border-2 border-black flex items-center justify-center">
                  <Check className="w-4 h-4 stroke-[3] text-black" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tight text-black">
                    ✓ Current location detected
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">
                    Device Native GPS Fix
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-black text-white font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E2FF4D] animate-ping" />
                  <span>± {Math.round(detectedPosition.accuracy)}m</span>
                </span>
              </div>
            </div>

            {/* Coordinates Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-zinc-50 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider block">
                  Latitude
                </span>
                <span className="text-sm font-mono font-black text-black">
                  {detectedPosition.latitude.toFixed(6)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider block">
                  Longitude
                </span>
                <span className="text-sm font-mono font-black text-black">
                  {detectedPosition.longitude.toFixed(6)}
                </span>
              </div>
            </div>

            {/* Supplementary Context if resolved */}
            {supplementaryAddress && (
              <div className="p-3 rounded-xl bg-[#E2FF4D]/30 border-2 border-black text-xs font-semibold text-zinc-800">
                <span className="text-[9px] font-black uppercase tracking-wide text-zinc-500 block">
                  Detected Neighborhood (Supplementary)
                </span>
                <span className="line-clamp-2">{supplementaryAddress}</span>
              </div>
            )}

            {/* Optional Map Preview (Zero API Key) */}
            {showMapPreview && (
              <div className="relative rounded-2xl overflow-hidden border-2 border-black h-40 bg-zinc-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div ref={mapContainerRef} className="w-full h-full" />
                <div className="absolute top-2 left-2 z-[1000] px-2 py-0.5 rounded-md bg-white/95 border border-black text-[9px] font-black uppercase tracking-tight flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#FF5C00]" />
                  <span>GPS Lock Visualizer</span>
                </div>
              </div>
            )}

            {/* Optional Specific Spot / Landmark Note */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-tight text-black flex items-center justify-between">
                <span>Specific Spot / Landmark (Optional)</span>
                <span className="text-[10px] text-zinc-500 font-bold">e.g. Near Pole #4, Gate 2</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Near Pole #4, In front of House 21"
                value={manualAddressInput}
                onChange={(e) => setManualAddressInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C00] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>

            {/* Primary Action: Use This Location */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleConfirmLocation}
                id="wizard-confirm-location-btn"
                className="flex-1 py-3.5 px-6 rounded-xl bg-[#E2FF4D] hover:bg-[#d6f733] text-black font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Use This Location</span>
              </button>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="px-4 py-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-tight border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition cursor-pointer flex items-center justify-center gap-1.5"
                title="Re-fetch device GPS"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-scan GPS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL MODE: When GPS is not available or user prefers manual input */}
      {isManualMode && !detectedPosition && (
        <div className="p-6 rounded-[24px] border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="space-y-1">
            <h4 className="text-base font-black uppercase tracking-tight text-black flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#FF5C00]" />
              <span>Enter Location Manually</span>
            </h4>
            <p className="text-xs text-zinc-500 font-semibold">
              Describe the landmark, colony, or street where the issue is located.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-tight text-black">
              Address / Landmark / Colony
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Near Community Center, Lane 4, Main Road, Block B"
              value={manualAddressInput}
              onChange={(e) => setManualAddressInput(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-black text-xs font-bold bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C00] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleConfirmManualLocation}
              disabled={!manualAddressInput.trim()}
              className="flex-1 py-3 px-5 rounded-xl bg-[#FF5C00] hover:bg-[#e65300] text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 transition cursor-pointer"
            >
              Save Manual Location
            </button>

            <button
              type="button"
              onClick={() => {
                setIsManualMode(false);
                setErrorState(null);
              }}
              className="px-4 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-tight border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* PERMISSION SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border-3 border-black rounded-[24px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <h3 className="text-base font-black uppercase tracking-tight text-black flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#FF5C00]" />
                <span>Enable Device Location</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="w-8 h-8 rounded-lg border-2 border-black bg-zinc-100 font-mono font-bold text-sm flex items-center justify-center hover:bg-zinc-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-700 font-medium leading-relaxed">
              <p className="font-bold text-black">
                To allow the browser to detect your current position:
              </p>
              <div className="p-3 rounded-xl bg-zinc-50 border-2 border-black space-y-1.5 text-[11px]">
                <div>1. Click the <strong>lock / tune icon</strong> in your browser address bar.</div>
                <div>2. Set <strong>Location</strong> to <strong>Allow</strong>.</div>
                <div>3. On mobile (Android/iOS), ensure <strong>Device Location/GPS</strong> is turned on in system quick settings.</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowSettingsModal(false);
                  handleUseCurrentLocation();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#E2FF4D] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                Done, Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
