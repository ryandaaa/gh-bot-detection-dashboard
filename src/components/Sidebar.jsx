import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  Network,
  BarChart3,
  BookOpen,
  UsersRound
} from 'lucide-react';

export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutGrid },
    { to: '/accounts', label: 'Accounts', icon: Users },
    { to: '/clusters', label: 'Clusters', icon: Network },
    { to: '/evaluation', label: 'Evaluation', icon: BarChart3 },
    { to: '/methodology', label: 'Methodology', icon: BookOpen },
    { to: '/team', label: 'Team', icon: UsersRound },
  ];

  return (
    /* Navigation Bar: Fixed Bottom Bar on Mobile, Centered Vertical Dock on Desktop */
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Navigation Dock"
      className="fixed z-40 select-none
        /* Desktop/Tablet: Centered floating vertical dock on left */
        sm:left-4 sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto sm:right-auto sm:w-auto
        /* Mobile: Fixed Full-Width Bottom Bar */
        bottom-0 left-0 right-0 w-full"
    >
      <div
        className={`bg-white/95 dark:bg-[#101010]/95 backdrop-blur-md border-t border-slate-200/90 dark:border-[#262626]
          shadow-[0_-2px_12px_rgba(0,0,0,0.04)] sm:shadow-[0_6px_28px_rgba(0,0,0,0.06)]
          flex transition-all duration-200 ease-out
          /* Mobile styles: fixed bottom row with safe area padding */
          flex-row items-center justify-around px-2 py-1.5 pb-[max(0.45rem,env(safe-area-inset-bottom))]
          /* Desktop styles: vertical floating card with hairline border & auto-expansion */
          sm:flex-col sm:items-stretch sm:justify-start sm:border sm:rounded-[8px] sm:p-2 sm:gap-2 sm:pb-2
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
                `group relative flex flex-col sm:flex-row items-center justify-center sm:justify-start rounded-[6px] transition-all duration-150 outline-none focus:outline-none ${
                  isActive
                    ? 'text-navy-950 dark:text-white sm:bg-slate-100 sm:dark:bg-[#161616] font-semibold'
                    : 'text-slate-400 hover:text-slate-700 dark:text-[#737373] dark:hover:text-[#a1a1a1] sm:hover:bg-slate-50 sm:dark:hover:bg-[#161616] font-normal'
                } py-1 px-2 sm:h-10 sm:px-3`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Icon */}
                  <Icon
                    className={`w-[19px] h-[19px] sm:w-[18px] sm:h-[18px] shrink-0 transition-colors ${
                      isActive ? 'text-navy-950 dark:text-white' : 'text-slate-400 dark:text-[#737373] group-hover:text-slate-700 dark:group-hover:text-[#a1a1a1]'
                    }`}
                  />

                  {/* Mobile Label Underneath Icon */}
                  <span
                    className={`sm:hidden text-[10px] mt-0.5 tracking-tight font-medium ${
                      isActive ? 'text-navy-950 dark:text-white font-semibold' : 'text-slate-500 dark:text-[#737373]'
                    }`}
                  >
                    {item.label}
                  </span>

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

                  {/* Tooltip when desktop dock is not hovered */}
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
