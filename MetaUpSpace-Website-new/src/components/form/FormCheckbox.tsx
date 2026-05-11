import React, { forwardRef } from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  containerClassName?: string
}

const FormCheckbox = forwardRef<HTMLInputElement, Props>(
  ({ label, id, name, className = '', containerClassName = '', ...rest }, ref) => {
    const inputId = id ?? name
    return (
      <div className={`flex items-center gap-3 ${containerClassName}`}>
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="checkbox"
          className={`w-4 h-4 rounded border-gray-600/50 bg-gray-800/60 accent-blue-600 ${className}`}
          {...rest}
        />
        <label htmlFor={inputId} className="text-white text-sm cursor-pointer">
          {label}
        </label>
      </div>
    )
  },
)
FormCheckbox.displayName = 'FormCheckbox'
export default FormCheckbox
