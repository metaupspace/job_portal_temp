"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";

export default function CarouselFragment() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: true
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: true
        }
      }
    ]
  };
  return (
     <div className="slider-container">
    <Slider {...settings}>
      <div>
        <Image
          src="/career/Rectangle 97.png"
          alt="Slide 1"
          width={800}
          height={600}
          className="h-64 md:h-72 lg:h-80 w-auto"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div>
        <Image
          src="/career/Rectangle 98.png"
          alt="Slide 2"
          width={800}
          height={600}
          className="h-64 md:h-72 lg:h-80 w-auto"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div>
        <Image
          src="/career/Rectangle 99.png"
          alt="Slide 3"
          width={800}
          height={600}
          className="h-64 md:h-72 lg:h-80 w-auto"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div>
        <Image
          src="/career/Rectangle 100.png"
          alt="Slide 4"
          width={800}
          height={600}
          className="h-64 md:h-72 lg:h-80 w-auto"
          style={{ objectFit: "contain" }}
        />
      </div>
    </Slider>
    </div>
  );
}