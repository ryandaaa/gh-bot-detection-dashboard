import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AnalyzeModal from './components/AnalyzeModal';
import Overview from './pages/Overview';
import AccountExplorer from './pages/AccountExplorer';
import Clusters from './pages/Clusters';
import Evaluation from './pages/Evaluation';
import Methodology from './pages/Methodology';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);

  const openAnalyzeModal = () => setIsAnalyzeModalOpen(true);
  const closeAnalyzeModal = () => setIsAnalyzeModalOpen(false);

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      {/* Sidebar (Desktop fixed + Mobile slide-in drawer) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Layout Wrapper */}
      <div className="pl-0 lg:pl-[260px] flex-1 flex flex-col transition-all duration-300">
        {/* Header */}
        <Header
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenAnalyzeModal={openAnalyzeModal}
        />

        {/* Dynamic Route Content */}
        <main className="relative pt-16 min-h-screen bg-surface">
          <Routes>
            <Route
              path="/"
              element={<Overview onOpenAnalyzeModal={openAnalyzeModal} />}
            />
            <Route
              path="/accounts"
              element={<AccountExplorer onOpenAnalyzeModal={openAnalyzeModal} />}
            />
            <Route
              path="/clusters"
              element={<Clusters />}
            />
            <Route
              path="/evaluation"
              element={<Evaluation />}
            />
            <Route
              path="/methodology"
              element={<Methodology />}
            />
            {/* Fallback to overview */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Interactive Inference Modal */}
      <AnalyzeModal
        isOpen={isAnalyzeModalOpen}
        onClose={closeAnalyzeModal}
      />
    </div>
  );
}
