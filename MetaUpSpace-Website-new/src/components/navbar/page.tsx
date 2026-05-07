'use client';
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Button from '../button/Button'
import { ArrowRight, Menu, X } from 'lucide-react'
import List from './fragments/list'
import Link from 'next/link';
import GradientText from '@/components/ui/GradientText/GradientText';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store';

const navLinks = [
  {
    label: 'Home',
    href: '/',
    className: 'text-white hover:text-blue-400 transition-colors text-[14px] font-medium',
    gradient: false,
  },
  {
    label: 'About',
    href: '/about-us',
    className: 'text-white hover:text-blue-400 transition-colors text-[14px] font-medium',
    gradient: false,
  },
  {
    label: 'Services',
    href: '/services',
    className: 'text-white hover:text-blue-400 transition-colors text-[14px] font-medium',
    gradient: false,
  },
  // {
  //   label: 'Blogs',
  //   href: '/blogs',
  //   className: 'text-white hover:text-blue-400 transition-colors text-[14px] font-medium',
  //   gradient: false,
  // },
  {
    label: 'IRDP',
    href: '/irdp',
    className: 'text-white hover:text-blue-400 transition-colors text-[14px] font-medium',
    gradient: false,
  },
  {
    label: 'MetaUpSpace Labs',
    href: '/metaupspace-labs',
    className: 'text-white flex items-center justify-start nas hover:text-blue-400 text-left transition-colors text-[14px] font-medium',
    gradient: true,
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname();
  const isIrdp = pathname?.startsWith('/irdp');
  const isAuthenticated = useAuthStore(
    (s) => s.step === 'authenticated' && !!s.tokens.accessToken,
  );
  const ctaLabel = isAuthenticated ? 'Dashboard' : 'Contact Us';
  const ctaHref = isAuthenticated ? '/dashboard' : '/contact';
  const [isOverHero, setIsOverHero] = useState(false);
  useEffect(() => {
    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;

    if (!isIrdp) {
      setIsOverHero(false);
      return;
    }

    const observe = (el: Element) => {
      io = new IntersectionObserver(
        ([entry]) => {
          // consider the hero "over" while any part of it remains below the top of the viewport
          const stillVisible = entry.boundingClientRect.bottom > 0;
          setIsOverHero(stillVisible);
        },
        { threshold: 0 }
      );
      io.observe(el);
    };

    const tryFind = () => {
      const el = typeof document !== 'undefined' ? document.getElementById('irdp-hero') : null;
      if (el) {
        observe(el);
        return true;
      }
      return false;
    };

    if (tryFind()) {
      // observed
    } else if (typeof MutationObserver !== 'undefined') {
      mo = new MutationObserver(() => {
        if (tryFind() && mo) {
          mo.disconnect();
          mo = null;
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      if (io) io.disconnect();
      if (mo) mo.disconnect();
    };
  }, [isIrdp, pathname]);

  return (
    <div className='w-full fixed top-4 inset-x-0 flex items-center justify-center z-[9999] px-4'>
      {/* Main Navbar Container with Rounded Border */}
      <div className={`w-full max-w-6xl ${isIrdp && isOverHero ? 'bg-black/80' : 'bg-black/80'} backdrop-blur-md border border-white/20 rounded-full px-6 py-3 flex items-center justify-between`}>

        {/* Logo */}
        <Link href={"/"} className="flex-shrink-0">
          <Image
            src="/navbar/logo.svg"
            height={32}
            width={180}
            alt="MetaUpSpace Logo"
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Navigation - Center */}
        <div className="hidden xl:block">
          <List />
        </div>

        {/* Desktop CTA Button */}
        <div className="hidden xl:block">
          <Link href={ctaHref}>
            <Button
              variant='primary'
              icon={<ArrowRight />}
              className="rounded-full"
            >
              {ctaLabel}
            </Button>
          </Link>
        </div>

        {/* Mobile + Tablet Menu Button */}
        <div className="xl:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white p-2 hover:bg-white/10 rounded-full transition-colors border border-white/20"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 top-20 z-[9998] xl:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="bg-black/90 backdrop-blur-md rounded-2xl mx-4 p-6 border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={link.className}
                >
                  {link.gradient ? (
                    <GradientText className="font-bold flex items-center justify-start text-left uppercase">
                      {link.label}
                    </GradientText>
                  ) : (
                    link.label
                  )}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/20">
                <Link
                  href={ctaHref}
                  onClick={() => setIsMenuOpen(false)}
                  className="block"
                >
                  <Button
                    variant="primary"
                    icon={<ArrowRight />}
                    className="w-full justify-center rounded-full"
                  >
                    {ctaLabel}
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
