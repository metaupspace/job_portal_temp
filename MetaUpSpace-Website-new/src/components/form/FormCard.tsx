import React from 'react'

type Props = {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

export default function FormCard({
  title,
  subtitle,
  children,
  className = '',
  contentClassName = 'space-y-6',
}: Props) {
  return (
    <div
      className={`bg-gray-900/20 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-gray-500/50 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-gray-400 text-sm lg:text-base">{subtitle}</p>
          )}
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </div>
  )
}
