import Image from 'next/image';
import React from 'react';

interface CardProps {
  number: string;
  title: string;
  description: string;
  showImage: boolean;
  imageUrl?: string;
  widthsize?: string;
}

const Card: React.FC<CardProps> = ({ 
  number = "01", 
  title = "Web Development", 
  description = "We create websites that are visually striking, easy to navigate, and built to represent your brand with clarity and impact. Every design is tailored from the ground up, ensuring it works seamlessly", 
  showImage, 
  imageUrl = "/mockup/tnent.png", 
  widthsize = "" 
}) => {
  return (
    <div
      className={`flex flex-col pt-[40px] pb-[47px] px-[20px] rounded-md md:px-[40px]  w-full ${widthsize} bg-[#1a1a1a]`}
    >
      {/* Text content */}
      <div>
        <p className="text-[14px] sf font-bold opacity-70">{number}</p>
        <h4 className="text-[24px] sf font-bold mt-2">{title}</h4>
        <p className=" text-[14px] md:text-[16px] pt-2  opacity-70 sf-display font-light">{description}</p>
      </div>

      {/* Image fills remaining height */}
      {showImage && (
        <div className="relative w-full flex-1 mt-4">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default Card;
