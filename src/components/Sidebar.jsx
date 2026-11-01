import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  Network,
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Database
} from 'lucide-react';

export default function Sidebar({
  isOpen,
  onClose,
  isMinimized,
  onToggleMinimize
}) {
  const [quickFilter, setQuickFilter] = useState('');

  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutGrid },
    { to: '/accounts', label: 'Accounts', icon: Users },
    { to: '/clusters', label: 'Clusters', icon: Network },
    { to: '/evaluation', label: 'Evaluation', icon: BarChart3 },
    { to: '/methodology', label: 'Methodology', icon: BookOpen },
  ];

  const filteredNavItems = quickFilter.trim()
    ? navItems.filter((i) => i.label.toLowerCase().includes(quickFilter.toLowerCase()))
    : navItems;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-950/40 z-40 backdrop-blur-xs transition-opacity duration-200 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Modern Sidebar (Desktop Floating Card + Mobile Drawer) */}
      <aside
        className={`fixed z-30 select-none bg-white border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-300 ease-in-out ${
          /* Desktop Floating Card Position */
          'lg:left-3 lg:top-3 lg:bottom-3 lg:rounded-[8px]'
        } ${
          /* Desktop Width (Minimized vs Expanded) */
          isMinimized ? 'lg:w-[64px]' : 'lg:w-[220px]'
        } ${
          /* Mobile Drawer Mode */
          isOpen
            ? 'left-0 top-0 bottom-0 w-[260px] translate-x-0 !z-50 rounded-none border-r'
            : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Application Sidebar"
      >
        {/* TOP BRAND & MINIMIZE TOGGLE */}
        <div className="p-3 border-b border-slate-100 flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between h-9">
            {/* Brand Title (fades when minimized) */}
            <div
              className={`flex items-center gap-2 overflow-hidden transition-all duration-200 ${
                isMinimized ? 'w-0 opacity-0 pointer-events-none' : 'w-auto opacity-100'
              }`}
            >
              <div className="w-6 h-6 rounded-[4px] bg-navy-950 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                GH
              </div>
              <span className="font-sans text-[13px] font-bold text-slate-900 tracking-tight truncate">
                GH Intelligence
              </span>
            </div>

            {/* Minimized Monogram icon when collapsed */}
            {isMinimized && (
              <div className="w-8 h-8 mx-auto rounded-[4px] bg-navy-950 text-white flex items-center justify-center font-bold text-[12px] shrink-0">
                GH
              </div>
            )}

            {/* Desktop Minimize Toggle Button (< or >) */}
            <button
              onClick={onToggleMinimize}
              className={`hidden lg:flex w-7 h-7 items-center justify-center rounded-[4px] text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors ${
                isMinimized ? 'mx-auto mt-2' : ''
              }`}
              title={isMinimized ? 'Expand sidebar' : 'Minimize sidebar'}
              aria-label={isMinimized ? 'Expand sidebar' : 'Minimize sidebar'}
              type="button"
            >
              {isMinimized ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-800 rounded-[4px]"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Search Input (Only when expanded) */}
          {!isMinimized && (
            <div className="relative flex items-center mt-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                value={quickFilter}
                onChange={(e) => setQuickFilter(e.target.value)}
                placeholder="search..."
                className="w-full bg-slate-50 border border-slate-200/80 text-[12px] text-slate-800 placeholder:text-slate-400 pl-8 pr-2 py-1.5 rounded-[4px] outline-none focus:border-navy-900 focus:bg-white transition-colors"
              />
              {quickFilter && (
                <button
                  type="button"
                  onClick={() => setQuickFilter('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* MIDDLE SECTION: VERTICALLY CENTERED NAVIGATION ITEMS ("ditengah gitu dia elemennya") */}
        <div className="my-auto py-4 flex flex-col justify-center px-2.5 gap-1.5 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `group relative flex items-center rounded-[4px] transition-all duration-150 ${
                    isMinimized
                      ? 'justify-center w-10 h-10 mx-auto'
                      : 'gap-3 px-3 py-2 text-[13px]'
                  } ${
                    isActive
                      ? 'bg-slate-100 text-navy-950 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-normal'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Left Indicator Bar (like ryanda.space active indicator) */}
                    {isActive && (
                      <span
                        className={`absolute left-0 top-2 bottom-2 w-[3px] bg-navy-950 rounded-r-[2px] ${
                          isMinimized ? 'left-[-3px]' : ''
                        }`}
                      />
                    )}

                    <Icon
                      className={`shrink-0 transition-colors ${
                        isMinimized ? 'w-4 h-4' : 'w-4 h-4'
                      } ${isActive ? 'text-navy-950' : 'text-slate-400 group-hover:text-slate-700'}`}
                    />

                    {/* Nav Label (when expanded) */}
                    {!isMinimized && (
                      <span className="truncate">{item.label}</span>
                    )}

                    {/* High-Tech Floating Tooltip (when minimized) */}
                    {isMinimized && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-sans font-medium rounded-[4px] shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        {item.label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* BOTTOM SECTION: MINIMAL STATUS FOOTER */}
        <div className="p-3 border-t border-slate-100 shrink-0">
          {!isMinimized ? (
            <div className="flex flex-col gap-1 text-[11px] text-slate-500">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">GH Archive</span>
                <span className="text-[10px] text-navy-800 bg-navy-50 border border-navy-200/80 px-1.5 py-0.2 rounded-[3px] font-medium">
                  Active
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                152h · 9.88M Events
              </span>
            </div>
          ) : (
            <div className="flex justify-center" title="GH Archive: 152h · Active">
              <Database className="w-4 h-4 text-slate-400 hover:text-navy-900 transition-colors" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
