import Headers from '@/components/header'
import React from 'react'
import ProjectCard from './ProjectCard'

export default function TopProject() {
    return (
        <div>
            <Headers
                label='LATEST'
                heading="MetaUpSpace’s Latest Tech"
                subheading="We offer expert Webflow design, development, SEO, and support services—tailored to boost your website’s performance, user experience, and growth."
            />


            <div className="w-full flex items-center justify-center px-6">
                <ProjectCard />
            </div>
        </div>
    )
}
