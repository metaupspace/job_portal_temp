'use client'
import ProjectandBlogCard from '@/components/Cards/ProjectandBlogCard'
import React from 'react'

export default function BottomBlogcards() {
  const blogData = [
    {
      id: 1,
      image: "/hero/2.jpg",
      tags: ['Professional Networking', 'Career Growth'],
      title: "Starting your Career in Web Design in MetaUpSpace",
      excerpt: "Learn how to kickstart your web design career with MetaUpSpace's comprehensive training program and networking opportunities."
    },
    {
      id: 2,
      image: "/hero/3.jpg",
      tags: ['AI Development', 'Technology'],
      title: "The Future of AI in Modern Business Solutions",
      excerpt: "Discover how artificial intelligence is revolutionizing business processes and creating new opportunities for growth."
    },
    {
      id: 3,
      image: "/hero/4.jpg",
      tags: ['Mobile Development', 'Apps'],
      title: "Building Cross-Platform Mobile Applications",
      excerpt: "A comprehensive guide to developing mobile apps that work seamlessly across iOS and Android platforms."
    },
    {
      id: 4,
      image: "/hero/5.jpg",
      tags: ['UI/UX Design', 'User Experience'],
      title: "Designing User-Centered Digital Experiences",
      excerpt: "Best practices for creating intuitive and engaging user interfaces that drive business success."
    },
    {
      id: 5,
      image: "/hero/6.jpg",
      tags: ['Web Development', 'Frontend'],
      title: "Modern Frontend Development Trends 2025",
      excerpt: "Stay ahead with the latest frontend technologies and frameworks shaping the web development landscape."
    },
    {
      id: 6,
      image: "/hero/7.jpg",
      tags: ['Digital Marketing', 'Growth'],
      title: "Digital Marketing Strategies That Actually Work",
      excerpt: "Proven digital marketing techniques to boost your online presence and drive sustainable business growth."
    }
  ]

  return (
    <div className='flex flex-col gap-4 w-full overflow-hidden mt-16'>
      <h4 className='text-2xl sm:text-3xl lg:text-[35px] sf font-bold px-4 sm:px-0'>
        Latest From MetaUpSpace
      </h4>

      {/* Horizontal Scroll Container */}
      <div className="w-full overflow-hidden">
        <div
          className="overflow-x-auto pb-4 px-4 sm:px-0"
          style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none'  /* Internet Explorer 10+ */
          }}
        >
          {/* Hide scrollbar for webkit browsers */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div className="flex gap-4 lg:gap-6 w-max">
            {blogData.map((blog) => (
              <div
                key={blog.id}
                className="flex-shrink-0 w-80 sm:w-96 lg:w-[420px]"
              >
                <ProjectandBlogCard
                  image={blog.image}
                  tags={blog.tags}
                  title={blog.title}
                  excerpt={blog.excerpt}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Optional */}
      <div className="flex justify-center mt-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>←</span>
          <span>Scroll to see more</span>
          <span>→</span>
        </div>
      </div>
    </div>
  )
}
