
import Headers from '@/components/header';
import Image from 'next/image';
import TechInfoCards from './TechInfoCards';

const techCareerData = [

    {
        title: 'Web Development',
        description: 'Design and develop fast, scalable websites.',
        image: '/irdp/techCareerSection/2.jpg',
        buttonText: '6 weeks',
        buttonClass: 'bg-gradient-to-r border-[0.5px] border-[#D96B6B] from-[#D96B6B]/60 to-[#D96B6B]/60 hover:from-[#D96B6B]/40 hover:to-[#D96B6B]/40 text-white',
    },
    {
        title: 'AI Development',
        description: 'Create intelligent systems that learn and adapt.',
        image: '/irdp/techCareerSection/3.jpg',
        buttonText: '6 weeks',
        buttonClass: 'bg-gradient-to-r border-[0.5px] border-[#D9D36B] from-[#D9D36B]/40 to-[#D9D36B]/40 hover:from-[#D9D36B]/10 hover:to-[#D9D36B]/10 text-white',
    },
];

export default function TechCareerGrid() {
    return (
        <section className="w-full  pb-12">
            <div className="max-w-8xl mx-auto px-4 md:px-8">
                <Headers
                    label="DOMAIN"
                    heading={
                        <>Where real <span className="italic playfair font-normal">tech careers</span> begin</>
                    }
                    subheading=""
                />


                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {techCareerData.map((item, idx) => {
                        const spanClass =
                            idx === techCareerData.length
                                ? 'md:col-span-2 min-h-[300px] h-[300px]'
                                : 'min-h-[300px] h-[300px]';

                        return (
                            <div
                                key={idx}
                                className={`relative rounded-2xl overflow-hidden bg-neutral-900 shadow-lg group ${spanClass}`}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover object-center transition-transform duration-300  z-0"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    priority={idx === 0}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10" />

                                {/* Bottom-left content */}
                                <div className="absolute left-6 bottom-6 md:-bottom-0 z-20  transition-all duration-300 ease-out group-hover:bottom-8">

                                    <button
                                        className={`px-6 py-1.5 rounded font-semibold mb-3 text-sm ${item.buttonClass}`}
                                    >
                                        {item.buttonText}
                                    </button>

                                    <h3 className="text-white text-xl md:text-2xl font-semibold mb-2">
                                        {item.title}
                                    </h3>

                                    <p className="text-white/80 text-sm opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 md:block hidden">
                                        {item.description}
                                    </p>
                                    <p className="text-white/80 text-sm md:hidden block">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Tilted arrow at bottom-right (points to top-right due to -rotate-45) */}
                                {/* <button
                                    aria-hidden
                                    className="absolute bottom-4 right-2 md:bottom-4 md:right-2 z-20 w-14 h-14 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white transform -rotate-45 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="w-7 h-7 md:w-10 md:h-10"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 12h14M12 5l7 7-7 7"
                                        />
                                    </svg>
                                </button> */}
                            </div>
                        );
                    })}
                </div>
            </div>
            <TechInfoCards />
        </section>
    );
}
