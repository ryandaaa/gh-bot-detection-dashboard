import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  Network,
  BarChart3,
  BookOpen,
  Github,
  ExternalLink
} from 'lucide-react';

export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutGrid },
    { to: '/accounts', label: 'Accounts', icon: Users },
    { to: '/clusters', label: 'Clusters', icon: Network },
    { to: '/evaluation', label: 'Evaluation', icon: BarChart3 },
    { to: '/methodology', label: 'Methodology', icon: BookOpen },
  ];

  return (
    <>
      {/* Floating Modern Navigation Dock */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Floating Navigation Dock"
        className="fixed z-40 select-none
          /* Desktop/Tablet: Centered floating vertical dock on left */
          sm:left-4 sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto sm:translate-x-0
          /* Mobile: Centered floating horizontal dock at bottom */
          bottom-3 left-1/2 -translate-x-1/2 top-auto"
      >
        <div
          className={`bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)]
            flex transition-all duration-200 ease-out
            /* Mobile styles: rounded pill horizontal bar */
            flex-row items-center gap-1.5 p-1.5 rounded-full
            /* Desktop styles: rounded standalone card vertical dock, auto-expanding width on hover */
            sm:flex-col sm:items-stretch sm:rounded-[8px] sm:p-1.5
            ${isHovered ? 'sm:w-[172px] sm:shadow-[0_8px_30px_rgba(0,0,0,0.1)]' : 'sm:w-[50px]'}
          `}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `group relative flex items-center rounded-[6px] transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-100 text-navy-950 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-normal'
                  } sm:h-9 sm:px-2.5 h-10 px-3`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Left Active Indicator Bar (Desktop only) */}
                    {isActive && (
                      <span className="hidden sm:block absolute left-0 top-2 bottom-2 w-[3px] bg-navy-950 rounded-r-[2px]" />
                    )}

                    {/* Icon */}
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-navy-950' : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    />

                    {/* Expanding Label on Desktop Dock Hover */}
                    <span
                      className={`hidden sm:inline-block overflow-hidden whitespace-nowrap text-[13px] font-sans transition-all duration-200 ${
                        isHovered
                          ? 'max-w-[110px] opacity-100 ml-2.5'
                          : 'max-w-0 opacity-0 ml-0'
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Tooltip when dock is not hovered (quick glance) */}
                    {!isHovered && (
                      <div className="hidden sm:block absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-sans font-medium rounded-[4px] shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        {item.label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </aside>

      {/* Floating Bottom-Left GitHub Repository Link */}
      <a
        href="https://github.com/ryandaaa/gh-bot-data-detection"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-40 flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-[6px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 text-slate-600 hover:text-navy-950 transition-all select-none group"
        title="View GitHub Repository: ryandaaa/gh-bot-data-detection"
      >
        <Github className="w-3.5 h-3.5 text-slate-700 group-hover:text-navy-950 transition-colors shrink-0" />
        <span className="hidden sm:inline font-mono text-[11px] text-slate-600 group-hover:text-slate-900 transition-colors font-medium">
          ryandaaa/gh-bot-data-detection
        </span>
        <ExternalLink className="hidden sm:inline w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
      </a>
    </>
  );
}
