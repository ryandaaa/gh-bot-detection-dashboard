import React from 'react';

/**
 * Modern SaaS Skeleton UI component with gradient shimmer animation.
 * Adheres to Linear / Supabase aesthetic with rounded-[4px] consistency.
 */
export default function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-shimmer bg-slate-200/70 rounded-[4px] ${className}`}
      {...props}
    />
  );
}

export function SkeletonCard({ className = '', children, ...props }) {
  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
