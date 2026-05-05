'use client'
import ProjectandBlogCard from '@/components/Cards/ProjectandBlogCard'
import Headers from '@/components/header'
import React from 'react'

export default function BlogCardContainerThatConatinsCard() {




  return (
    <div className="w-full max-w-7xl px-4 mx-auto">
      <Headers
        label="Blogs"
        heading="How can we help you?"
        subheading="We offer expert Webflow design, development, SEO, and support services—tailored to boost your website's performance, user experience, and growth."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6 justify-items-center">

        {[1, 2, 3, 4, 5].map((index) => (
          <ProjectandBlogCard
            key={index}
            image="/hero/2.jpg"
            tags={['Professional Networking', 'Career Growth']}
            title="Starting your Career in Web Design in MetaUpSpace"
            excerpt="Learn how to kickstart your web design career with MetaUpSpace's comprehensive training program and networking opportunities."
            className="max-w-sm mx-auto w-full"
          />
        ))}



      </div>
    </div>
  )
}
