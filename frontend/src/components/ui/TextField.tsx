import { InputHTMLAttributes, forwardRef } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, id, className = '', ...rest }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div>
        <label htmlFor={inputId} className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-50 ${className}`}
          {...rest}
        />
      </div>
    );
  }
);
TextField.displayName = 'TextField';
