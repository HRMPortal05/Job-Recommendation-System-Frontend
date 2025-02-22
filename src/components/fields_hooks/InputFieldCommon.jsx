import React from "react";

const InputFieldCommon = ({
  label,
  name,
  value,
  onChange,
  disabled = false,
  type = "text",
  icon: Icon,
  placeholder,
  required = false,
  error,
  multiline = false,
  rows = 3,
}) => {
  const inputStyles = `
    w-full px-4 py-2 
    border border-border dark:border-border-dark rounded-md 
    focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-dark 
    ${Icon ? "pl-10" : ""} 
    bg-white dark:bg-surface-dark 
    text-text-primary dark:text-text-dark_secondary 
    disabled:bg-surface-100 dark:disabled:bg-surface-dark/50
    ${error ? "border-warning-500 dark:border-warning-400" : ""}
  `;

  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-2">
        {label}
        {required && <span className="text-warning-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {multiline ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            rows={rows}
            placeholder={placeholder}
            className={`${inputStyles} min-h-14`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={inputStyles}
          />
        )}

        {Icon && (
          <Icon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary dark:text-text-dark_tertiary" />
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-warning-500 dark:text-warning-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputFieldCommon;
