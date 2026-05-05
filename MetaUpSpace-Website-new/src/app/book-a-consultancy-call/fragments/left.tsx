'use client'

import React, { useState } from 'react'
import { Phone, Mail, Clock, MapPin } from 'lucide-react'

interface ContactInfoProps {
  className?: string
}

export default function ContactInfo({ className = '' }: ContactInfoProps) {
  // 1. State to manage the active office view
  const [activeLocation, setActiveLocation] = useState<'delhi' | 'mumbai'>('delhi')

  // 2. Map Configuration
  // REPLACE these URLs with the "Embed a map" src from Google Maps for your specific locations
  const mapConfig = {
    delhi: {
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3497.900498838545!2d77.4991612!3d28.7523876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf471f7307f87%3A0xa4a1095abb33f9ac!2sTBI%20KIET!5e0!3m2!1sen!2sin!4v1765474200547!5m2!1sen!2sin",
      label: "Delhi Office (TBI KIET)"
    },
    mumbai: {
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.6941783698153!2d72.8620188!3d19.0331931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cf34ecb45d15%3A0x716ae109d19ef16e!2sNational%20Insurance%20Company!5e0!3m2!1sen!2sin!4v1765474309959!5m2!1sen!2sin",
      label: "Mumbai Office"
    }
  }

  return (
    <div className={`bg-gray-900/20 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-gray-500/50 ${className}`}>

      {/* Contact Details */}
      <div className="space-y-6 mb-8">

        {/* Phone */}
        <div className="flex items-center gap-4">
          <div className="w-5 h-5 flex-shrink-0">
            <Phone size={20} className="text-blue-400" />
          </div>
          <span className="text-white text-base">+91 8689829680</span>
        </div>

        {/* Email */}
        <div className="flex items-center gap-4">
          <div className="w-5 h-5 flex-shrink-0">
            <Mail size={20} className="text-blue-400" />
          </div>
          <span className="text-white text-base">bd@metaupspace.com</span>
        </div>

        {/* Hours */}
        <div className="flex items-start gap-4">
          <div className="w-5 h-5 flex-shrink-0 mt-1">
            <Clock size={20} className="text-blue-400" />
          </div>
          <div className="text-white text-base">
            <div>Monday-Friday</div>
            <div className="text-gray-400">10am-8pm</div>
          </div>
        </div>

        {/* Location Switcher */}
        <div className="flex items-start gap-4">
          <div className="w-5 h-5 flex-shrink-0 mt-1">
            <MapPin size={20} className="text-blue-400" />
          </div>
          <div className="w-full">
            <div className="text-white text-base mb-3">Our Locations</div>

            {/* Toggle Buttons */}
            <div className="flex gap-2 p-1 bg-gray-800/50 rounded-lg border border-gray-600/30 w-fit">
              <button
                onClick={() => setActiveLocation('delhi')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${activeLocation === 'delhi'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                Delhi
              </button>
              <button
                onClick={() => setActiveLocation('mumbai')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${activeLocation === 'mumbai'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                Mumbai
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-64 lg:h-80 rounded-xl overflow-hidden border border-gray-600/50 bg-gray-800">
        <iframe
          key={activeLocation} // Forces iframe to reload when location changes
          src={mapConfig[activeLocation].src}
          title={mapConfig[activeLocation].label}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full filter grayscale-[20%] hover:grayscale-0 transition-all duration-500"
        />

        {/* Optional: Overlay to keep the glassmorphism feel, click-through allowed */}
        <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-xl shadow-inner mix-blend-overlay"></div>
      </div>
    </div>
  )
}
