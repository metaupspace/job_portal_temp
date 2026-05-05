'use client'
import React, { useState, useMemo, useEffect } from 'react'
import Tag from '@/app/home/fragments/filterProject/Tag'
import Headers from './index'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectandBlogCard from '@/components/Cards/ProjectandBlogCard'
import { industryProjects, serviceProjects } from '@/lib/staticData'

// --- FILTER CONFIGURATION ---
// These values MUST match the data exactly (case-sensitive)

const serviceFilters = [
  { value: 'all', label: 'All Projects' },
  { value: 'web-dev', label: 'Web Development' },
  { value: 'mobile-dev', label: 'Mobile Development' },
  { value: 'ai-dev', label: 'AI Development' },
  { value: 'ui-ux', label: 'UI/UX Design' },
];

const industryFilters = [
  { value: 'all', label: 'All Industries' },
  { value: 'uiux', label: 'UI/UX Design' },    // Matches category: 'uiux'
  { value: 'web', label: 'Website Dev' },       // Matches category: 'web'
  { value: 'mobile', label: 'Mobile App' },     // Matches category: 'mobile'
  { value: 'automation', label: 'Automation' }, // Matches category: 'automation'
  { value: 'Custom', label: 'Custom Software' },// Matches category: 'Custom'
];

interface ProjectItem {
  id: string;
  title: string;
  image?: string;
  imageUrl?: string;
  excerpt?: string;
  description?: string;
  tags?: string[];
  features?: string[];
  service?: string;
  category?: string;
}

export default function Projects() {
  const [browseMode, setBrowseMode] = useState<'Industry' | 'Services'>('Services');
  const [activeFilter, setActiveFilter] = useState('all');

  // Sync with LocalStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('browseMode');
    if (savedMode && (savedMode === 'Industry' || savedMode === 'Services')) {
      setBrowseMode(savedMode as 'Industry' | 'Services');
    }
  }, []);

  const handleToggle = (mode: string) => {
    const newMode = mode as 'Industry' | 'Services';
    setBrowseMode(newMode);
    setActiveFilter('all'); // Reset filters on toggle
    localStorage.setItem('browseMode', newMode);
  };

  const currentFilters = browseMode === 'Services' ? serviceFilters : industryFilters;

  const currentData = useMemo(() => {
    // 1. Get correct dataset
    const data = browseMode === 'Services' ? serviceProjects : industryProjects;

    // 2. Return all if 'all' is selected
    if (activeFilter === 'all') return data;

    // 3. Filter Logic

    return data.filter((item: ProjectItem) => {
      if (browseMode === 'Services') {
        return item.service === activeFilter;
      } else {
        // Safe check for category
        return item.category === activeFilter;
      }
    });
  }, [browseMode, activeFilter]);

  return (
    <div className='w-full overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8'>

        <div className="mb-8 sm:mb-12">
          {/* Pass currentMode to ensure Headers stays in sync */}
          <Headers
            label={browseMode.toUpperCase()}
            headingPrefix="Browse via"
            subheading="AI solutions across industries, making innovation practical, efficient, and results-driven."
            currentMode={browseMode}
            onToggle={handleToggle}
          />
        </div>

        {/* Filter Section */}
        <div className="mb-8 w-full flex items-center justify-center relative z-20">
          <div
            className="overflow-x-auto -mx-4 px-4 pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>

            <div className="flex gap-3 w-max">
              {currentFilters.map((filter) => (
                <Tag
                  key={filter.value}
                  variant={activeFilter === filter.value ? 'primary' : 'secondary'}
                  onClick={() => setActiveFilter(filter.value)}
                  className="whitespace-nowrap flex-shrink-0"
                >
                  {filter.label}
                </Tag>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${browseMode}-${activeFilter}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-center"
          >
            {currentData.map((project: ProjectItem, index: number) => {
              // Handle data normalization safely
              const normalizedImage = project.image || project.imageUrl || '';
              const normalizedExcerpt = project.excerpt || project.description || '';
              // Use tags if available, otherwise take first 3 features, or empty array
              const normalizedTags = project.tags || (project.features ? project.features.slice(0, 3) : []);

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="w-full max-w-sm"
                >
                  <ProjectandBlogCard
                    image={normalizedImage}
                    title={project.title}
                    excerpt={normalizedExcerpt}
                    id={project.id}
                    tags={normalizedTags}
                    className="w-full h-full"
                    isClickable={browseMode === 'Services'}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {currentData.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
            <p className="text-gray-400 mb-4 max-w-md mx-auto px-4">
              We couldn&apos;t find any projects matching the filter.
            </p>
            <div className='mt-4'>
              <Tag variant="primary" onClick={() => setActiveFilter('all')}>
                Clear Filters
              </Tag>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  )
}
