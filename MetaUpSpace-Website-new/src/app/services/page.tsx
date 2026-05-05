import Herov2 from '@/components/hero/Herov2'
import React from 'react'
import Services from './fragments/Services'
import HowWeOpeate from '../about-us/fragments/HowWeOperate'

export default function ServicesPage() {
  return (
    <div className='w-full'>
      <Herov2/>
      <Services/>
      <HowWeOpeate/>
    </div>
  )
}
