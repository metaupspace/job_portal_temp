"use client"
import React from 'react';
import { Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Works', href: '/services/works' },
    { name: 'Testimonials', href: '/#testimonials' },
    { name: 'IRDP', href: '/irdp' },
    { name: 'Contact', href: '/contact' },
  ];

  const policyItems = [
    { name: 'Privacy Policy', href: '/policies#privacy-policy' },
    { name: 'Terms & Condition', href: '/policies#terms-and-conditions' },
    { name: 'Terms of Service', href: '/policies#terms-of-service' },
  ];

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/metaupspace', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/metaupspace', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/metaupspace', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-black/70 sf  text-white  flex w-full mt-8 flex-col justify-between pb-8 px-5  md:px-8 lg:px-12 pt-8">
      {/* Top Section (hidden on IRDP routes) */}
      { (
        <div className="w-full">
          {/* Header with CTA and Social Icons */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3 md:mb-6">
          <h1 className="text-xl md:text-2xl lg:text-3xl sf xl:text-4xl font-bold mb-3 lg:mb-0 leading-tight">
            Let&apos;s talk. We&apos;d love to hear from you.
          </h1>
          
          {/* Social Icons */}
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 md:w-12 md:h-12 border border-white/20 rounded-full flex items-center justify-center hover:border-white/40 hover:bg-white/5 transition-colors duration-200"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
            ))}
          </div>
        </div>
          {/* Navigation Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-16">
  {/* Menu Column */}
  <div>
    <h3 className="text-lg font-semibold mb-4 text-gray-300">Menu</h3>
    <nav className="space-y-3">
      {menuItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="block text-white text-[14px] hover:text-gray-300 transition-colors duration-200"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  </div>

  {/* Policies Column */}
  <div>
    <h3 className="text-lg font-semibold mb-4 text-gray-300">Policies</h3>
    <nav className="space-y-3">
      {policyItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="block text-white text-[14px] hover:text-gray-300 transition-colors duration-200"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  </div>


          </div>
        </div>
      )}

      {/* Center Logo */}
      <div className="flex-1 flex items-end justify-end w-full my-3 md:my-6">
        <div className="text-right h-[100px] ">
          <Image src={"/navbar/logo.svg"} width={100} height={200} className='w-full h-full object-contain' alt='MetaUpSpace'/>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-8 border-t border-white/10">
        <div className="text-gray-400 text-sm md:text-base order-2 md:order-1 mt-4 md:mt-0">
          Made with love by MetaUpSpace team
        </div>
        
        <div className="text-gray-400 text-sm md:text-base order-1 md:order-2">
          © 2025 MetaUpSpace. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
