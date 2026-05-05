import { Suspense, lazy } from "react";
import Loader from "@/components/Loader";
const CareerHero = lazy(() => import("./fragments/Hero"));
const CarouselFragment = lazy(() => import("./fragments/Marquee"));
const WhyUs = lazy(() => import("./fragments/WhyUs"));
const SelectionProcess = lazy(() => import("./fragments/SelectionProcess"));
const OpenRoles = lazy(() => import("./fragments/Openings"));
const CareerPage = () => {
  return (
    <main>
      <Suspense fallback={<Loader />}>
        <CareerHero />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <CarouselFragment />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <WhyUs />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <SelectionProcess />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <OpenRoles />
      </Suspense>
    </main>
  );
};

export default CareerPage;
