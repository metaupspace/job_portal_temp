'use client'
import React, { useState } from 'react';
import Image from 'next/image';

// --- Data Definition ---
const teamData = [
  {
    id: '5',
    name: "Sahil Jaiswal",
    designation: "CEO & Founder",
    department: "Executive",
    image: "/team/sahil2.jpg",
    bio: "Sahil leads the company’s vision, strategy, and growth. He guides teams, builds partnerships, and drives innovation to ensure MetaUpSpace delivers modern, impactful digital solutions for clients across industries."
  },
  {
    id: '1',
    name: "Priyanshu Mishra",
    designation: "COO & AI Lead",
    department: "Management",
    image: "/team/priyanshu.png",
    bio: "Priyanshu leads project planning and technical execution while developing AI solutions for MetaUpSpace. He ensures smooth teamwork, timely delivery, and high-quality results across all technology-driven projects."
  },
  {
    id: '2',
    name: "Nakshatra Manglik",
    designation: "Interim CTO",
    department: "Development",
    image: "/team/Naksh.png",
    bio: "Nakshatra works across both frontend and backend development to build stable, scalable digital platforms. He focuses on clean code, strong functionality, and seamless user experiences that support MetaUpSpace’s products."
  },
  {
    id: '4',
    name: "Riddhi Yadav",
    designation: "Associate Designer",
    department: "Design",
    image: "/team/Riddhi.png",
    bio: "Riddhi designs clean, user-friendly visuals for web interfaces, branding, and digital content. She helps shape MetaUpSpace’s visual identity through thoughtful layouts, creative concepts, and user-focused design work."
  },
  {
    id: '6',
    name: "Anurag Rai Kumar",
    designation: "Associate Designer",
    department: "Design",
    image: "/team/Anurag.png",
    bio: "Anurag assists with creating user-friendly designs, wireframes, and prototypes. He supports the design team by improving usability, refining layouts, and contributing to engaging digital experiences."
  },
  {
    id: '9',
    name: "Shruti Kabra",
    designation: "Business and Operations Manager",
    department: "Management",
    image: "/team/shruti.png",
    bio: "Shruti oversees daily operations, coordinates teams, and manages business processes. She ensures smooth workflow, organized planning, and efficient execution across all departments at MetaUpSpace."
  },
  {
    id: '7',
    name: "Saksham Jain",
    designation: "ASE (FullStack Web Development)",
    department: "Development",
    image: "/team/saksham.png",
    bio: "Saksham supports fullstack web development by building responsive features, improving performance, and contributing to reliable system architecture that enhances MetaUpSpace’s digital products."
  },
  {
    id: '11',
    name: "Harshit Saini",
    designation: "SE Intern (Frontend Web Development)",
    department: "Development",
    image: "/team/Harshit.png",
    bio: "Harshit develops responsive frontend components and user interfaces. He focuses on clean design, smooth interactions, and performance improvements that enhance MetaUpSpace’s web projects."
  },
  {
    id: '12',
    name: "Siddharth Gautam",
    designation: "SE Intern (Frontend Web Development)",
    department: "Development",
    image: "/team/siddhart.png",
    bio: "Siddharth works on frontend development, building intuitive layouts and interactive features. He supports creating fast, visually appealing, and user-centered digital experiences across various platforms."
  }
];



interface TeamSectionProps {
  className?: string;
}

const TeamSection: React.FC<TeamSectionProps> = ({ className = '' }) => {
  const activeFilter = 'All Team'; // Default filter
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});



  const filteredMembers = activeFilter === 'All Team'
    ? teamData
    : teamData.filter(member => member.department === activeFilter);

  const handleImageError = (memberId: string) => {
    setImageErrors(prev => ({ ...prev, [memberId]: true }));
  };

  return (
    <section className={`pt-6 ${className}`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

        {/* Desktop Filter Tags
        <div className="flex-wrap justify-center hidden gap-3 mb-12 lg:flex">
          {departments.map((dept) => (
            <Tag
              key={dept}
              variant={activeFilter === dept ? 'primary' : 'secondary'}
              onClick={() => setActiveFilter(dept)}
              className="transition-all duration-300"
            >
              {dept}
            </Tag>
          ))}
        </div> */}

        {/* Mobile & Tablet: Horizontal Scroll Tags */}
        {/* <div className="mb-12 lg:hidden">
          <div 
            className="px-4 -mx-4 overflow-x-auto" 
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            <div className="flex gap-3 pb-2 w-max">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActiveFilter(dept)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
                    transition-all duration-200 whitespace-nowrap flex-shrink-0
                    ${activeFilter === dept
                      ? 'bg-blue-600 text-white ring-2 ring-blue-400/50' 
                      : 'bg-gray-800/60 text-white border border-gray-600/50 hover:bg-gray-700/60'
                    }
                  `}
                >
                  <span className="text-base">{getDepartmentIcon(dept)}</span>
                  <span>{dept}</span>
                </button>
              ))}
            </div>
          </div>
        </div> */}

        {/* Team Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="relative overflow-hidden transition-all duration-500 border shadow-xl group bg-gray-900/50 backdrop-blur-sm border-gray-700/50 rounded-2xl hover:shadow-2xl hover:scale-105"
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              {/* Background Image */}
              <div className="relative overflow-hidden h-80">
                {!imageErrors[member.id] ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onError={() => handleImageError(member.id)}
                  />
                ) : (
                  /* Fallback Avatar */
                  <div className="flex items-center justify-center w-full h-full text-4xl font-bold text-white bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>

              {/* Basic Info (Visible Default) */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="mb-1 text-xl font-bold">{member.name}</h3>
                <p className="text-sm text-gray-300 line-clamp-1">{member.designation}</p>
              </div>

              {/* Hover Details (Overlay) */}
              <div className={`absolute inset-0 bg-black/90 backdrop-blur-sm transition-all duration-500 flex flex-col justify-end p-6 ${hoveredMember === member.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
                }`}>
                <div className="space-y-4 text-white">
                  <div>
                    <h3 className="mb-1 text-2xl font-bold">{member.name}</h3>
                    <p className="text-sm font-medium text-blue-400">{member.designation}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-300">{member.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
