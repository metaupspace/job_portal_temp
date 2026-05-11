import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Job } from "@/types";
import Button from "@/components/button/Button";

export default function RoleCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/careers/${job.slug}`}
      className="group relative flex flex-col rounded-2xl border border-white/5 bg-[#0F1115] p-5 sm:p-6 transition-colors duration-300 hover:border-white/10 hover:bg-[#12151A]"
    >
      <p className="mb-2 sm:mb-3 text-[12px] sm:text-[13px] font-normal text-zinc-400">
        {job.domain}
      </p>
      <h3 className="mb-2 sm:mb-3 text-[15px] sm:text-[17px] font-semibold leading-snug tracking-tight text-white">
        {job.title}
      </h3>
      <p className="mb-5 sm:mb-6 text-[13px] sm:text-[14px] leading-relaxed text-zinc-400 line-clamp-3">
        {job.description}
      </p>
      <Button
        variant="primary"
        icon={<ArrowRight />}
        className="justify-center rounded-full items-center"
      >
        View Details
      </Button>
    </Link>
  );
}
