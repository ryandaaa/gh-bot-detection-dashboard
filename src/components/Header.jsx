import React from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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
    <header
      className="fixed top-3 left-3 right-3 sm:left-4 sm:right-4 h-12 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-[6px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] z-30 px-3.5 sm:px-5 flex items-center justify-between transition-all duration-200 select-none"
    >
      {/* Left side: Clean Minimalist Breadcrumb (No Monogram) */}
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
  );
}
