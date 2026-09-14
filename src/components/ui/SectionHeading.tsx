import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SectionHeadingProps {
  title: string;
  viewAllLink?: string;
  viewAllText?: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeading({
  title,
  viewAllLink,
  viewAllText = 'VIEW ALL PRODUCTS',
  subtitle,
  className = 'mb-8 md:mb-12',
}: SectionHeadingProps) {
  return (
    <div className={`w-full flex items-center justify-center gap-4 sm:gap-6 lg:gap-8 ${className}`}>
      {/* Left horizontal line segment */}
      <div className="flex-1 h-px bg-[#6f0c07]/10" aria-hidden="true" />

      {/* Centered Heading & Subheading Link Block */}
      <div className="flex flex-col items-center text-center flex-shrink-0 max-w-[85vw] sm:max-w-none">
        <h2 className="font-display font-black text-[26px] xs:text-[30px] sm:text-[34px] md:text-[38px] lg:text-[40px] leading-tight text-[#6f0c07] uppercase tracking-tight [text-shadow:0_0_20px_rgba(111,12,7,0.12)]">
          {title}
        </h2>

        {viewAllLink ? (
          <Link
            href={viewAllLink}
            className="mt-2 md:mt-2.5 inline-flex items-center gap-1.5 text-xs sm:text-[13px] md:text-sm font-bold uppercase tracking-wider text-[#6f0c07] hover:text-[#580a06] transition-colors group"
          >
            <span>{viewAllText}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        ) : subtitle ? (
          <span className="mt-2 md:mt-2.5 text-xs sm:text-[13px] font-semibold uppercase tracking-widest text-gray-500">
            {subtitle}
          </span>
        ) : null}
      </div>

      {/* Right horizontal line segment */}
      <div className="flex-1 h-px bg-[#6f0c07]/10" aria-hidden="true" />
    </div>
  );
}
