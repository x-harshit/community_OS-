import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import L from 'leaflet';
import { getStatusConfig } from '../components/CategoryIcon';
import {
  MapPin,
  Users,
  ChevronRight,
  PlusCircle,
  Maximize2,
  List,
  Crosshair,
  Layers,
  AlertCircle
} from 'lucide-react';
import { CivicReport } from '../types';

export const MapScreen: React.FC = () => {
  const {
    reports,
    selectedCommunity,
    categories,
    setSelectedReportId,
    setIsReportWizardOpen,
    markAffected,
    identity
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [activeMarkerReportId, setActiveMarkerReportId] = useState<string | null>(reports[0]?.id || null);
  const [showCaseListDrawer, setShowCaseListDrawer] = useState<boolean>(true);

  const activeReport = reports.find((r) => r.id === activeMarkerReportId);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedCommunity.coordinates.lat, selectedCommunity.coordinates.lng],
        zoom: 15,
        zoomControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }
  }, [selectedCommunity]);

  // Fit all markers in view helper
  const fitAllCasesInView = () => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const layers = markersLayerRef.current.getLayers();
    if (layers.length > 0) {
      const group = L.featureGroup(layers as L.Marker[]);
      const bounds = group.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds.pad(0.18), { maxZoom: 16 });
      }
    }
  };

  // Filter reports
  const filteredReports = reports.filter((r) => {
    if (selectedStatusFilter !== 'ALL') {
      if (selectedStatusFilter === 'OPEN' && r.status !== 'SUBMITTED' && r.status !== 'SENT_TO_AUTHORITY') return false;
      if (selectedStatusFilter === 'IN_PROGRESS' && r.status !== 'IN_PROGRESS' && r.status !== 'ASSIGNED') return false;
      if (selectedStatusFilter === 'RESOLVED' && r.status !== 'RESOLVED') return false;
    }
    if (selectedCategoryFilter !== 'ALL' && r.categoryId !== selectedCategoryFilter) {
      return false;
    }
    return true;
  });

  // Calculate distinct coordinates for each report, handling any co-located reports so none overlap
  const coordSpreadMap = new Map<string, number>();
  const positionedReports = filteredReports.map((report) => {
    const key = `${report.latitude.toFixed(4)},${report.longitude.toFixed(4)}`;
    const collisionCount = coordSpreadMap.get(key) || 0;
    coordSpreadMap.set(key, collisionCount + 1);

    if (collisionCount > 0) {
      // Gentle spiral offset (~25 meters per overlapping pin)
      const angle = collisionCount * (Math.PI / 3);
      const dist = 0.00032 * Math.ceil(collisionCount / 4);
      return {
        ...report,
        mapLat: report.latitude + dist * Math.cos(angle),
        mapLng: report.longitude + dist * Math.sin(angle)
      };
    }

    return {
      ...report,
      mapLat: report.latitude,
      mapLng: report.longitude
    };
  });

  // Update Markers based on positioned reports
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    markersMapRef.current.clear();

    if (positionedReports.length === 0) return;

    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    positionedReports.forEach((report) => {
      const isSelected = report.id === activeMarkerReportId;

      const categoryEmoji =
        report.categoryId === 'waste'
          ? '🗑️'
          : report.categoryId === 'water'
          ? '💧'
          : report.categoryId === 'road'
          ? '🛣️'
          : report.categoryId === 'street_light'
          ? '💡'
          : report.categoryId === 'parks'
          ? '🌳'
          : report.categoryId === 'traffic'
          ? '🚦'
          : '🚨';

      const bgCol =
        report.status === 'RESOLVED'
          ? '#4ade80'
          : report.status === 'IN_PROGRESS'
          ? '#FF5C00'
          : '#E2FF4D';

      // Neo-brutalist Bento Map Pin with address indicator
      const customIcon = L.divIcon({
        className: `custom-map-pin ${isSelected ? 'pin-active' : ''}`,
        html: `
          <div style="
            position: relative;
            width: ${isSelected ? '44px' : '38px'};
            height: ${isSelected ? '44px' : '38px'};
            border-radius: 14px;
            background-color: ${bgCol};
            border: ${isSelected ? '3px solid #000000' : '2px solid #000000'};
            box-shadow: ${isSelected ? '5px 5px 0px 0px rgba(0,0,0,1)' : '3px 3px 0px 0px rgba(0,0,0,1)'};
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000000;
            font-size: ${isSelected ? '20px' : '17px'};
            cursor: pointer;
            font-weight: 900;
            transition: transform 0.15s ease;
            transform: ${isSelected ? 'scale(1.1) translateY(-4px)' : 'scale(1)'};
          ">
            ${categoryEmoji}
            <div style="
              position: absolute;
              bottom: -9px;
              left: 50%;
              transform: translateX(-50%);
              background: #000000;
              color: #ffffff;
              font-size: 8px;
              font-weight: 900;
              padding: 1px 4px;
              border-radius: 4px;
              white-space: nowrap;
              border: 1px solid #ffffff;
              letter-spacing: 0.5px;
            ">
              ${report.id.replace('CC-', '#')}
            </div>
          </div>
        `,
        iconSize: isSelected ? [44, 44] : [38, 38],
        iconAnchor: isSelected ? [22, 22] : [19, 19]
      });

      const marker = L.marker([report.mapLat, report.mapLng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 100
      });

      // Rich tooltip showing case ID, status, title and exact address
      const tooltipContent = `
        <div style="font-family: inherit; padding: 2px 4px; min-width: 170px; max-width: 240px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
            <span style="color: #FF5C00; font-weight: 900; font-size: 10px;">${report.id}</span>
            <span style="background: #000; color: #fff; font-size: 9px; padding: 1px 5px; border-radius: 4px; font-weight: 800;">${report.status}</span>
          </div>
          <div style="color: #000000; font-weight: 800; font-size: 11px; line-height: 1.3; margin: 3px 0;">${escapeHtml(report.title)}</div>
          <div style="color: #444444; font-size: 10px; font-weight: 600; display: flex; align-items: flex-start; gap: 3px; margin-top: 4px; border-top: 1px dashed #ccc; padding-top: 3px;">
            <span style="flex-shrink: 0;">📍</span>
            <span style="line-height: 1.2;">${escapeHtml(report.exactAddress || report.approximateLocation)}</span>
          </div>
        </div>
      `;

      marker.bindTooltip(tooltipContent, {
        direction: 'top',
        offset: [0, -18],
        className: 'custom-leaflet-tooltip',
        opacity: 0.98
      });

      marker.on('click', () => {
        setActiveMarkerReportId(report.id);
        mapInstanceRef.current?.panTo([report.mapLat, report.mapLng], {
          animate: true,
          duration: 0.5
        });
      });

      markersLayerRef.current?.addLayer(marker);
      markersMapRef.current.set(report.id, marker);
    });

    // Auto fit map bounds to ensure all filtered cases are in view
    fitAllCasesInView();
  }, [positionedReports.length, selectedStatusFilter, selectedCategoryFilter, activeMarkerReportId]);

  // Handle clicking a report from the drawer/carousel
  const handleSelectReport = (report: (typeof positionedReports)[0]) => {
    setActiveMarkerReportId(report.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([report.mapLat, report.mapLng], 16, {
        animate: true
      });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] md:h-[calc(100vh-85px)] rounded-[32px] overflow-hidden border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-zinc-100 flex flex-col">
      {/* Top Filter Floating Bento Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-start justify-between gap-2 pointer-events-none">
        {/* Left Side: Filter Buttons */}
        <div className="flex flex-col gap-2 max-w-xl pointer-events-auto">
          {/* Status Filters Bento Strip */}
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-[20px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black overflow-x-auto">
            {[
              { id: 'ALL', label: `All Cases (${reports.length})` },
              { id: 'OPEN', label: '🟡 Open' },
              { id: 'IN_PROGRESS', label: '🟠 In Progress' },
              { id: 'RESOLVED', label: '🟢 Resolved' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all border-2 cursor-pointer ${
                  selectedStatusFilter === f.id
                    ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-zinc-700 hover:text-black border-transparent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Category Bento Pills */}
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-[18px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black overflow-x-auto">
            <button
              onClick={() => setSelectedCategoryFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0 cursor-pointer border ${
                selectedCategoryFilter === 'ALL'
                  ? 'bg-[#E2FF4D] text-black border-black font-black'
                  : 'bg-zinc-100 text-zinc-600 hover:text-black border-transparent'
              }`}
            >
              All Categories
            </button>
            {categories.slice(0, 6).map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategoryFilter(c.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0 cursor-pointer border ${
                  selectedCategoryFilter === c.id
                    ? 'bg-[#E2FF4D] text-black border-black font-black'
                    : 'bg-zinc-100 text-zinc-600 hover:text-black border-transparent'
                }`}
              >
                {c.name.split('/')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Grid Status Badge & Fit-All Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-white px-3.5 py-2 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-left">
              <div className="text-[11px] font-black uppercase tracking-wider text-black">
                {positionedReports.length} Cases on Grid Map
              </div>
              <div className="text-[9px] font-bold text-zinc-500">
                Mapped according to address
              </div>
            </div>
          </div>

          <button
            onClick={fitAllCasesInView}
            title="Fit all cases into view"
            className="p-2.5 bg-white hover:bg-zinc-50 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black cursor-pointer transition active:scale-95 flex items-center gap-1.5 text-xs font-black"
          >
            <Maximize2 className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Fit All</span>
          </button>

          <button
            onClick={() => setShowCaseListDrawer(!showCaseListDrawer)}
            title="Toggle Cases List"
            className={`p-2.5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition active:scale-95 flex items-center gap-1.5 text-xs font-black ${
              showCaseListDrawer ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-50'
            }`}
          >
            <List className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">List ({positionedReports.length})</span>
          </button>
        </div>
      </div>

      {/* Floating Action Button to Report at Pin */}
      <button
        onClick={() => setIsReportWizardOpen(true)}
        className="absolute top-28 sm:top-20 right-4 z-20 px-4 py-3 rounded-2xl bg-[#FF5C00] hover:bg-[#e65300] text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 cursor-pointer transition active:scale-95"
      >
        <PlusCircle className="w-4 h-4 stroke-[3]" />
        <span>New Report</span>
      </button>

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0 flex-1" />

      {/* Interactive All Cases Strip / Carousel on Grid Map */}
      {showCaseListDrawer && positionedReports.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-[24px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] pointer-events-auto">
            <div className="flex items-center justify-between px-2 pb-1.5 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#FF5C00]" />
                  Live Cases According to Address ({positionedReports.length})
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#E2FF4D] text-black border border-black">
                  Click to locate on map
                </span>
              </div>
              <button
                onClick={() => setShowCaseListDrawer(false)}
                className="text-[11px] font-black uppercase text-zinc-500 hover:text-black cursor-pointer px-1"
              >
                Hide
              </button>
            </div>

            {/* Horizontal Scroll of All Cases */}
            <div className="flex items-center gap-2.5 overflow-x-auto pt-2 pb-1 scrollbar-thin">
              {positionedReports.map((report) => {
                const isSelected = report.id === activeMarkerReportId;
                const statusCfg = getStatusConfig(report.status);

                return (
                  <button
                    key={report.id}
                    onClick={() => handleSelectReport(report)}
                    className={`shrink-0 w-64 p-2.5 rounded-[18px] border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(255,92,0,1)] -translate-y-1'
                        : 'bg-zinc-50 hover:bg-white text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-[10px] font-black font-mono ${isSelected ? 'text-[#E2FF4D]' : 'text-zinc-600'}`}>
                        #{report.id}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase tracking-wide border ${
                          isSelected
                            ? 'bg-[#FF5C00] text-white border-white'
                            : 'bg-white text-black border-black'
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <div className={`text-xs font-black line-clamp-1 ${isSelected ? 'text-white' : 'text-black'}`}>
                      {report.title}
                    </div>

                    <div className={`flex items-start gap-1 text-[10px] mt-1 line-clamp-1 ${isSelected ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      <MapPin className="w-3 h-3 shrink-0 text-[#FF5C00] mt-0.5" />
                      <span className="truncate">{report.exactAddress || report.approximateLocation}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-200/40 text-[9px] font-bold">
                      <span className={isSelected ? 'text-zinc-300' : 'text-zinc-500'}>
                        By {report.authorName || 'Citizen'}
                      </span>
                      <span className={`font-black ${isSelected ? 'text-[#E2FF4D]' : 'text-[#FF5C00]'}`}>
                        {report.affectedCount} affected
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Case Quick Action Bar */}
            {activeReport && (
              <div className="mt-2 pt-2 border-t-2 border-zinc-200 flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-xs font-black text-black truncate">
                    Active: <span className="text-[#FF5C00]">#{activeReport.id}</span> - {activeReport.title}
                  </span>
                  <span className="text-[10px] text-zinc-500 hidden md:inline truncate">
                    📍 {activeReport.exactAddress || activeReport.approximateLocation}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => markAffected(activeReport.id)}
                    disabled={identity.affectedReportIds.includes(activeReport.id)}
                    className="py-1.5 px-3 rounded-xl bg-[#E2FF4D] hover:bg-[#d6f733] text-black border border-black text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer shrink-0"
                  >
                    {identity.affectedReportIds.includes(activeReport.id) ? "✓ Affected" : "🙋 I'm Affected"}
                  </button>

                  <button
                    onClick={() => setSelectedReportId(activeReport.id)}
                    className="py-1.5 px-3 rounded-xl bg-black hover:bg-zinc-800 text-white border border-black text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>Full Details</span>
                    <ChevronRight className="w-3 h-3 stroke-[3]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fallback Selected Report Card when drawer is hidden */}
      {!showCaseListDrawer && activeReport && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:max-w-md z-20 animate-in slide-in-from-bottom duration-150">
          <div className="bg-white p-5 rounded-[28px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black text-zinc-500">
                    #{activeReport.id}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border border-black bg-[#E2FF4D] text-black">
                    {activeReport.status}
                  </span>
                </div>
                <h4 className="text-base font-black uppercase tracking-tight text-black mt-1 line-clamp-1">
                  {activeReport.title}
                </h4>
              </div>

              {activeReport.status === 'RESOLVED' && (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#4ade80] text-black border border-black font-black shrink-0">
                  Proof Verified ✓
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-black">
              <span className="flex items-center gap-1 font-black text-[#FF5C00]">
                <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{activeReport.affectedCount} Affected</span>
              </span>
              <span className="flex items-center gap-1 text-zinc-600 truncate">
                <MapPin className="w-3.5 h-3.5 text-black stroke-[2] shrink-0" />
                <span className="truncate max-w-[200px]">{activeReport.exactAddress || activeReport.approximateLocation}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setSelectedReportId(activeReport.id)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Full Case Details</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>

              <button
                onClick={() => markAffected(activeReport.id)}
                disabled={identity.affectedReportIds.includes(activeReport.id)}
                className="py-2.5 px-3 rounded-xl bg-[#E2FF4D] hover:bg-[#d6f733] text-black border-2 border-black text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                {identity.affectedReportIds.includes(activeReport.id) ? "✓ Affected" : "🙋 I'm Affected"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
