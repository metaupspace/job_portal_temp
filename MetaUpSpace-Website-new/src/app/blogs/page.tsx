import React from 'react'
import TrueFocus from '@/components/TrueFocus'

export default function page() {
  return (
    <div className=' w-full flex flex-col items-center justify-center min-h-screen'>
      {/* <Herov2/>
      

      <BlogCardContainerThatConatinsCard/> */}

      <TrueFocus 
sentence="Comming Soon"
manualMode={false}
blurAmount={3}
borderColor="blue"
animationDuration={2}
pauseBetweenAnimations={0}
/>
    </div>
  )
}
