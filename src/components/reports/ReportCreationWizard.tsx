import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryIcon, getCategoryColor } from '../CategoryIcon';
import {
  X,
  Camera,
  Video,
  Image as ImageIcon,
  MapPin,
  Check,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Upload,
  Trash2,
  Navigation,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  Info,
  User,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ManualAddressStep, ManualLocationData } from '../location/ManualAddressStep';

export const ReportCreationWizard: React.FC = () => {
  const {
    isReportWizardOpen,
    setIsReportWizardOpen,
    categories,
    selectedCommunity,
    reports,
    createReport,
    resolveAuthorityForReport,
    setSelectedReportId,
    reportDraft,
    updateDraft,
    clearDraft,
    identity
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [searchCategory, setSearchCategory] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Close camera stream cleanup
  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  if (!isReportWizardOpen) return null;

  const selectedCategory = categories.find((c) => c.id === reportDraft.categoryId);
  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchCategory.toLowerCase()) ||
      c.description.toLowerCase().includes(searchCategory.toLowerCase())
  );

  // Auto-detect duplicates
  const checkForDuplicates = (catId: string, lat?: number, lng?: number) => {
    if (!catId) return null;
    const targetLat = lat || selectedCommunity.coordinates.lat;
    const targetLng = lng || selectedCommunity.coordinates.lng;

    const similar = reports.find((r) => {
      if (r.categoryId !== catId || r.status === 'RESOLVED') return false;
      const dLat = Math.abs(r.latitude - targetLat);
      const dLng = Math.abs(r.longitude - targetLng);
      return dLat < 0.005 && dLng < 0.005;
    });

    return similar || null;
  };

  // Step 1: Choose category
  const handleSelectCategory = (catId: string) => {
    updateDraft({ categoryId: catId });
    setStep(2);
  };

  // Step 2: Camera & Media
  const handleStartCamera = async () => {
    try {
      setLocationError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        mediaStreamRef.current = stream;
        setIsCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        simulatePhotoCapture();
      }
    } catch (err) {
      simulatePhotoCapture();
    }
  };

  const capturePhotoFromStream = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      updateDraft({
        evidence: [
          ...reportDraft.evidence,
          {
            url: dataUrl,
            mediaType: 'image',
            caption: 'Captured live via camera'
          }
        ]
      });
    }
    stopCameraStream();
  };

  const simulatePhotoCapture = () => {
    const samplePhotos: Record<string, string> = {
      waste: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1200&q=80',
      road: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80',
      water: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
      street_light: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      park: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1200&q=80'
    };

    const url = samplePhotos[reportDraft.categoryId || 'waste'] || samplePhotos.waste;
    updateDraft({
      evidence: [
        ...reportDraft.evidence,
        {
          url,
          mediaType: 'image',
          caption: 'Hazard proof snapshot'
        }
      ]
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateDraft({
            evidence: [
              ...reportDraft.evidence,
              {
                url: reader.result,
                mediaType: file.type.startsWith('video') ? 'video' : 'image',
                caption: file.name
              }
            ]
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeEvidenceItem = (index: number) => {
    const updated = [...reportDraft.evidence];
    updated.splice(index, 1);
    updateDraft({ evidence: updated });
  };

  // Step 3: Location System (Manual Address Entry)
  const handleLocationConfirmed = (loc: ManualLocationData) => {
    updateDraft({
      location: {
        lat: loc.latitude,
        lng: loc.longitude,
        latitude: loc.latitude,
        longitude: loc.longitude,
        accuracy: loc.accuracy || 10,
        timestamp: loc.timestamp || Date.now(),
        source: 'manual',
        approximateLocation: loc.approximateLocation,
        exactAddress: loc.exactAddress,
        ward: loc.ward,
        streetAddress: loc.streetAddress,
        area: loc.area,
        landmark: loc.landmark,
        city: loc.city,
        isGpsCaptured: false
      }
    });

    const dup = checkForDuplicates(
      reportDraft.categoryId,
      loc.latitude,
      loc.longitude
    );
    setDuplicateWarning(dup);
    setStep(4);
  };

  const handleGoToDetails = () => {
    if (!reportDraft.location?.exactAddress) {
      return;
    }
    const dup = checkForDuplicates(
      reportDraft.categoryId,
      reportDraft.location.lat,
      reportDraft.location.lng
    );
    setDuplicateWarning(dup);
    setStep(4);
  };

  const handleSubmitReport = () => {
    const enteredName = (reportDraft.userName || '').trim();
    if (!enteredName) {
      setStep(4);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const created = createReport(reportDraft);
        setIsSubmitting(false);
        setIsReportWizardOpen(false);
        setSelectedReportId(created.id);

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (err) {
        setIsSubmitting(false);
        alert((err as Error).message || 'Failed to submit report. Please check your details.');
      }
    }, 600);
  };

  const routingInfo = resolveAuthorityForReport(reportDraft.categoryId, selectedCommunity.city);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white w-full max-w-xl rounded-[32px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] border-2 border-black overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b-2 border-black flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF5C00] text-white border-2 border-black flex items-center justify-center font-black text-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              🚨
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-tight text-black leading-tight">
                Report Civic Problem
              </h2>
              <p className="text-xs text-zinc-500 font-semibold">
                Direct route to {selectedCommunity.name} response squad
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCameraStream();
              setIsReportWizardOpen(false);
            }}
            className="p-1.5 rounded-xl border-2 border-black text-black hover:bg-zinc-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* 5-Step Bento Progress Bar */}
        <div className="px-5 py-3 bg-zinc-50 border-b-2 border-black">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[
              { num: 1, label: 'Category' },
              { num: 2, label: 'Evidence' },
              { num: 3, label: 'Address' },
              { num: 4, label: 'Name & Details' },
              { num: 5, label: 'Dispatch' }
            ].map((s) => (
              <div key={s.num} className="flex items-center">
                <button
                  onClick={() => {
                    if (s.num < step || (s.num === 2 && reportDraft.categoryId)) {
                      stopCameraStream();
                      setStep(s.num as any);
                    }
                  }}
                  disabled={s.num > step && !(s.num === 2 && reportDraft.categoryId)}
                  className={`flex flex-col items-center gap-1 cursor-pointer disabled:cursor-not-allowed`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg border-2 border-black flex items-center justify-center text-xs font-black transition-all ${
                      step === s.num
                        ? 'bg-[#E2FF4D] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : step > s.num
                        ? 'bg-black text-white'
                        : 'bg-white text-zinc-400'
                    }`}
                  >
                    {step > s.num ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline text-black">
                    {s.label}
                  </span>
                </button>
                {s.num < 5 && (
                  <div
                    className={`w-5 sm:w-8 h-[2px] mx-1 border-t-2 ${
                      step > s.num ? 'border-black' : 'border-zinc-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* STEP 1: CATEGORY SELECTION */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-black">
                  Select Civic Hazard Category
                </h3>
                <p className="text-xs text-zinc-500 font-semibold">
                  Determines which municipal squad and equipment gets dispatched.
                </p>
              </div>

              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search categories (e.g. pothole, garbage, streetlight)..."
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-black text-xs font-bold focus:outline-none bg-zinc-50 focus:bg-white"
              />

              {/* Category Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredCategories.map((cat) => {
                  const colors = getCategoryColor(cat.id);
                  const isSelected = reportDraft.categoryId === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`p-3.5 rounded-[20px] border-2 border-black text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#E2FF4D] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                          : 'bg-white hover:bg-zinc-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-xl ${colors.bg}`}>
                          <CategoryIcon iconName={cat.icon} className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-black stroke-[3]" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-tight text-black leading-snug">
                          {cat.name}
                        </h4>
                        <p className="text-[10px] text-zinc-500 font-medium line-clamp-1 mt-0.5">
                          {cat.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: EVIDENCE CAPTURE */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-black">
                    Add Evidence (Photo / Video)
                  </h3>
                  <p className="text-xs text-zinc-500 font-semibold">
                    Field crews require proof to authenticate and inspect work.
                  </p>
                </div>
                {selectedCategory && (
                  <span className="text-[10px] px-3 py-1 rounded-full bg-[#E2FF4D] text-black border-2 border-black font-black uppercase">
                    {selectedCategory.name}
                  </span>
                )}
              </div>

              {/* Live Camera View */}
              {isCameraActive ? (
                <div className="relative rounded-[24px] overflow-hidden border-2 border-black bg-black aspect-video flex flex-col items-center justify-center">
                  <video ref={videoRef} playsInline autoPlay className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 flex items-center gap-3">
                    <button
                      onClick={capturePhotoFromStream}
                      className="px-5 py-2.5 rounded-xl bg-[#FF5C00] text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4 stroke-[2.5]" />
                      Capture Photo
                    </button>
                    <button
                      onClick={stopCameraStream}
                      className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-black uppercase tracking-wider border border-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={handleStartCamera}
                    className="p-4 rounded-[22px] border-2 border-black bg-white hover:bg-zinc-50 flex flex-col items-center justify-center gap-2 transition cursor-pointer text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    id="wizard-take-photo-btn"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FF5C00] text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Camera className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-tight text-black">Take Photo</span>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase">Camera</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 rounded-[22px] border-2 border-black bg-white hover:bg-zinc-50 flex flex-col items-center justify-center gap-2 transition cursor-pointer text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    id="wizard-gallery-btn"
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <ImageIcon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-tight text-black">Upload</span>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase">Gallery</span>
                  </button>

                  <button
                    onClick={simulatePhotoCapture}
                    className="p-4 rounded-[22px] border-2 border-black bg-[#E2FF4D] hover:bg-[#d6f733] flex flex-col items-center justify-center gap-2 transition cursor-pointer text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    id="wizard-sample-photo-btn"
                    title="Quickly attach realistic field sample photo"
                  >
                    <div className="w-10 h-10 rounded-xl bg-black text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Sparkles className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-tight text-black">Test Asset</span>
                    <span className="text-[9px] font-black text-black uppercase">Instant Demo</span>
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* Evidence Preview List */}
              {reportDraft.evidence.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-tight text-black">
                      Attached Evidence ({reportDraft.evidence.length})
                    </span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-[#FF5C00] font-black uppercase tracking-wider hover:underline cursor-pointer"
                    >
                      + Add more
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {reportDraft.evidence.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-[18px] overflow-hidden border-2 border-black aspect-video bg-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                      >
                        {item.mediaType === 'video' ? (
                          <video src={item.url} className="w-full h-full object-cover" />
                        ) : (
                          <img
                            src={item.url}
                            alt="Evidence"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        )}
                        <button
                          onClick={() => removeEvidenceItem(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black text-white border border-white hover:bg-rose-600 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-black/80 p-1 text-[9px] font-black text-white truncate uppercase">
                          {item.caption || `Proof #${idx + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reportDraft.evidence.length === 0 && (
                <div className="p-3 bg-[#E2FF4D]/30 border-2 border-black rounded-[20px] text-xs font-bold text-black flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-black stroke-[2.5]" />
                  <span>
                    Tap <strong>"Test Asset"</strong> to instantly attach a verified field photo for quick testing!
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: MANUAL ADDRESS ENTRY */}
          {step === 3 && (
            <div className="space-y-3.5">
              <ManualAddressStep
                currentLocation={
                  reportDraft.location
                    ? {
                        exactAddress: reportDraft.location.exactAddress,
                        approximateLocation: reportDraft.location.approximateLocation,
                        ward: reportDraft.location.ward,
                        streetAddress: reportDraft.location.streetAddress,
                        area: reportDraft.location.area,
                        landmark: reportDraft.location.landmark,
                        city: reportDraft.location.city,
                        latitude: reportDraft.location.latitude ?? reportDraft.location.lat,
                        longitude: reportDraft.location.longitude ?? reportDraft.location.lng
                      }
                    : null
                }
                defaultWard={selectedCommunity.wardNumber}
                defaultCity={selectedCommunity.city}
                defaultCommunityName={selectedCommunity.name}
                defaultCoordinates={selectedCommunity.coordinates}
                onLocationConfirmed={handleLocationConfirmed}
              />
            </div>
          )}

          {/* STEP 4: MANDATORY USER NAME, DETAILS & DUPLICATE DETECTION */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-black flex items-center gap-2">
                  <span>Reporter Details & Hazard Description</span>
                </h3>
                <p className="text-xs text-zinc-500 font-semibold">
                  Entering your name is mandatory to submit this civic dispatch report.
                </p>
              </div>

              {/* MANDATORY USER NAME FIELD */}
              <div className="p-4 rounded-[22px] border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2">
                <label className="text-xs font-black uppercase text-black flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#FF5C00] stroke-[2.5]" />
                    <span>Your Full Name</span>
                    <span className="text-[#FF5C00] font-black">* (Mandatory)</span>
                  </span>
                  {!reportDraft.userName?.trim() ? (
                    <span className="text-[10px] text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded-full border border-red-300">
                      Required
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" /> Added
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name (e.g. Harshit Sharma)"
                  value={reportDraft.userName || ''}
                  onChange={(e) => updateDraft({ userName: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border-2 text-xs font-bold focus:outline-none transition ${
                    !reportDraft.userName?.trim()
                      ? 'border-red-500 bg-red-50/50 focus:bg-white focus:border-red-600'
                      : 'border-black bg-zinc-50 focus:bg-white'
                  }`}
                  id="mandatory-reporter-name-input"
                  required
                />
                {!reportDraft.userName?.trim() ? (
                  <p className="text-[11px] text-red-600 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Adding your name is mandatory. Without adding your name, you cannot make a report.</span>
                  </p>
                ) : (
                  <p className="text-[10px] text-zinc-500 font-semibold">
                    Attributed as verified citizen reporter on municipal logs.
                  </p>
                )}
              </div>

              {/* Real-Time Duplicate Detection Alert */}
              {duplicateWarning && (
                <div className="p-4 rounded-[22px] border-2 border-black bg-[#E2FF4D] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                  <div className="flex items-center gap-2 text-black font-black text-xs uppercase">
                    <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                    <span>Similar Report Found Nearby</span>
                  </div>
                  <p className="text-xs text-black font-semibold">
                    <strong>"{duplicateWarning.title}"</strong> was reported nearby with{' '}
                    <strong>{duplicateWarning.affectedCount} residents affected</strong>.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setIsReportWizardOpen(false);
                        setSelectedReportId(duplicateWarning.id);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-black uppercase tracking-wider border border-black cursor-pointer"
                    >
                      View Existing Report
                    </button>
                    <button
                      onClick={() => setDuplicateWarning(null)}
                      className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-black text-black text-xs font-black uppercase tracking-wider cursor-pointer"
                    >
                      Continue Creating
                    </button>
                  </div>
                </div>
              )}

              {/* Title Field */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-black">Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Massive pothole causing waterlogging in Block B"
                  value={reportDraft.title}
                  onChange={(e) => updateDraft({ title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-black text-xs font-bold focus:outline-none bg-zinc-50 focus:bg-white"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-black">
                  Detailed Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe details... e.g. Has been overflowing for 3 days and blocks school buses."
                  value={reportDraft.description}
                  onChange={(e) => updateDraft({ description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-black text-xs font-medium focus:outline-none bg-zinc-50 focus:bg-white resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 5: SUMMARY & AUTO-AUTHORITY ROUTING PREVIEW */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-black">
                  Review & Authorize Dispatch
                </h3>
                <p className="text-xs text-zinc-500 font-semibold">
                  Will be broadcast to the community feed and auto-routed to the municipal department.
                </p>
              </div>

              {/* Structured Preview Card */}
              <div className="p-5 rounded-[26px] border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#E2FF4D] text-black border border-black px-2.5 py-0.5 rounded-full">
                      {selectedCategory?.name}
                    </span>
                    <h4 className="text-base font-black uppercase tracking-tight text-black mt-2">
                      {reportDraft.title || `${selectedCategory?.name} issue near ${reportDraft.location?.approximateLocation}`}
                    </h4>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-black uppercase text-[#FF5C00] hover:underline cursor-pointer shrink-0"
                  >
                    Edit
                  </button>
                </div>

                {/* Evidence thumbnails */}
                {reportDraft.evidence.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {reportDraft.evidence.map((ev, i) => (
                      <img
                        key={i}
                        src={ev.url}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-18 h-18 rounded-xl object-cover border-2 border-black shrink-0"
                      />
                    ))}
                  </div>
                )}

                {/* Reporter attribution in preview */}
                <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border-2 border-black">
                  <div className="flex items-center gap-2.5 text-xs text-black font-bold">
                    <User className="w-4 h-4 text-[#FF5C00] stroke-[2.5]" />
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-black block leading-none">
                        Reporter Name (Mandatory)
                      </span>
                      <span className="text-xs font-black text-black">
                        {reportDraft.userName || (
                          <span className="text-red-600">Missing Name</span>
                        )}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(4)}
                    className="text-xs font-black uppercase text-[#FF5C00] hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 text-xs text-black font-bold">
                  <MapPin className="w-4 h-4 text-[#FF5C00] stroke-[2.5] shrink-0 mt-0.5" />
                  <div>
                    <span>{reportDraft.location?.approximateLocation || `${selectedCommunity.name}, ${selectedCommunity.city}`}</span>
                    <p className="text-[10px] text-zinc-500 font-medium">
                      {reportDraft.location?.exactAddress}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {reportDraft.description && (
                  <div className="text-xs text-zinc-700 font-medium bg-zinc-50 p-3 rounded-xl border-2 border-black">
                    "{reportDraft.description}"
                  </div>
                )}

                {/* Responsible Authority Box */}
                <div className="p-4 rounded-[22px] bg-[#E2FF4D]/30 border-2 border-black text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-black font-black uppercase tracking-tight">
                    <Building2 className="w-4 h-4 stroke-[2.5]" />
                    <span>🏛️ Auto-Determined Municipal Authority</span>
                  </div>
                  <div className="text-sm font-black uppercase tracking-tight text-black">
                    {routingInfo.authorityName}
                  </div>
                  <div className="text-[11px] text-zinc-700 font-semibold">
                    Department: {routingInfo.department} • Jurisdiction: {selectedCommunity.wardNumber}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-black font-bold pt-0.5">
                    <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Target Resolution SLA: <strong>{routingInfo.escalationHours} hours</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Navigation */}
        <div className="p-4 border-t-2 border-black bg-white flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => {
                stopCameraStream();
                setStep((step - 1) as any);
              }}
              className="px-4 py-2.5 rounded-xl border-2 border-black bg-white text-black text-xs font-black uppercase tracking-wider hover:bg-zinc-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={() => setIsReportWizardOpen(false)}
              className="px-4 py-2.5 rounded-xl text-zinc-500 text-xs font-black uppercase tracking-wider hover:text-black cursor-pointer"
            >
              Cancel
            </button>
          )}

          {step < 5 ? (
            <button
              onClick={() => {
                stopCameraStream();
                if (step === 1 && !reportDraft.categoryId) return;
                if (step === 2 && reportDraft.evidence.length === 0) {
                  simulatePhotoCapture();
                }
                if (step === 3) {
                  if (!reportDraft.location?.exactAddress) return;
                  handleGoToDetails();
                } else if (step === 4) {
                  if (!reportDraft.userName?.trim()) return;
                  setStep(5);
                } else {
                  setStep((step + 1) as any);
                }
              }}
              disabled={
                (step === 1 && !reportDraft.categoryId) ||
                (step === 3 && !reportDraft.location?.exactAddress) ||
                (step === 4 && !reportDraft.userName?.trim())
              }
              className="px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          ) : (
            <button
              onClick={handleSubmitReport}
              disabled={isSubmitting || !reportDraft.userName?.trim() || !reportDraft.location?.exactAddress}
              className="px-6 py-3 rounded-xl bg-[#FF5C00] hover:bg-[#e65300] text-white text-xs sm:text-sm font-black uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              id="wizard-submit-report-btn"
            >
              <ShieldCheck className="w-4 h-4 stroke-[3]" />
              <span>{isSubmitting ? 'Dispatching Case...' : '🚨 Broadcast & Dispatch'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
