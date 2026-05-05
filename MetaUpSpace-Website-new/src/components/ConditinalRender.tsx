"use client";

import { usePathname } from "next/navigation";
import FinalCTA from "@/components/FinalCTA";

export default function ConditionalCTA() {
  const pathname = usePathname();

  // If the path starts with /metaupspace-labs, don't render FinalCTA
  if (pathname.startsWith("/metaupspace-labs"))  {
    return null;
  }

  return <FinalCTA />;
}
