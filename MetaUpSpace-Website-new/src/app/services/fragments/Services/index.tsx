import Headers from '@/components/header'
import React from 'react'
import Project from './project'

export default function Services() {
    return (
        <div className='px-4'>
            <Headers
                label='SERVICES'
                heading="How can we help you?"
                subheading="We offer expert Webflow design, development, SEO, and support services—tailored to boost your website’s performance, user experience, and growth."
            />

            <Project />


        </div>
    )
}
