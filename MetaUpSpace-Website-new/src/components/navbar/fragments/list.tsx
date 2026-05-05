import React from "react";
import Link from "next/link";
import GradientText from "@/components/ui/GradientText/GradientText";

const navLinks = [
  {
    label: "Home",
    href: "/",
    className: "text-white/90 hover:text-white",
    gradient: false,
  },
  {
    label: "About",
    href: "/about-us",
    className: "text-white/90 hover:text-white",
    gradient: false,
  },
  {
    label: "Services",
    href: "/services",
    className: "text-white/90 hover:text-white",
    gradient: false,
  },
  // {
  //   label: 'Blog',
  //   href: '/blogs',
  //   className: 'text-white/90 hover:text-white',
  //   gradient: false,
  // },
  {
    label: "Careers",
    href: "/careers",
    className: "text-white/90 hover:text-white",
    gradient: false,
  },
  {
    label: "IRDP",
    href: "/irdp",
    className: "text-white/90 hover:text-white",
    gradient: true,
  },
];

export default function List() {
  return (
    <ul className="flex gap-6 lg:gap-8 font-medium items-center justify-center text-sm lg:text-[14px]">
      {navLinks.map((link) => (
        <li key={link.label} className="relative group cursor-pointer">
          <Link
            href={link.href}
            className={`inline-block transition-all duration-300 ease-out group-hover:-translate-y-0.5 whitespace-nowrap ${link.className}`}
          >
            {link.gradient ? (
              <GradientText className="nas uppercase font-bold">
                {link.label}
              </GradientText>
            ) : (
              link.label
            )}
          </Link>
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 ease-out group-hover:w-full"></div>
        </li>
      ))}
    </ul>
  );
}
