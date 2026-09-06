import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Users
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsRead, setSelectedReportId } = useApp();

  if (!isOpen) return null;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'SUBMISSION':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'AUTHORITY':
        return <ShieldCheck className="w-4 h-4 text-indigo-500" />;
      case 'PROGRESS':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'RESOLUTION':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'COMMUNITY':
        return <Users className="w-4 h-4 text-rose-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Notifications</h2>
                <p className="text-xs text-slate-500">Live civic updates & authority progress</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                Mark all read
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-700">You're all caught up</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Updates on reports you follow or created will appear here.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationAsRead(n.id);
                    if (n.reportId) {
                      setSelectedReportId(n.reportId);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                    !n.read
                      ? 'bg-rose-50/40 border-rose-200/70 hover:bg-rose-50/70'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5 shadow-2xs">
                      {getNotifIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{n.title}</h4>
                        <span className="text-[10px] text-slate-600 shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{n.message}</p>
                      {n.reportId && (
                        <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                          <span>View Case {n.reportId}</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
