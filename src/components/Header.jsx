import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, Github, ExternalLink } from 'lucide-react';

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
      className="fixed top-3 left-3 sm:left-4 z-40 w-12 sm:w-[58px] h-12 flex items-center justify-center select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href="https://github.com/ryandaaa/gh-bot-data-detection"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub Repository ryandaaa/gh-bot-data-detection"
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-navy-950 border border-navy-800 shadow-[0_2px_12px_rgba(10,25,47,0.22)] hover:shadow-[0_4px_18px_rgba(10,25,47,0.35)] hover:bg-navy-900 text-white flex items-center justify-center transition-all group"
        title="View GitHub Repository: ryandaaa/gh-bot-data-detection"
      >
        <Github className="w-5 h-5 text-white group-hover:scale-105 transition-transform" />
      </a>

      {/* Rich Metadata Info Card on Hover */}
      {isOpen && (
        <div className="absolute top-full left-0 sm:left-1 mt-2.5 w-[290px] bg-white border border-slate-200/90 rounded-[6px] shadow-xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans pointer-events-auto">
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
            <div className="min-w-0">
              <div className="font-semibold text-[12px] text-slate-900 truncate">
                ryandaaa/gh-bot-data-detection
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Big Data Bot Analytics · PBL Universitas Riau
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
              <span className="text-slate-400">ML Pipeline</span>
              <span className="font-medium text-slate-800">Isolation Forest + K-Means</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Supervisor</span>
              <span className="font-medium text-slate-800">Assoc. Prof. Dr. Rahmad K.</span>
            </div>
          </div>

          <a
            href="https://github.com/ryandaaa/gh-bot-data-detection"
            target="_blank"
            rel="noopener noreferrer"
            className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-navy-800 hover:text-navy-950 transition-colors"
          >
            <span>Open repository on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      )}
    </div>
  );
}

export default function Header({ onOpenAnalyzeModal }) {
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

      {/* Floating Navbar Container - Matches Page Content max-w-[1400px] */}
      <div className="fixed top-3 left-0 right-0 z-30 pointer-events-none px-3 sm:px-4 sm:pl-[86px] sm:pr-4">
        <header className="max-w-[1400px] mx-auto h-12 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-[6px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] px-3.5 sm:px-5 flex items-center justify-between pointer-events-auto transition-all select-none">
          {/* Left side: Clean Breadcrumb */}
          <div className="flex items-center gap-2 text-[13px] font-sans">
            <span className="text-slate-900 font-bold tracking-tight">GH Intelligence</span>
            <span className="text-slate-300 font-light">/</span>
            <span className="text-slate-600 font-medium tracking-tight">{pageTitle}</span>
          </div>

          {/* Right side: Dataset Meta Info + Action Button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Subtle Dataset info (pure typography, no colored dots) */}
            <div className="hidden md:flex items-center px-2.5 py-1 rounded-[4px] bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 font-sans font-medium">
              GH Archive · 152h · 9.88M Events
            </div>

            {/* Action Button */}
            <button
              onClick={onOpenAnalyzeModal}
              className="inline-flex items-center gap-1.5 bg-navy-950 hover:bg-navy-900 text-white font-sans text-[12px] font-medium px-3.5 py-1.5 rounded-[4px] transition-colors border border-navy-800 shadow-2xs"
              type="button"
            >
              <span>Analyze Account</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            </button>
          </div>
        </header>
      </div>
    </>
  );
}
