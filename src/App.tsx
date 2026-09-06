import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/navigation/Navbar';
import { Sidebar } from './components/navigation/Sidebar';
import { BottomNavigation } from './components/navigation/BottomNavigation';
import { HomeScreen } from './screens/HomeScreen';
import { CommunityScreen } from './screens/CommunityScreen';
import { MapScreen } from './screens/MapScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AuthorityDashboardScreen } from './screens/AuthorityDashboardScreen';
import { AdminScreen } from './screens/AdminScreen';
import { ReportCreationWizard } from './components/reports/ReportCreationWizard';
import { ReportDetailModal } from './components/reports/ReportDetailModal';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-rose-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic Screen View & Responsive Footer Column */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-3 sm:p-6 md:p-8 min-w-0">
            {activeTab === 'home' && <HomeScreen />}
            {activeTab === 'community' && <CommunityScreen />}
            {activeTab === 'map' && <MapScreen />}
            {activeTab === 'reports' && <ReportsScreen />}
            {activeTab === 'profile' && <ProfileScreen />}
            {activeTab === 'authority' && <AuthorityDashboardScreen />}
            {activeTab === 'admin' && <AdminScreen />}
          </main>

          {/* Scoped Responsive Footer */}
          <Footer />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />

      {/* Global Modals */}
      <ReportCreationWizard />
      <ReportDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
