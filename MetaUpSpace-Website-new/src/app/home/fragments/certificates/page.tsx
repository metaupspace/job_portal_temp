'use client'
import Headers from '@/components/header'
import Image from 'next/image'
import React from 'react'

export default function Certificate() {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header Section */}
        <Headers
          label='RECOGNITIONS'
          heading="MetaUpSpace is now officially Recognized by Government"
          subheading="AI solutions across industries, making innovation practical, efficient, and results-driven."
        />

        {/* Recognition Images Section */}
        <div className="mt-12">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">

            {/* First Recognition Image */}
            <div className="flex-1 max-w-md">
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <Image
                  src="/recog.svg"
                  alt="Government Recognition Certificate 1"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-white">Startup India Recognition</h3>
                  <p className="text-sm text-gray-400 mt-1">Official government startup recognition</p>
                </div>
              </div>
            </div>

            {/* Second Recognition Image */}
            {/* <div className="flex-1 max-w-md">
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <Image
                  src="/recog.svg"
                  alt="Government Recognition Certificate 2"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-white">DPIIT Recognition</h3>
                  <p className="text-sm text-gray-400 mt-1">Department of Industrial Policy certificate</p>
                </div>
              </div>
            </div> */}

          </div>
        </div>

        {/* Additional Info Section */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <div className="bg-white/10 px-4 py-2 rounded-full">
            <span className="text-sm text-white">🏆 Government Certified</span>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-full">
            <span className="text-sm text-white">🚀 Startup India</span>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-full">
            <span className="text-sm text-white">🇮🇳 Made in India</span>
          </div>
        </div>

      </div>
    </div>
  )
}
