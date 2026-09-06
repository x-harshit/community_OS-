import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Building,
  Check,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { generateAddressOffset } from '../../utils/addressGeocoding';

export interface ManualLocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
  source: 'manual';
  approximateLocation: string;
  exactAddress: string;
  ward: string;
  streetAddress: string;
  area: string;
  landmark: string;
  city: string;
  isGpsCaptured: boolean;
}

interface ManualAddressStepProps {
  currentLocation: {
    exactAddress?: string;
    approximateLocation?: string;
    ward?: string;
    streetAddress?: string;
    area?: string;
    landmark?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  } | null;
  defaultWard: string;
  defaultCity: string;
  defaultCommunityName: string;
  defaultCoordinates: { lat: number; lng: number };
  onLocationConfirmed: (data: ManualLocationData) => void;
}

export const ManualAddressStep: React.FC<ManualAddressStepProps> = ({
  currentLocation,
  defaultCoordinates,
  onLocationConfirmed
}) => {
  // Fields start empty without pre-filling; placeholders provide guidance
  const [streetAddress, setStreetAddress] = useState<string>(() => {
    return currentLocation?.streetAddress || '';
  });

  const [area, setArea] = useState<string>(() => {
    return currentLocation?.area || '';
  });

  const [landmark, setLandmark] = useState<string>(() => {
    return currentLocation?.landmark || '';
  });

  const [ward, setWard] = useState<string>(() => {
    return currentLocation?.ward || '';
  });

  const [city, setCity] = useState<string>(() => {
    return currentLocation?.city || '';
  });

  useEffect(() => {
    if (currentLocation) {
      if (currentLocation.streetAddress !== undefined) setStreetAddress(currentLocation.streetAddress || '');
      if (currentLocation.area !== undefined) setArea(currentLocation.area || '');
      if (currentLocation.landmark !== undefined) setLandmark(currentLocation.landmark || '');
      if (currentLocation.ward !== undefined) setWard(currentLocation.ward || '');
      if (currentLocation.city !== undefined) setCity(currentLocation.city || '');
    }
  }, [currentLocation]);

  const [touched, setTouched] = useState(false);

  // Validation: Street address and Area/Colony are mandatory
  const isStreetValid = streetAddress.trim().length >= 3;
  const isAreaValid = area.trim().length >= 2;
  const isFormValid = isStreetValid && isAreaValid;

  const fullExactAddress = [
    streetAddress.trim(),
    landmark.trim() ? `Near ${landmark.trim()}` : null,
    area.trim(),
    ward.trim()
      ? ward.trim().toLowerCase().startsWith('ward')
        ? ward.trim()
        : `Ward ${ward.trim()}`
      : null,
    city.trim()
  ]
    .filter(Boolean)
    .join(', ');

  const publicApproximateLocation = [area.trim(), city.trim()].filter(Boolean).join(', ') || area.trim();

  const handleConfirm = () => {
    setTouched(true);
    if (!isFormValid) return;

    // Derive realistic coordinates based on entered address
    const addressSeed = [
      streetAddress.trim(),
      landmark.trim(),
      area.trim(),
      city.trim()
    ].filter(Boolean).join(' ');

    const offset = generateAddressOffset(addressSeed);
    const resolvedLat = Number((defaultCoordinates.lat + offset.deltaLat).toFixed(6));
    const resolvedLng = Number((defaultCoordinates.lng + offset.deltaLng).toFixed(6));

    onLocationConfirmed({
      latitude: resolvedLat,
      longitude: resolvedLng,
      accuracy: 10,
      timestamp: Date.now(),
      source: 'manual',
      approximateLocation: publicApproximateLocation || 'Neighborhood',
      exactAddress: fullExactAddress,
      ward: ward.trim() || 'Local Ward',
      streetAddress: streetAddress.trim(),
      area: area.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      isGpsCaptured: false
    });
  };

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div>
        <h3 className="text-base font-black uppercase tracking-tight text-black flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#FF5C00] stroke-[2.5]" />
          <span>Enter Incident Address</span>
        </h3>
        <p className="text-xs text-zinc-500 font-semibold">
          Please enter the address manually. Follow the placeholder guidance in each field.
        </p>
      </div>

      {/* Guidance Notice Banner */}
      <div className="p-3 bg-zinc-100 rounded-2xl border border-zinc-300 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
        <div className="text-[11px] text-zinc-700 font-medium leading-relaxed">
          <span className="font-black uppercase text-black">Address Guidance: </span>
          Enter the exact street/house details and neighborhood so dispatch teams and community repair squads can locate the issue without delays.
        </div>
      </div>

      {/* Manual Input Fields with Guidance Placeholders (No Pre-filled Data) */}
      <div className="space-y-3.5 bg-white p-4 sm:p-5 rounded-[22px] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        {/* Field 1: Street Address / Plot / House No. (Mandatory) */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase text-black flex items-center justify-between">
            <span>
              Street Address / House / Plot No. <span className="text-[#FF5C00]">* (Mandatory)</span>
            </span>
            {touched && !isStreetValid && (
              <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                Required (min 3 chars)
              </span>
            )}
          </label>
          <input
            type="text"
            placeholder="e.g., House No. 42, 3rd Cross, 12th Main Road"
            value={streetAddress}
            onChange={(e) => {
              setStreetAddress(e.target.value);
              setTouched(true);
            }}
            className={`w-full px-4 py-2.5 rounded-xl border-2 text-xs font-bold focus:outline-none transition placeholder:text-zinc-400 placeholder:font-normal ${
              touched && !isStreetValid
                ? 'border-red-500 bg-red-50/40 focus:bg-white'
                : 'border-black bg-zinc-50 focus:bg-white'
            }`}
            id="manual-street-address-input"
          />
          <p className="text-[10px] text-zinc-400 font-medium px-1">
            Guidance: Mention road number, building name, lane, or house/shop number.
          </p>
        </div>

        {/* Field 2 & 3: Area/Colony & Nearby Landmark */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Field 2: Area / Neighborhood (Mandatory) */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-black flex items-center justify-between">
              <span>
                Area / Colony / Sector <span className="text-[#FF5C00]">* (Mandatory)</span>
              </span>
              {touched && !isAreaValid && (
                <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  Required
                </span>
              )}
            </label>
            <input
              type="text"
              placeholder="e.g., Greenfield Colony, Sector 14, Indiranagar"
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                setTouched(true);
              }}
              className={`w-full px-4 py-2.5 rounded-xl border-2 text-xs font-bold focus:outline-none transition placeholder:text-zinc-400 placeholder:font-normal ${
                touched && !isAreaValid
                  ? 'border-red-500 bg-red-50/40 focus:bg-white'
                  : 'border-black bg-zinc-50 focus:bg-white'
              }`}
              id="manual-area-input"
            />
            <p className="text-[10px] text-zinc-400 font-medium px-1">
              Guidance: Neighborhood, sector, or township name.
            </p>
          </div>

          {/* Field 3: Landmark (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-black flex items-center justify-between">
              <span>Nearby Landmark (Optional)</span>
              <span className="text-[10px] text-zinc-400 font-bold">Optional</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Opposite Community Park, Near Water Tank"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-black text-xs font-bold focus:outline-none bg-zinc-50 focus:bg-white placeholder:text-zinc-400 placeholder:font-normal"
              id="manual-landmark-input"
            />
            <p className="text-[10px] text-zinc-400 font-medium px-1">
              Guidance: Easily identifiable spot (school, gate, transformer, shop).
            </p>
          </div>
        </div>

        {/* Field 4 & 5: Ward & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-zinc-200">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-black flex items-center justify-between">
              <span>Ward / Zone</span>
              <span className="text-[10px] text-zinc-400 font-bold">Optional</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Ward 24, South Zone"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-black text-xs font-bold focus:outline-none bg-zinc-50 focus:bg-white placeholder:text-zinc-400 placeholder:font-normal"
              id="manual-ward-input"
            />
            <p className="text-[10px] text-zinc-400 font-medium px-1">
              Guidance: Municipal ward number or administrative zone.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-black flex items-center justify-between">
              <span>City / District</span>
              <span className="text-[10px] text-zinc-400 font-bold">Optional</span>
            </label>
            <input
              type="text"
              placeholder="e.g., New Delhi, Bengaluru, Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-black text-xs font-bold focus:outline-none bg-zinc-50 focus:bg-white placeholder:text-zinc-400 placeholder:font-normal"
              id="manual-city-input"
            />
            <p className="text-[10px] text-zinc-400 font-medium px-1">
              Guidance: City or district municipality.
            </p>
          </div>
        </div>
      </div>

      {/* Live Formatted Address Card */}
      <div className="p-3.5 bg-zinc-50 rounded-[20px] border-2 border-black space-y-2">
        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-black">
          <span className="flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[#FF5C00]" />
            Formatted Address Preview
          </span>
          <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-mono font-bold">
            Manual Entry
          </span>
        </div>

        <div className="text-xs text-black font-semibold bg-white p-3 rounded-xl border border-zinc-300 min-h-[44px] flex items-center">
          {fullExactAddress ? (
            <span className="text-black font-bold">{fullExactAddress}</span>
          ) : (
            <span className="text-zinc-400 italic">
              Address preview will appear here as you enter street address and area...
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] text-zinc-600 font-semibold px-1">
          <span>Public Community View: <strong>{publicApproximateLocation || 'Area Name'}</strong></span>
          <span>Municipal Squad Dispatch: <strong>Full Address</strong></span>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={!isFormValid}
        className="w-full py-3 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition active:translate-x-[1px] active:translate-y-[1px]"
        id="confirm-manual-address-btn"
      >
        <Check className="w-4 h-4 stroke-[3]" />
        <span>Save Address & Continue</span>
      </button>

      {touched && !isFormValid && (
        <p className="text-[11px] text-red-600 font-bold flex items-center justify-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Please enter both Street Address and Area to proceed.</span>
        </p>
      )}
    </div>
  );
};
