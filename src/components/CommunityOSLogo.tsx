import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'image';
  showBadge?: boolean;
}

export const CommunityOSLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showBadge = false
}) => {
  // Dimensions mapping
  const sizeMap = {
    xs: { icon: 24, text: 'text-sm' },
    sm: { icon: 32, text: 'text-base' },
    md: { icon: 40, text: 'text-lg' },
    lg: { icon: 52, text: 'text-xl' },
    xl: { icon: 72, text: 'text-2xl' }
  };

  const { icon: iconSize, text: textSize } = sizeMap[size] || sizeMap.md;

  if (variant === 'image') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <img
          src="/logo.png"
          alt="community_OS logo"
          className="rounded-xl object-contain border border-black/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white p-0.5"
          style={{ width: iconSize, height: iconSize }}
          referrerPolicy="no-referrer"
        />
        {size !== 'xs' && (
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`font-black tracking-tight text-slate-900 ${textSize} leading-none`}>
                community<span className="text-[#2563EB]">_OS</span>
              </span>
              {showBadge && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-[#E2FF4D] text-black border border-black shrink-0">
                  v2.4
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold tracking-widest uppercase text-zinc-500 mt-1">
              Civic Action & Command
            </span>
          </div>
        )}
      </div>
    );
  }

  // Pure SVG Representation matching uploaded branding
  const svgIcon = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
    >
      <defs>
        {/* Blue gradient for 'C' */}
        <linearGradient id="cBlueGrad" x1="20" y1="20" x2="80" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="45%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        {/* Green for left person */}
        <linearGradient id="greenPerson" x1="15" y1="10" x2="35" y2="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Purple for right person */}
        <linearGradient id="purplePerson" x1="65" y1="10" x2="85" y2="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>

        {/* Center blue person */}
        <linearGradient id="blueCenterPerson" x1="40" y1="5" x2="60" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        {/* Location pin gradient */}
        <linearGradient id="pinGrad" x1="40" y1="36" x2="60" y2="68" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Top 3 Stylized People (Left Green, Center Blue, Right Purple) */}
      {/* Left Person (Green) */}
      <circle cx="28" cy="18" r="6" fill="url(#greenPerson)" />
      <path
        d="M20 32C20 27 24 25 28 25C32 25 36 27 36 32"
        stroke="url(#greenPerson)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Right Person (Purple) */}
      <circle cx="72" cy="18" r="6" fill="url(#purplePerson)" />
      <path
        d="M64 32C64 27 68 25 72 25C76 25 80 27 80 32"
        stroke="url(#purplePerson)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Center Person (Blue - Elevated Arch) */}
      <circle cx="50" cy="12" r="7.5" fill="url(#blueCenterPerson)" />
      <path
        d="M40 28C40 22 45 20 50 20C55 20 60 22 60 28"
        stroke="url(#blueCenterPerson)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Main Bold 'C' Wrapping Around */}
      <path
        d="M68 35C62.5 29 55 27 46 29C32 32 22 44 22 58C22 74 34 85 49 85C63 85 73 76 76 68"
        stroke="url(#cBlueGrad)"
        strokeWidth="13"
        strokeLinecap="round"
      />

      {/* Location Pin Shadow */}
      <ellipse cx="50" cy="74" rx="6" ry="1.5" fill="#10B981" opacity="0.3" />

      {/* Location Pin in Center of C */}
      <path
        d="M50 40C44.5 40 40 44.5 40 50C40 57 50 71 50 71C50 71 60 57 60 50C60 44.5 55.5 40 50 40Z"
        fill="url(#pinGrad)"
      />
      {/* Pin Inner Hole */}
      <circle cx="50" cy="49" r="3.5" fill="#FFFFFF" />
    </svg>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center ${className}`}>{svgIcon}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Visual Badge with logo image / SVG */}
      <div className="relative rounded-2xl bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center">
        {svgIcon}
      </div>

      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-slate-900 ${textSize}`}>
            community<span className="text-[#2563EB]">_OS</span>
          </span>
          {showBadge && (
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase bg-[#E2FF4D] text-black border border-black">
              v2.4
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden sm:block">
          Civic Action & Authority Command
        </span>
      </div>
    </div>
  );
};
