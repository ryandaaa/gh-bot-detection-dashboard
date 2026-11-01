import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  Network,
  BarChart3,
  BookOpen
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
    /* Floating Modern Navigation Dock - Enlarged & Breathable */
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
        className={`bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_6px_28px_rgba(0,0,0,0.06)]
          flex transition-all duration-200 ease-out
          /* Mobile styles: rounded pill horizontal bar */
          flex-row items-center gap-2 p-1.5 rounded-full
          /* Desktop styles: enlarged rounded standalone card, generous breathing room */
          sm:flex-col sm:items-stretch sm:rounded-[8px] sm:p-2 sm:gap-2
          ${isHovered ? 'sm:w-[188px] sm:shadow-[0_10px_36px_rgba(0,0,0,0.1)]' : 'sm:w-[58px]'}
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
                `group relative flex items-center rounded-[6px] transition-all duration-150 outline-none focus:outline-none focus-visible:outline-none ${
                  isActive
                    ? 'bg-slate-100 text-navy-950 font-semibold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-normal'
                } sm:h-10 sm:px-3 h-10 px-3`
              }
            >
              {({ isActive }) => (
                <>
                  {/* NO SIDELINE BAR - Pure background highlight */}

                  {/* Icon - enlarged (18px) for breathing room */}
                  <Icon
                    className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                      isActive ? 'text-navy-950' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />

                  {/* Expanding Label on Desktop Dock Hover */}
                  <span
                    className={`hidden sm:inline-block overflow-hidden whitespace-nowrap text-[13px] font-sans transition-all duration-200 ${
                      isHovered
                        ? 'max-w-[120px] opacity-100 ml-3'
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
  );
}
