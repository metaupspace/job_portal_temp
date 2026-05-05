import React from 'react'
import ContactForm from './fragments/right'
import ContactInfo from './fragments/left'

export default function page() {
  return (
      <div className='relative min-h-screen w-full overflow-hidden'>
          
          {/* Background Image */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-30 sm:opacity-50 lg:opacity-100"
            style={{ 
              backgroundImage: "url('/hero/rays.png')",
            }}
          />
          
          {/* Content Container */}
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-[25%] md:pt-[8%] pb-8 sm:pb-12 lg:pb-16">
            
            {/* Header Section - Responsive */}
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 lg:mb-16 text-center">
              <h1 className='text-2xl sm:text-3xl md:text-5xl sf text-white font-bold leading-tight max-w-4xl'>
                Book a Consultation with Us
              </h1>
              <p className='text-sm sm:text-base md:text-lg lg:text-xl text-white/70 leading-relaxed max-w-3xl px-2'>
                Have questions or need AI solutions? Let us know by filling out the form, and we&lsquo;ll be in touch!
              </p>
            </div>
    
            {/* Contact Section - Responsive Grid */}
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                
                {/* Left Side - Contact Info */}
                <div className="order-2 lg:order-1">
                  <ContactInfo />
                </div>
                
                {/* Right Side - Contact Form */}
                <div className="order-1 lg:order-2">
                  <ContactForm />
                </div>
                
              </div>
            </div>
    
          </div>
        </div>
  )
}
