import { Suspense } from "react"
import Loader from "@/components/Loader"
import ApplyForm from "./ApplyForm"

interface Props {
  params: Promise<{ jobId: string }>
}

export default async function ApplyPage({ params }: Props) {
  const { jobId } = await params
  return (
    <Suspense fallback={<Loader />}>
      <ApplyForm jobId={jobId} />
    </Suspense>
  )
}
