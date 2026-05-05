import React from 'react'
import Button from '../button/Button'
import { ArrowRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function FinalCTA() {

  const pathname = usePathname()
  const hideTop = pathname?.startsWith('/irdp')

  if(hideTop) return null
  return (
    <div className='max-w-4xl mx-auto relative bg-[#1a1a1a]/30 flex flex-col gap-2 md:gap-4 w-full items-center justify-center py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-12 rounded-md overflow-hidden'>
      
      {/* Background Container - Respects padding */}
      <div className="absolute top-0 left-0 right-0 bottom-0 z-0">
        {/* Background Image Layer 1 */}
        <div className="absolute inset-0 z-0 opacity-60 md:opacity-80">
          <div 
            className="w-full h-full" 
            style={{
              backgroundImage: `url('/hero/finalcta01.svg')`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}
          ></div>
        </div>

        {/* Background Grid Layer 2 */}
        <div className="absolute inset-0 z-0 opacity-30 md:opacity-50">
          <div 
            className="w-full h-full" 
            style={{
              backgroundImage: `url('/hero/grid.svg')`,
              backgroundPosition: 'center',
              backgroundRepeat: 'repeat',
              backgroundSize: 'auto'
            }}
          ></div>
        </div>
      </div>

      {/* Content - Now properly spaced with padding */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-2 md:gap-4 text-center w-full">
        <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-[38px] sf font-bold leading-tight max-w-3xl'>
          It&lsquo;s always the right time for impactful design
        </h2>
        
        <p className='text-sm sm:text-base md:text-lg lg:text-[18px] opacity-70 sf-display max-w-2xl leading-relaxed'>
          Ready to bring your vision to life? Book a call or send an email, and let&lsquo;s make it happen!
        </p>
        
        <Button 
          variant='primary' 
          className='mt-4 md:mt-6 lg:mt-8 text-sm md:text-base' 
          icon={<ArrowRight className="w-4 h-4 md:w-5 md:h-5" />}
          link='/book-a-consultancy-call'
        >
          <span className="sm:inline">Book a Consultation Call</span>
        </Button>
      </div>
    </div>
  )
}
