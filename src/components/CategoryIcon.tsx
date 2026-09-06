import React from 'react';
import {
  Trash2,
  Droplets,
  Milestone,
  Waves,
  Lightbulb,
  Zap,
  Compass,
  Trees,
  DoorClosed,
  HardHat,
  PawPrint,
  Bus,
  Stethoscope,
  Volume2,
  AlertCircle,
  LucideIcon
} from 'lucide-react';

interface CategoryIconProps {
  iconName: string;
  className?: string;
  size?: number;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Trash2,
  Droplets,
  Milestone,
  Waves,
  Lightbulb,
  Zap,
  Compass,
  Trees,
  DoorClosed,
  HardHat,
  PawPrint,
  Bus,
  Stethoscope,
  Volume2,
  AlertCircle
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName, className = 'w-5 h-5', size }) => {
  const IconComponent = ICON_MAP[iconName] || AlertCircle;
  return <IconComponent className={className} size={size} />;
};

export const getCategoryColor = (categoryId: string) => {
  switch (categoryId) {
    case 'waste':
      return { bg: 'bg-[#E2FF4D] text-black border-2 border-black', badge: 'bg-[#E2FF4D]', marker: '#E2FF4D' };
    case 'water':
      return { bg: 'bg-sky-200 text-black border-2 border-black', badge: 'bg-sky-400', marker: '#38bdf8' };
    case 'road':
      return { bg: 'bg-[#FF5C00] text-white border-2 border-black', badge: 'bg-[#FF5C00]', marker: '#FF5C00' };
    case 'drainage':
      return { bg: 'bg-blue-200 text-black border-2 border-black', badge: 'bg-blue-400', marker: '#60a5fa' };
    case 'street_light':
      return { bg: 'bg-yellow-200 text-black border-2 border-black', badge: 'bg-yellow-400', marker: '#facc15' };
    case 'electricity':
      return { bg: 'bg-rose-200 text-black border-2 border-black', badge: 'bg-rose-500', marker: '#f43f5e' };
    case 'traffic':
      return { bg: 'bg-purple-200 text-black border-2 border-black', badge: 'bg-purple-400', marker: '#c084fc' };
    case 'park':
      return { bg: 'bg-emerald-200 text-black border-2 border-black', badge: 'bg-emerald-400', marker: '#34d399' };
    case 'animal':
      return { bg: 'bg-teal-200 text-black border-2 border-black', badge: 'bg-teal-400', marker: '#2dd4bf' };
    case 'health':
      return { bg: 'bg-red-200 text-black border-2 border-black', badge: 'bg-red-500', marker: '#ef4444' };
    default:
      return { bg: 'bg-zinc-100 text-black border-2 border-black', badge: 'bg-black', marker: '#000000' };
  }
};

export const getStatusConfig = (status: string) => {
  switch (status) {
    case 'SUBMITTED':
      return {
        label: 'Submitted',
        color: 'text-black bg-[#E2FF4D] border-2 border-black font-black',
        dot: 'bg-black',
        hex: '#E2FF4D',
        step: 1
      };
    case 'SENT_TO_AUTHORITY':
      return {
        label: 'Sent to Authority',
        color: 'text-white bg-black border-2 border-black font-black',
        dot: 'bg-white',
        hex: '#000000',
        step: 2
      };
    case 'ASSIGNED':
      return {
        label: 'Assigned',
        color: 'text-black bg-zinc-200 border-2 border-black font-black',
        dot: 'bg-black',
        hex: '#e4e4e7',
        step: 3
      };
    case 'IN_PROGRESS':
      return {
        label: 'In Progress',
        color: 'text-white bg-[#FF5C00] border-2 border-black font-black',
        dot: 'bg-white animate-pulse',
        hex: '#FF5C00',
        step: 4
      };
    case 'RESOLVED':
      return {
        label: 'Resolved',
        color: 'text-black bg-[#4ade80] border-2 border-black font-black',
        dot: 'bg-black',
        hex: '#4ade80',
        step: 5
      };
    default:
      return {
        label: status,
        color: 'text-black bg-zinc-100 border-2 border-black font-black',
        dot: 'bg-black',
        hex: '#71717a',
        step: 1
      };
  }
};
