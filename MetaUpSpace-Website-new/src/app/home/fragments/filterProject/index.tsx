'use client'
import React, { useState, useEffect, useRef } from 'react';
import Headers from '@/components/header';
import { projectsData, Project } from './Projects';
import ProjectCard from '../horizontaProjects/Cards';
import TagContainer from './TagContainer';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

// --- Sub-Component for Desktop Scroll ---
// We extract this so useScroll only runs when this component is actually rendered
const DesktopScrollSection = ({ projects }: { projects: Project[] }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    // offset: ["start end", "end start"] // Optional: adjust based on when you want scroll to start
  });

  // Convert continuous scroll into discrete card steps (same behavior as HorizontalProjects).
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const maxIndex = Math.max(projects.length - 1, 0);
    const nextIndex = Math.min(Math.floor(latest * projects.length), maxIndex);

    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    }
  });

  return (
    <div
      ref={targetRef}
      className="hidden xl:block relative"
      style={{ height: `${projects.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          animate={{ x: `-${activeIndex * 100}vw` }}
          transition={{ duration: 1.5, ease: [0.32, 1, 0.3, 1] }}
          className="h-screen flex items-center"
        >
          {projects.map((project, index) => (
            <div key={index} className="w-screen flex-shrink-0 px-8 2xl:px-16">
              <ProjectCard
                title={project.title}
                description={project.description}
                features={project.features}
                imageUrl={project.imageUrl}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// --- Main Component ---
const FilteredProjectsContainer: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['uiux']);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  // Filter projects based on selected categories
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

  // Handle tag selection
  const handleTagSelection = (selectedIds: string[]) => {
    if (selectedIds.length > 0) {
      const lastSelected = selectedIds[selectedIds.length - 1];
      setSelectedCategories([lastSelected]);
    } else {
      setSelectedCategories([]);
    }
  };

  const tagOptions = [
    { id: 'uiux', label: 'UI/UX Design' },
    { id: 'web', label: 'Website Development' },
    { id: 'mobile', label: 'Mobile App' },
    { id: 'automation', label: 'Automation' },
    { id: 'Custom', label: 'Custom Software' },
  ];

  return (
    <div className="w-full relative">
      {/* Header Section */}
      <div className="w-full px-4 py-6 md:py-8">
        <Headers
          label='Industry'
          heading="Browse Via Industry"
          subheading="We offer expert solutions across industries, tailored to boost your business performance and growth."
        />

        {/* Filtering Controls */}
        <div className="mt-6">
          {/* Desktop Tags */}
          <div className="hidden lg:block">
            <TagContainer
              tags={tagOptions}
              allowMultiple={false}
              onSelectionChange={handleTagSelection}
              className="justify-center"
            />
          </div>

          {/* Mobile Tags */}
          <div className="lg:hidden">
            <div className="overflow-x-auto -mx-4 px-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
              <div className="flex gap-3 w-max pb-2">
                {tagOptions.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagSelection([tag.id])}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
                      transition-all duration-200 whitespace-nowrap flex-shrink-0
                      ${selectedCategories.includes(tag.id)
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400/50'
                        : 'bg-gray-800/60 text-white border border-gray-600/50 hover:bg-gray-700/60'
                      }
                    `}
                  >
                    <span>{tag.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      <div className="w-full pb-8">
        {filteredProjects.length > 0 ? (
          <>
            {/* 1. Mobile & Tablet (< xl): Vertical Stack */}
            <div className="block xl:hidden px-4">
              <div className="flex flex-col space-y-8 max-w-7xl mx-auto">
                {filteredProjects.map((project, index) => (
                  <div key={index} className="w-full">
                    <ProjectCard
                      title={project.title}
                      description={project.description}
                      features={project.features}
                      imageUrl={project.imageUrl}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Desktop (>= xl): Horizontal Scroll */}
            {/* We render the sub-component here, so useScroll is safe */}
            <DesktopScrollSection projects={filteredProjects} />
          </>
        ) : (
          /* Empty State */
          <div className="text-center text-white/70 py-16 px-4">
            <p className="text-xl">No projects found for the selected category.</p>
            <p className="text-sm mt-2 opacity-60">Try selecting a different category above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilteredProjectsContainer;
