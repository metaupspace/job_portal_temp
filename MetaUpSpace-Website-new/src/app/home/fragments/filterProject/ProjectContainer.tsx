// components/ProjectsContainer.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
import Headers from '@/components/header';
import DropdownSelector from './Dropdown';
import { projectsData, Project } from './Projects';
import ProjectCard from '../horizontaProjects/Cards';
import TagContainer from './TagContainer';

const ProjectsContainer: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['healthcare']);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  // Use viewport scroll - no ref needed!
  const { scrollYProgress } = useScroll();

  const maxScrollVw = filteredProjects.length > 1 ? (filteredProjects.length - 1) * 100 : 0;
  const x = useTransform(scrollYProgress, [0.3, 0.7], [`0vw`, `-${maxScrollVw}vw`]);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredProjects([]);
    } else {
      const filtered = projectsData.filter(project =>
        selectedCategories.includes(project.category)
      );
      setFilteredProjects(filtered);
    }
  }, [selectedCategories]);

  const handleTagSelection = (selectedIds: string[]) => {
    if (selectedIds.length > 0) {
      const lastSelected = selectedIds[selectedIds.length - 1];
      setSelectedCategories([lastSelected]);
    } else {
      setSelectedCategories([]);
    }
  };

  const handleDropdownSelection = (value: string) => {
    setSelectedCategories([value]);
  };

  const tagOptions = [
    { id: 'healthcare', label: 'HealthCare', icon: '🏥' },
    { id: 'government', label: 'Government', icon: '🏛️' },
    { id: 'media', label: 'Media', icon: '📺' },
    { id: 'neural', label: 'Neural Minds', icon: '🧠' },
  ];

  const dropdownOptions = tagOptions.map(tag => ({
    value: tag.id,
    label: tag.label,
    icon: tag.icon
  }));

  const scrollHeight = `${Math.max(2, filteredProjects.length) * 100}vh`;

  return (
    <div>
      <div className="w-full px-4 py-4 md:py-6">
        <Headers
          label='Projects'
          heading="Let's Start with our Projects"
          subheading="We offer expert solutions across industries, tailored to boost your business performance and growth."
        />

        <div className="mt-4">
          <div className="hidden lg:block">
            <TagContainer
              tags={tagOptions}
              allowMultiple={false}
              onSelectionChange={handleTagSelection}
              className="justify-center"
            />
          </div>

          <div className="lg:hidden">
            <div className="flex justify-center">
              <DropdownSelector
                options={dropdownOptions}
                placeholder="Select Category"
                onSelect={handleDropdownSelection}
                className="max-w-[250px] w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="space-y-6 px-4 pb-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              features={project.features}
              imageUrl={project.imageUrl}
            />
          ))}
          {filteredProjects.length === 0 && (
            <div className="text-center text-white/70 py-12">
              <p>No projects found for the selected category.</p>
            </div>
          )}
        </div>
      </div>

      {filteredProjects.length > 0 && (
        <div
          className="hidden lg:block relative"
          style={{ height: scrollHeight }}
        >
          <div className="sticky top-0 h-screen flex items-center overflow-hidden">
            <motion.div
              style={{
                x: filteredProjects.length === 1 ? '0vw' : x,
              }}
              className="flex h-full w-full"
            >
              {filteredProjects.map((project, index) => (
                <div
                  key={index}
                  className="min-w-full h-full flex items-center justify-center flex-shrink-0 px-4"
                >
                  <div className="max-w-7xl w-full h-full flex items-center">
                    <ProjectCard
                      title={project.title}
                      description={project.description}
                      features={project.features}
                      imageUrl={project.imageUrl}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="hidden lg:block h-screen flex items-center justify-center">
          <p className="text-xl text-white/70">No projects found for the selected category.</p>
        </div>
      )}

      <div className="px-4 py-4 text-center">
        <p className="text-white/60 text-sm">
          Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
          {selectedCategories.length > 0 && (
            <span> in {selectedCategories[0]} category</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ProjectsContainer;
