"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TagForProjectandBlogCard from "./TagForProjectandBlogCard";

interface BlogCardProps {
  image: string;
  tags?: string[];
  title: string;
  excerpt?: string;
  className?: string;
  id?: string;
  isClickable?: boolean; // New prop
}

const ProjectandBlogCard: React.FC<BlogCardProps> = ({
  image,
  tags = [],
  title,
  excerpt,
  className = "",
  id,
  isClickable = true, // Default to true
}) => {
  const pathname = usePathname();

  // Common inner content
  const cardContent = (
    <>
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
          sizes="490px"
        />
      </div>

      {/* Content Section */}
      <div className="py-4 px-2">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <TagForProjectandBlogCard key={index}>{tag}</TagForProjectandBlogCard>
            ))}
          </div>
        )}
        <h3 className="text-white font-bold mb-3 leading-tight hover:text-white/70 text-[20px] transition-colors">
          {title}
        </h3>
        {excerpt && <p className="text-white/70 text-sm leading-relaxed">{excerpt}</p>}
      </div>
    </>
  );

  const containerClasses = `max-w-[420px] bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 block ${className}`;

  // If clickable, wrap in Link. If not, use Div.
  if (isClickable) {
    return (
      <Link
        href={`${pathname}/${id}`}
        className={`${containerClasses} cursor-pointer`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={`${containerClasses} cursor-default`}>
      {cardContent}
    </div>
  );
};

export default ProjectandBlogCard;
