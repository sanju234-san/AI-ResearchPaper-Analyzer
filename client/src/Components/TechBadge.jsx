import React from 'react';

const colorMap = {
  mint: 'bg-mint/10 text-mint border-mint/20',
  amber: 'bg-amber/10 text-amber border-amber/20',
  purple: 'bg-purple/10 text-purple border-purple/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  white: 'bg-white/5 text-gray-300 border-white/10',
};

const TechBadge = ({ label, color = 'mint', className = '' }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium border ${colorMap[color] || colorMap.mint} ${className}`}>
    {label}
  </span>
);

export const TechBadgeRow = ({ badges }) => (
  <div className="flex flex-wrap gap-2">
    {badges.map((b, i) => (
      <TechBadge key={i} label={b.label} color={b.color} />
    ))}
  </div>
);

export default TechBadge;
