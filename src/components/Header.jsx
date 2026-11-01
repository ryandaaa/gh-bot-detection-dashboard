import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, ArrowRight } from 'lucide-react';

export default function Header({ onOpenSidebar, onOpenAnalyzeModal }) {
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
    <header className="fixed top-0 left-0 lg:left-[240px] right-0 h-14 bg-white border-b border-slate-200 z-40 px-5 sm:px-6 flex items-center justify-between transition-all duration-200 select-none">
      {/* Left side: Mobile menu toggle + Clean Minimalist Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-1.5 -ml-1 text-slate-600 hover:text-navy-950 hover:bg-slate-100 rounded transition-colors focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Minimalist Clean Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] font-sans">
          <span className="text-slate-400 font-medium tracking-tight">GH Intelligence</span>
          <span className="text-slate-300 font-light">/</span>
          <span className="text-navy-950 font-semibold tracking-tight">{pageTitle}</span>
        </div>
      </div>

      {/* Right side: Action Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenAnalyzeModal}
          className="inline-flex items-center gap-1.5 bg-navy-950 hover:bg-navy-900 text-white font-sans text-[12px] font-medium px-3.5 py-1.5 rounded transition-colors border border-navy-800"
          type="button"
        >
          <span>Analyze Account</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
        </button>
      </div>
    </header>
  );
}
