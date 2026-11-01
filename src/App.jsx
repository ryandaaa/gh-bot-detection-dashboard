import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AccountInspectorPane from './components/AccountInspectorPane';
import Overview from './pages/Overview';
import AccountExplorer from './pages/AccountExplorer';
import Clusters from './pages/Clusters';
import Evaluation from './pages/Evaluation';
import Methodology from './pages/Methodology';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const openInspector = (account = null) => {
    setSelectedAccount(account);
    setIsInspectorOpen(true);
  };

  const closeInspector = () => {
    setIsInspectorOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Sidebar (Desktop fixed 240px + Mobile drawer) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Layout Wrapper */}
      <div className="pl-0 lg:pl-[240px] flex-1 flex flex-col min-w-0 transition-all duration-200">
        {/* Header (Fixed 56px height) */}
        <Header
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenAnalyzeModal={() => openInspector(null)}
        />

        {/* Dynamic Route Content - Edge-to-Edge Full Bleed */}
        <main className="pt-14 flex-1 w-full bg-slate-50 min-h-screen">
          <Routes>
            <Route
              path="/"
              element={<Overview onOpenAnalyzeModal={() => openInspector(null)} />}
            />
            <Route
              path="/accounts"
              element={<AccountExplorer onOpenAnalyzeModal={(acc) => openInspector(acc)} />}
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

      {/* Split-Screen Side Inspector Pane */}
      <AccountInspectorPane
        isOpen={isInspectorOpen}
        onClose={closeInspector}
        selectedAccount={selectedAccount}
      />
    </div>
  );
}
