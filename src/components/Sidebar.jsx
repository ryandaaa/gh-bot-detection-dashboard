import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  Network,
  BarChart3,
  BookOpen,
  ChevronLeft,
  Search,
  X,
  Menu
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
          {isMinimized ? (
            /* Minimized Mode: Centered clean hamburger button to expand */
            <div className="flex items-center justify-center h-9">
              <button
                type="button"
                onClick={onToggleMinimize}
                className="w-10 h-10 flex items-center justify-center rounded-[4px] text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <Menu className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          ) : (
            /* Expanded Mode: Hamburger + GH Intelligence brand + Collapse toggle */
            <div className="flex items-center justify-between h-9">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={onToggleMinimize}
                  className="w-8 h-8 flex items-center justify-center rounded-[4px] text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors shrink-0"
                  title="Minimize sidebar"
                  aria-label="Minimize sidebar"
                >
                  <Menu className="w-4 h-4 text-slate-700" />
                </button>
                <span className="font-sans text-[13px] font-bold text-slate-900 tracking-tight truncate select-none">
                  GH Intelligence
                </span>
              </div>

              {/* Desktop Chevron Minimize Toggle */}
              <button
                onClick={onToggleMinimize}
                className="hidden lg:flex w-7 h-7 items-center justify-center rounded-[4px] text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0"
                title="Minimize sidebar"
                aria-label="Minimize sidebar"
                type="button"
              >
                <ChevronLeft className="w-4 h-4" />
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
          )}

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

        {/* MIDDLE SECTION: VERTICALLY CENTERED NAVIGATION ITEMS */}
        <div
          className={`my-auto py-4 flex flex-col justify-center px-2.5 gap-1.5 ${
            isMinimized ? 'overflow-visible' : 'overflow-y-auto overflow-x-hidden'
          }`}
        >
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
                    {/* Active Left Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-navy-950 rounded-r-[2px]" />
                    )}

                    <Icon
                      className={`shrink-0 transition-colors w-4 h-4 ${
                        isActive ? 'text-navy-950' : 'text-slate-400 group-hover:text-slate-700'
                      }`}
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

        {/* Footer deleted as requested */}
      </aside>
    </>
  );
}
