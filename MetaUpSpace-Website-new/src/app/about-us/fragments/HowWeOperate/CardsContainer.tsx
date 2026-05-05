"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import Image from 'next/image';

const content = [
  {
    title: "Starting with Confidence: Risk Assessment & Blueprint Phase",
    description:
      "At MetaUpSpace LLP, we prevent costly mistakes by starting every project with our Paid Discovery Phase, the BLUEPRINT. For complex projects, a Proof of Concept or Pilot Project validates feasibility and provides a clear plan, keeping the project on track.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white rounded-lg overflow-hidden">
        <Image
          src="/hero/o1.png"
          width={400}
          height={400}
          className="h-full w-full object-cover"
          alt="Design and prototyping process"
        />
      </div>
    ),
  },
  {
    title: "Securing Certainty: Locking Down Scope and Budget",
    description:
      "With the blueprint approved, we use data-driven estimations and our Change Control System to define efforts, manage changes, and keep costs and timelines fully under control.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white rounded-lg overflow-hidden">
        <Image
          src="/hero/o2.png"
          width={400}
          height={400}
          className="h-full w-full object-cover"
          alt="Design and prototyping process"
        />
      </div>
    ),
  },
  {
    title: "From Launch to Legacy: Handover & Risk Protection",
    description:
      "The transition to live operation is handled with care. We hand over source code and documentation, and activate the Service Level Agreement to ensure guaranteed support and a smooth launch.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white rounded-lg overflow-hidden">
        <Image
          src="/hero/o3.png"
          width={400}
          height={400}
          className="h-full w-full object-cover"
          alt="Design and prototyping process"
        />
      </div>
    ),
  },
  {
    title: "Growing Through Learning: Support & Continuous Improvement",
    description:
      "Our journey continues beyond launch. Each engagement ends with a Retrospective, applying lessons learned to make future projects faster, more efficient, and more predictable.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white rounded-lg overflow-hidden">
        <Image
          src="/hero/o4.png"
          width={400}
          height={400}
          className="h-full w-full object-cover"
          alt="Design and prototyping process"
        />
      </div>
    ),
  },

];

export function CardsContainer() {
  return (
    <div className="w-full py-1 md:py-12 flex flex-col items-center justify-center">
      <StickyScroll content={content} />
    </div>
  );
}
