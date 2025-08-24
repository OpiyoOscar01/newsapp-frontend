/**
 * Reusable form input component
 * Purpose: Consistent form input styling and behavior across the app
 */
import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  icon,
  className = '',
}) => {
  const inputId = `input-${name}`;

  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className={`relative flex items-center border rounded px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      } ${disabled ? 'bg-gray-50' : 'bg-white'}`}>
        {icon && (
          <div className="text-gray-400 mr-2 flex-shrink-0">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="w-full outline-none border-none text-sm bg-transparent disabled:text-gray-500"
        />
      </div>
      
      {error && (
        <p className="text-red-500 text-xs mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
