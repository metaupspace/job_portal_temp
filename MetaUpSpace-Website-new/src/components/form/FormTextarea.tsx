import React, { forwardRef } from 'react'

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
  required?: boolean
  containerClassName?: string
}

const FormTextarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      label,
      error,
      required,
      className = '',
      containerClassName = '',
      id,
      name,
      rows = 4,
      ...rest
    },
    ref,
  ) => {
    const inputId = id ?? name
    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-white text-sm font-medium mb-3"
          >
            {label}
            {required && <span className="text-blue-400"> *</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          name={name}
          rows={rows}
          className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none ${
            error ? 'border-red-500' : 'border-gray-600/50'
          } ${className}`}
          {...rest}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    )
  },
)
FormTextarea.displayName = 'FormTextarea'
export default FormTextarea
