import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AccountInspectorPane from './components/AccountInspectorPane';
import Overview from './pages/Overview';
import AccountExplorer from './pages/AccountExplorer';
import Clusters from './pages/Clusters';
import Evaluation from './pages/Evaluation';
import Methodology from './pages/Methodology';

/**
 * Top Progress Bar (Page Route Loader)
 * A thin 2px high-tech navy/blue bar indicating instant page navigation.
 */
function TopProgressBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(30);
    const t1 = setTimeout(() => setProgress(75), 100);
    const t2 = setTimeout(() => setProgress(100), 240);
    const t3 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [location.pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-[2px] overflow-hidden">
      <div
        className="h-full bg-navy-600 shadow-[0_0_8px_rgba(37,99,235,0.7)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}

export default function App() {
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
      {/* Top Route Progress Bar */}
      <TopProgressBar />

      {/* Floating Centered Modern Navigation Dock (Stand-alone Card with Smooth Hover Expansion) */}
      <Sidebar />

      {/* Main Content Layout Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-200">
        {/* Floating Top Navbar Card */}
        <Header onOpenAnalyzeModal={() => openInspector(null)} />

        {/* Dynamic Route Content */}
        <main className="pt-20 sm:pl-[72px] pr-3 sm:pr-4 pb-20 sm:pb-12 flex-1 w-full bg-slate-50 min-h-screen">
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
