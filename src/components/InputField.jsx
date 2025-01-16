const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
  onBlur,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm mb-1 font-medium text-gray-700"
    >
      {label} {required && "*"}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      required={required}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default InputField;
