import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  Network,
  BarChart3,
  BookOpen,
  X,
  Database
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutGrid },
    { to: '/accounts', label: 'Accounts', icon: Users },
    { to: '/clusters', label: 'Clusters', icon: Network },
    { to: '/evaluation', label: 'Evaluation', icon: BarChart3 },
    { to: '/methodology', label: 'Methodology', icon: BookOpen },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-navy-950/40 z-40 backdrop-blur-xs transition-opacity duration-200 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-0 h-full w-[240px] bg-white border-r border-slate-200 z-50 flex flex-col justify-between select-none transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Header - Pure Typography, No decorative icon */}
          <div className="h-14 px-5 flex items-center justify-between border-b border-slate-200 bg-white">
            <div className="flex flex-col">
              <span className="font-sans text-[13px] font-bold text-navy-950 tracking-wider uppercase">
                GH Intelligence
              </span>
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest -mt-0.5">
                v1.4.2 · Bot Analytics
              </span>
            </div>
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-slate-500 hover:text-navy-950 hover:bg-slate-100 rounded-[4px] transition-colors focus:outline-none"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-0.5 p-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 text-[13px] rounded-[4px] transition-colors ${
                      isActive
                        ? 'bg-slate-100 text-navy-950 font-medium'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Dataset Info Footer - Minimal, Pure Text Status, No Status Dot */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium text-navy-950 uppercase tracking-wider">
              GH Archive
            </span>
            <span className="font-mono text-[10px] font-medium text-navy-700 bg-navy-50 border border-navy-200/60 px-1.5 py-0.5 rounded-[4px]">
              ACTIVE
            </span>
          </div>
          <div className="font-mono text-[11px] text-slate-500 mt-1">
            152h · 2 Blocks · 9.88M Events
          </div>
        </div>
      </aside>
    </>
  );
}
