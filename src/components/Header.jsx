import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, Github, ExternalLink, Sun, Moon } from 'lucide-react';

/**
 * Standalone Floating GitHub Brand Card (Top-Left)
 * Aligned exactly with the sidebar dock along the X-axis (left-4, w-[58px]).
 */
function StandaloneGitHubBrand() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 180);
  };

  return (
    <div
      className="hidden sm:flex fixed top-3 left-4 z-40 sm:w-[58px] h-12 items-center justify-center select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href="https://github.com/ryandaaa/gh-bot-detection-dashboard"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub Repository ryandaaa/gh-bot-detection-dashboard"
        className="w-8 h-8 rounded-full bg-navy-950 dark:bg-[#101010] border border-navy-800 dark:border-[#262626] shadow-[0_2px_10px_rgba(10,25,47,0.18)] dark:shadow-none hover:shadow-[0_4px_14px_rgba(10,25,47,0.3)] hover:bg-navy-900 dark:hover:border-[#3f3f46] text-white flex items-center justify-center transition-all group shrink-0 outline-none focus:outline-none focus-visible:outline-none"
        title="View GitHub Repository: ryandaaa/gh-bot-detection-dashboard"
      >
        <Github className="w-4 h-4 text-white dark:text-[#f5f5f5] group-hover:scale-105 transition-transform" />
      </a>

      {/* Rich Metadata Info Card on Hover */}
      {isOpen && (
        <div className="absolute top-full left-0 sm:left-1 mt-2 w-[300px] bg-white dark:bg-[#101010] border border-slate-200/90 dark:border-[#262626] rounded-[6px] shadow-xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans pointer-events-auto">
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
            <div className="min-w-0">
              <div className="font-semibold text-[12px] text-slate-900 truncate">
                ryandaaa/gh-bot-detection-dashboard
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Analitika Bot Big Data · PBL Universitas Riau
              </div>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-[3px] shrink-0 font-mono">
              v1.0
            </span>
          </div>

          <div className="py-2.5 space-y-1.5 text-[11px] text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Dataset</span>
              <span className="font-medium text-slate-800">GH Archive (9.88M Events)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Database</span>
              <span className="font-medium text-slate-800">MongoDB Atlas M10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pipeline ML</span>
              <span className="font-medium text-slate-800">Isolation Forest + K-Means</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pembimbing</span>
              <span className="font-medium text-slate-800">Assoc. Prof. Dr. Rahmad K.</span>
            </div>
          </div>

          <a
            href="https://github.com/ryandaaa/gh-bot-detection-dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-navy-800 hover:text-navy-950 transition-colors"
          >
            <span>Buka repositori di GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      )}
    </div>
  );
}

export default function Header({ onOpenAnalyzeModal, theme = 'dark', onToggleTheme }) {
  const location = useLocation();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Overview';
      case '/accounts':
        return 'Accounts';
      case '/clusters':
        return 'Clusters';
      case '/evaluation':
        return 'Evaluation';
      case '/methodology':
        return 'Methodology';
      default:
        return 'Overview';
    }
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <>
      {/* Standalone GitHub Brand Card (Top-Left, exactly on sumbu X of sidebar) */}
      <StandaloneGitHubBrand />

      {/* Floating Navbar Container - Matches Page Content max-w-[1400px] with responsive mobile padding */}
      <div className="fixed top-2.5 sm:top-3 left-0 right-0 z-30 pointer-events-none px-3 sm:pl-[86px] sm:pr-4">
        <div className="max-w-[1400px] mx-auto sm:px-6 lg:px-8">
          <header className="w-full h-11 sm:h-12 bg-white/95 dark:bg-[#101010] backdrop-blur-md border border-slate-200/90 dark:border-[#262626] rounded-[6px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] px-3 sm:px-5 flex items-center justify-between pointer-events-auto transition-all select-none">
            {/* Left side: Clean Breadcrumb */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] font-sans min-w-0">
              <span className="text-slate-900 dark:text-[#f5f5f5] font-bold tracking-tight shrink-0">GH Intelligence</span>
              <span className="text-slate-300 dark:text-[#333333] font-light">/</span>
              <span className="text-slate-600 dark:text-[#a1a1a1] font-medium tracking-tight truncate">{pageTitle}</span>
            </div>

            {/* Right side: Borderless Theme Toggle + Action Button */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Cloudflare Dark Mode Toggle (Clean Borderless Icon) */}
              {onToggleTheme && (
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-[#a1a1a1] dark:hover:text-white rounded-[4px] transition-colors outline-none focus:outline-none focus-visible:outline-none"
                  title={theme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke Cloudflare dark mode'}
                  aria-label="Toggle Color Theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-slate-100" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-600" />
                  )}
                </button>
              )}

              {/* Action Button */}
              <button
                onClick={onOpenAnalyzeModal}
                className="inline-flex items-center gap-1 sm:gap-1.5 bg-navy-950 hover:bg-navy-900 text-white font-sans text-[11px] sm:text-[12px] font-medium px-2.5 sm:px-3.5 py-1.5 rounded-[4px] transition-colors border border-navy-800 shadow-2xs outline-none focus:outline-none focus-visible:outline-none shrink-0"
                type="button"
              >
                <span>Analyze</span>
                <span className="hidden sm:inline">Account</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-300" />
              </button>
            </div>
          </header>
        </div>
      </div>
    </>
  );
}
