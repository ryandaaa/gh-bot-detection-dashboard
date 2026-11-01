import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AccountInspectorPane from './components/AccountInspectorPane';
import Overview from './pages/Overview';
import AccountExplorer from './pages/AccountExplorer';
import Clusters from './pages/Clusters';
import Evaluation from './pages/Evaluation';
import Methodology from './pages/Methodology';

/**
 * Reading Scroll Progress Bar
 * Tracks vertical scroll percentage down the document in real time.
 */
function ReadingProgressBar() {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) {
        setScrollPercent(0);
        return;
      }
      const current = window.scrollY;
      setScrollPercent(Math.min(100, Math.max(0, (current / totalScroll) * 100)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-slate-200/40">
      <div
        className="h-full bg-navy-950 shadow-[0_0_8px_rgba(10,25,47,0.5)] transition-[width] duration-75 ease-out"
        style={{ width: `${scrollPercent}%` }}
      />
    </div>
  );
}

/**
 * Top Route Loader Bar
 * Fires on navigation route change.
 */
function RouteProgressBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(30);
    const t1 = setTimeout(() => setProgress(75), 90);
    const t2 = setTimeout(() => setProgress(100), 220);
    const t3 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 380);

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

/**
 * Floating Scroll-to-Top Button
 * Appears when user scrolls past 240px.
 */
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 240);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top of page"
      className={`fixed bottom-4 right-4 z-40 w-9 h-9 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-[6px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-md hover:border-slate-300 text-slate-500 hover:text-navy-950 flex items-center justify-center transition-all duration-200 ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
      title="Scroll to top"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}

export default function App() {
  const location = useLocation();
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
      {/* Real-Time Reading Scroll Progress Bar */}
      <ReadingProgressBar />

      {/* Route Change Progress Indicator */}
      <RouteProgressBar />

      {/* Floating Centered Modern Navigation Dock (Enlarged & Breathable) */}
      <Sidebar />

      {/* Floating Scroll to Top Action Button */}
      <ScrollToTopButton />

      {/* Main Content Layout Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-200">
        {/* Floating Top Navbar Card (Matches Content Max-Width) */}
        <Header onOpenAnalyzeModal={() => openInspector(null)} />

        {/* Dynamic Route Content with Page Transition Animation */}
        <main className="pt-20 sm:pl-[86px] pr-3 sm:pr-4 pb-20 sm:pb-12 flex-1 w-full bg-slate-50 min-h-screen">
          <div key={location.pathname} className="page-transition">
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
          </div>
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
