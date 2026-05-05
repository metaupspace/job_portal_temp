'use client'
import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import Modal from "./modal/index"

export default function Project() {
  const projects = [
    { 
      title: "UI/UX Design", 
      src: "WebUI.png", 
      color: "#4F46E5",
      description: "Aiming to build a professional career in design, tech, or digital media"
    },
    { 
      title: "Website Development", 
      src: "saas.png", 
      color: "#059669",
      description: "Seeking practical, job-ready skills beyond traditional education"
    },
    { 
      title: "Mobile App", 
      src: "WebApp.png", 
      color: "#DC2626",
      description: "Looking to enter creative industries from other fields"
    },
    { 
      title: "Automation", 
      src: "auto1.png", 
      color: "#7C3AED",
      description: "Wanting to upskill and build strong digital presence"
    },
    { 
      title: "Custom Software", 
      src: "WebCustom.png", 
      color: "#DC2626",
      description: "Custom Application Development"
    }
  ];

  const [model, setModel] = useState({ active: false, index: 0 });

  return (
    <div className="flex py-4 md:py-10 w-full items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full flex flex-col items-center justify-center">
        {/* Header for mobile */}
    

        {projects.map((project, index) => (
          <ProjectCard key={index} title={project.title} description={project.description} setModal={setModel} index={index} />
        ))}
      </div>
      <Modal modal={model} projects={projects}/>
    </div>
  );
}
