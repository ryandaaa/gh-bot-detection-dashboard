import React from 'react';
import { Menu, ArrowRight, User, Cpu } from 'lucide-react';

export default function Header({ onOpenSidebar, onOpenAnalyzeModal }) {
  return (
    <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-border-subtle z-40 px-4 sm:px-gutter flex items-center justify-between transition-all duration-300">
      {/* Left side */}
      <div className="flex items-center gap-space-sm">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-1.5 -ml-1 text-on-surface hover:bg-surface-hover rounded-lg flex items-center justify-center transition-colors focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-secondary hidden sm:inline-block" />
          <span className="font-code-sm text-code-sm text-secondary uppercase tracking-wider">
            Node: <span className="text-on-surface font-medium">prod-primary-alpha</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-space-md">
        <button
          onClick={onOpenAnalyzeModal}
          className="inline-flex items-center gap-space-xs bg-primary text-on-primary hover:bg-primary-container px-3.5 py-1.5 rounded-lg font-label-md text-label-md transition-all shadow-sm hover:shadow active:scale-95"
          type="button"
        >
          <span>Analyze an account</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-border-subtle hidden sm:block"></div>

        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-on-primary shadow-xs">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
