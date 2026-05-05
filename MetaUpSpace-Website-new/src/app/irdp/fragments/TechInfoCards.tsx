import Image from 'next/image';
import React from 'react';

const infoItems = [
  {
    label: 'LOCATION',
    title: 'Offline',
    subtitle: 'KIET Deemed to be University',
    icon: '/irdp/infoCardIcon/Location.svg',
  },
  {
    label: 'DURATION',
    title: '6 Weeks',
    subtitle: 'Including Real product Building',
    icon: '/irdp/infoCardIcon/Timer-2.svg',
  },
  {
    label: 'ORIENTATION',
    title: '4th May 2026',
    subtitle: 'Mark in your calender',
    icon: '/irdp/infoCardIcon/Location.svg',
  },
];

export default function TechInfoCards() {
  return (
    <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-8 mt-10">
      <div className="bg-gray-700/10   outline-offset-[-1px] outline-white/25 backdrop-blur-sm border border-neutral-800 rounded-2xl p-4 md:p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {infoItems.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-center px-6 md:px-14 py-4 md:py-6 lg:py-6 ${
                idx < infoItems.length - 1
                  ? 'border-b border-neutral-800 lg:border-b-0 lg:border-r lg:border-neutral-800'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={item.icon}
                  alt={`${item.label} icon`}
                  height={20}
                  width={20}
                  className="w-5 h-5 shrink-0"
                />

                <span className="text-sm text-neutral-400 tracking-wide">{item.label}</span>
              </div>

              <h3 className="text-white text-2xl md:text-3xl font-semibold mt-4">
                {item.title}
              </h3>
              <p className="text-neutral-400 mt-2 text-sm md:text-base">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
