
import React, {Suspense,lazy} from 'react'
import Herov2 from './fragments/hero/Herov2'
import AllProjects from './fragments/All Projects'
import Explosion from './fragments/Explosion/Index'
import Scatter from './fragments/scatter/page'

// const Explosion= lazy(()=> import("./fragments/Explosion/Index"))
const Gallery = lazy(()=> import("../home/fragments/gallery"))


export default function index() {
  return (
    <Suspense fallback={"Loading..."}>
    <div className='w-full'>
      <Herov2/>
      {/* <TopProject/> */}
        <AllProjects/>
      <Scatter/>
    
      <Gallery/>
      <Explosion/>
    </div>
    </Suspense>
  )
}
