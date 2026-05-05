// components/Breadcrumb.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumb() {
  const pathname = usePathname()
  
  // Generate breadcrumbs from URL
  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...pathSegments.map((segment, index) => ({
      label: segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      href: '/' + pathSegments.slice(0, index + 1).join('/')
    }))
  ]
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-white">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight size={16} className="mx-2 text-white" />}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-white font-medium line-clamp-1">{item.label}</span>
          ) : (
            <Link href={item.href} className="text-white line-clamp-1 hover:text-blue-600">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
