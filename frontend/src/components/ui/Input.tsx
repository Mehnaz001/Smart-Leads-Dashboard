import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>}
      <input
        className={`w-full bg-surface-card border rounded-lg text-white placeholder-gray-600 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 ${error ? 'border-red-500' : 'border-surface-border'} ${icon ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5'} ${className}`}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);
