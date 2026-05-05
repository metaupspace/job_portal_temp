import Image from 'next/image';
import React from 'react';

interface ServiceCardProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  className?: string;
  stepNumber?: string;
  proTip?: string;
}

const SelectionCard: React.FC<ServiceCardProps> = ({
  title = "Resume screening",
  description = "The process begins by getting out what's in your head, out of your head. We give you 100% clarity after taking short interviews, researching your ICP, building a brand story and other assets, helping you gain crystal clarity about your brand's content direction",
  imageUrl = "/hero/project.png",
  stepNumber = "01",
  proTip = "Pro Tip: Make sure to provide Live links of your projects",
  className = ""
}) => {
  return (
    <div className="min-w-[90vw] flex justify-center items-center">
      <div className={`w-full max-w-6xl h-auto p-4 md:p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12 ${className}`}>
        {/* Left side - Just the Image */}
        <div className="w-full lg:w-[40%] flex justify-center items-center">
          <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl">
            <Image
            width={300}
            height={210}
              src={imageUrl}
              alt="Project mockup"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Right side - Number, Heading, Description, Pro Tip */}
        <div className="w-full lg:w-[60%] text-white space-y-4 md:space-y-6 flex flex-col justify-center">
          {/* Large Step Number - Hidden on Mobile */}
          <div className=" mb-4">
            <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-white/20 leading-none">
              {stepNumber}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight text-white mb-3 md:mb-4">
            {title}
          </h2>

          {/* Description */}
          <p className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed mb-4 md:mb-6">
            {description}
          </p>

          {/* Pro Tip Badge */}
          {proTip && (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-500 text-black px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium w-fit">
              {proTip}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectionCard;
