import React from 'react';
import { twMerge } from 'tailwind-merge';

interface FormSelectProps {
  id: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  message?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const FormSelect: React.FC<FormSelectProps> = ({
  id,
  value,
  onChange,
  message,
  required = false,
  disabled = false,
  className = '',
  children,
}) => {
  const baseClasses = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500';
  const errorClasses = 'border-red-500 focus:ring-red-500 focus:border-red-500';
  const disabledClasses = 'bg-gray-100 cursor-not-allowed opacity-50';

  const selectClasses = twMerge(
    baseClasses,
    message && errorClasses,
    disabled && disabledClasses,
    className
  );

  return (
    <div className="w-full">
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={selectClasses}
      >
        {children}
      </select>
      {message && (
        <p className="mt-1 text-sm text-red-600">{message}</p>
      )}
    </div>
  );
};

export default FormSelect;