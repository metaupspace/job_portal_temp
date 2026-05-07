import { Suspense } from "react"
import Loader from "@/components/Loader"
import JobDetails from "./fragments/JobDetails"

interface Props {
  params: Promise<{ jobId: string }>
}

export default async function JobDetailsPage({ params }: Props) {
  const { jobId } = await params
  return (
    <Suspense fallback={<Loader />}>
      <JobDetails jobId={jobId} />
    </Suspense>
  )
}
