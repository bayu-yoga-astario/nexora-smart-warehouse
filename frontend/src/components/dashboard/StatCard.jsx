import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

// Animated number counter hook
const useCountUp = (target, duration = 1200, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const numericTarget = parseFloat(String(target).replace(/[^0-9.]/g, '')) || 0;
    if (numericTarget === 0) { setCount(0); return; }
    const increment = numericTarget / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, start]);
  return count;
};

const colorMap = {
  cyan: {
    accent: 'rgba(6,182,212,0.08)',
    iconBg: 'bg-cyan-500/10',
    iconBorder: 'border-cyan-500/20',
    iconColor: 'text-cyan-400',
    sparkColor: '#06b6d4',
    glow: 'rgba(6,182,212,0.15)',
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
  },
  emerald: {
    accent: 'rgba(16,185,129,0.08)',
    iconBg: 'bg-emerald-500/10',
    iconBorder: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
    sparkColor: '#10b981',
    glow: 'rgba(16,185,129,0.15)',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  },
  amber: {
    accent: 'rgba(245,158,11,0.08)',
    iconBg: 'bg-amber-500/10',
    iconBorder: 'border-amber-500/20',
    iconColor: 'text-amber-400',
    sparkColor: '#f59e0b',
    glow: 'rgba(245,158,11,0.15)',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  },
  rose: {
    accent: 'rgba(244,63,94,0.08)',
    iconBg: 'bg-rose-500/10',
    iconBorder: 'border-rose-500/20',
    iconColor: 'text-rose-400',
    sparkColor: '#f43f5e',
    glow: 'rgba(244,63,94,0.15)',
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
  },
};

export const StatCard = ({
  title,
  value,
  rawValue,
  prefix = '',
  suffix = '',
  change,
  trend = 'up',
  icon: Icon,
  color = 'cyan',
  sparkData = [],
  subtitle,
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const c = colorMap[color] || colorMap.cyan;
  const counted = useCountUp(rawValue ?? 0, 1000, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const displayValue = rawValue != null
    ? `${prefix}${counted.toLocaleString('id-ID')}${suffix}`
    : value;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-400';

  return (
    <div
      ref={ref}
      className="stat-card p-5 animate-slide-up"
      style={{ '--card-accent-color': c.accent }}
    >
      {/* Top Row */}
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl border ${c.iconBg} ${c.iconBorder}`}>
          <Icon className={`w-5 h-5 ${c.iconColor}`} />
        </div>
        {sparkData.length > 0 && (
          <div className="w-24 h-10 opacity-70">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={c.sparkColor}
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="animate-count-up">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-black text-white tracking-tight font-mono">
          {displayValue}
        </h3>
        {subtitle && (
          <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Change Badge */}
      {change && (
        <div className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${c.badgeBg}`}>
          <TrendIcon className="w-3 h-3" />
          <span>{change}</span>
          <span className="text-slate-400 font-normal ml-0.5">vs bulan lalu</span>
        </div>
      )}
    </div>
  );
};
