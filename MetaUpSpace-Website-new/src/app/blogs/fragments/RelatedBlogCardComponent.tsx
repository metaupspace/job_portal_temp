// components/RelatedBlogs.tsx
import React from 'react'
import RelatedBlogCard from './RelatedBlogCard'

const relatedBlogs = [
  {
    id: 1,
    title: "How Can Designers Prepare for the Future?",
    date: "Feb 7, 2024",
    image: "/blog/cover.png",
    href: "/blog/designers-future"
  },
  {
    id: 2,
    title: "The Evolution of UX Design in 2024",
    date: "Jan 15, 2024", 
   image: "/blog/cover.png",
    href: "/blog/ux-evolution"
  },
  {
    id: 3,
    title: "Building Better User Interfaces",
    date: "Dec 28, 2023",
   image: "/blog/cover.png",
    href: "/blog/better-interfaces"
  },
  {
    id: 4,
    title: "Design Systems: A Complete Guide",
    date: "Dec 10, 2023",
     image: "/blog/cover.png",
    href: "/blog/design-systems"
  }
]

export default function RelatedBlogs() {
  return (
    <div className=" rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Related Articles</h2>
      
      <div className="space-y-2">
        {relatedBlogs.map((blog) => (
          <RelatedBlogCard
            key={blog.id}
            title={blog.title}
            date={blog.date}
            image={blog.image}
            href={blog.href}
          />
        ))}
      </div>
    </div>
  )
}
