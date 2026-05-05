import Image from 'next/image'
import React from 'react'
import Breadcrumb from '../fragments/Breadcrumbs'
import RelatedBlogs from '../fragments/RelatedBlogCardComponent';
import BottomBlogcards from '../fragments/BottomBlogcards';

export default function page() {
  const sections = [
    {
      heading: "How design thinking can help you transform?",
      body: "Design thinking has a human-centered core. It encourages organizations to focus on the people they're creating for, which leads to better products, services, and processes. When you sit down to create a solution for a business need, the first question should always be what's the human need behind it?"
    },
    {
      heading: "How Does Design Thinking Work?",
      body: "By employing design thinking, we pull together what's desirable from a human point of view with what is technologically feasible and economically viable. It also allows those who aren't trained as designers to use creative techniques, methods, and mindsets to address a vast range of challenges.\n\nDesirability: What makes sense to people and for people?\nFeasibility: What is technically possible within the foreseeable future\nViability: What is likely to become part of a sustainable business model?"
    },
    {
      heading: "Desirability: Meet People's Needs",
      body: "In the world of design thinking, it all starts with people — the end users. The team listens with empathy, delving into the needs, dreams, and behaviors of individuals. It's about understanding what people truly desire, not what the organization assumes. Solutions are crafted from the end user's perspective, ensuring alignment with their needs."
    },
    {
      body: "Identified solutions undergo a feasibility check. Can the organization realistically implement them with the current or foreseeable resources? While any solution may be theoretically feasible with infinite resources, the team evaluates the practicality. Iteration might be necessary to enhance feasibility, and resource planning, such as hiring or acquiring machinery, may come into play. It's crucial to avoid getting entangled in technicalities at the outset, allowing room for innovative thinking."
    },
    {
      heading: "What are the 5 Stages of the Design Thinking Process",
      body: "The five stages of design thinking, according to the d.school, are:\n\n• Empathize: research your users' needs.\n• Define: state your users' needs and problems.\n• Ideate: challenge assumptions and create ideas.\n• Prototype: start to create solutions.\n• Test: try your solutions out.\n\nLet's dive into each stage of the design thinking process.",
      image: "/blog/cover.png"
    },
    {
      heading: "Conclusion",
      body: "Design thinking is an iterative, non-linear process that focuses on a collaboration between designers and users. It brings innovative solutions to life based on how real users think, feel, and behave. It is important to note the five stages of design thinking are not always sequential. They do not have to follow a specific order, and they can often occur in parallel or be repeated iteratively. The stages should be understood as different modes which contribute to the entire design project, rather than sequential steps."
    }
  ];

  return (
    <div className='w-full max-w-7xl px-4 pt-[30%] md:pt-[8%] pb-8 overflow-hidden'>
      
      {/* Header Section - Centered */}
      <div className="text-center mb-8 px-4">
        
        {/* Breadcrumb - Centered */}
        <div className="flex justify-center mb-6">
          <Breadcrumb />
        </div>
        
        {/* Main Title */}
        <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl sf font-bold leading-tight mb-6 max-w-4xl mx-auto'>
          What is Design Thinking?
        </h1>
        
        {/* Description */}
        <div className="max-w-3xl mx-auto mb-8">
          <p className='text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed mb-4'>
            Discover how design thinking can revolutionize the way you approach problem-solving and innovation in your organization.
          </p>
        </div>
        
        {/* Author Info - Centered */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-center sm:text-left">
            <h3 className='text-base lg:text-lg text-white'>Author Name</h3>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span>5 min read</span>
              <span>•</span>
              <span>Sept 19, 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Hero Image */}
      <div className="w-full mb-12 px-4">
        <div className="w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] rounded-2xl overflow-hidden shadow-2xl">
          <Image 
            src="/blog/cover.png" 
            priority 
            width={1200} 
            height={600} 
            className='w-full h-full object-cover' 
            alt='What is Design Thinking - Blog Cover'
          />
        </div>
      </div>
      
      {/* Main Content Section */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-4">
        
        {/* Article Content - Left 70% */}
        <main className="w-full lg:w-[70%]">
          <article className="flex flex-col gap-8 lg:gap-12">
            {sections.map((section, index) => (
              <section key={index} className="flex flex-col gap-4">
                {section.heading && (
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                    {section.heading}
                  </h2>
                )}
                
                <div className="prose prose-lg max-w-none">
                  {section.body.split('\n').map((paragraph, pIndex) => (
                    paragraph.trim() && (
                      <p key={pIndex} className='text-base lg:text-lg text-gray-300 leading-relaxed '>
                        {paragraph.startsWith('•') ? (
                          <span className="flex items-start gap-3">
                            <span className="text-blue-400 mt-2">•</span>
                            <span>{paragraph.substring(1).trim()}</span>
                          </span>
                        ) : (
                          paragraph
                        )}
                      </p>
                    )
                  ))}
                </div>
                
                {/* Section Images */}
                {section.image && (
                  <div className="w-full h-[300px] lg:h-[400px] rounded-xl overflow-hidden my-6 shadow-lg">
                    <Image 
                      src={section.image} 
                      width={800} 
                      height={400} 
                      className='w-full h-full object-cover' 
                      alt={`Illustration for ${section.heading || 'Article section'}`}
                    />
                  </div>
                )}
              </section>
            ))}
          </article>
          
          {/* Article Footer */}
          <footer className="border-t border-gray-700 pt-8 mt-16">
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="text-sm text-gray-400 font-medium">Tags:</span>
              {['Design Thinking', 'UX Design', 'Innovation', 'Process'].map((tag) => (
                <span key={tag} className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-full text-sm transition-colors cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>
      
          </footer>
        </main>
        
        {/* Related Blogs Sidebar - Right 30% */}
        <aside className="w-full lg:w-[30%]">
          <div className="lg:sticky lg:top-8">
            <RelatedBlogs />
          </div>
        </aside>
      </div>

      {/* Bottom Blog Cards */}
      
        <BottomBlogcards />
      
    </div>
  )
}
