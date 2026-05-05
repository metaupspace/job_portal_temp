import Herov2 from '@/components/hero/Herov2'
import React from 'react'
import Whyus from './fragments/WhyUs'
import SimpleMarquee from './fragments/InfiniyeMarquee'
import Testimonials from '@/app/about-us/fragments/testimonials'
import HowWeOpeate from './fragments/HowWeOperate'
import MeetTeam from './fragments/MeetTeam'
import SelectionProcess from './fragments/SelectionProcess'

export default function page() {
  return (
    <div className='w-full '>
      <Herov2/>
      <Whyus/>
      <SimpleMarquee 
  text="WEB DESIGN • DEVELOPMENT • AUTOMATION • AI DEVELOPMENT" 
  speed={15}
  direction="right"
  className="text-white py-4"
/>
<HowWeOpeate/>
<MeetTeam/>
<SelectionProcess/>
<Testimonials/>

    </div>
  )
}
