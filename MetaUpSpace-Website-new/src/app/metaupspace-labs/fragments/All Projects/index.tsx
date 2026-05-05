import Headers from '@/components/header'
import React from 'react'
import ProjectCard from '../projects/ProjectCard'

export default function AllProjects() {
  return (
    <div className='w-full flex flex-col items-center gap-6 justify-center'>
      <Headers
  label="Products"
  heading="Discover Our Next-Gen SaaS Innovations"
  subheading="Experience AI-first, design-driven SaaS products crafted to enhance productivity, automate workflows, and accelerate business growth."
/>

      <div className="flex flex-col gap-4 items-center justify-center">
        <ProjectCard
        image='/mockup/hrms.png'
        tags={["AI-Driven HR", "Employee Lifecycle Automation"]}
        title='Smart HRMS'
        description='An intelligent human capital operating system designed to unify HR processes, automate administrative tasks, and provide predictive insights. It transforms raw HR data into strategic foresight, helping organizations reduce costs, improve hiring efficiency, and retain top talent.'
        buttonText='Try Now'
        />
        <ProjectCard reverse={true}
          image='/mockup/ams.png'
          tags={["AI-Driven HR", "Employee Lifecycle Automation"]}
          title='AMS'
          description='MetaUpSpace LLP created AMS, a smart digital platform that makes attendance management simple and real-time. The new system automatically stamps check-ins with GPS, offers biometric options for added security, tracks overtime, and gives teams instant status updates.'
          buttonText='Try Now'
        />
        <ProjectCard 
        image='/mockup/aisuite.png' 
        tags={["AI-Driven HR", "Employee Lifecycle Automation"]}
        title='AI Suite'
        description='MetaUpSpace LLP stepped in with AutoMIS, designed as a finance command center that brings clarity and control to the chaos. This intelligent platform automates routine tasks like tracking income, expenses, billing, and compliance, taking manual work down by 70%. Real-time data flows through the system, enabling managers to run “what-if” scenarios to confidently forecast impacts, such as how raising prices could improve profits even if sales dip. '
           buttonText='Try Now'
        />
      </div>

    </div>
  )
}
