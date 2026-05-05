'use client';

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Update these imports to match your actual file types (png/svg/jpg) in the /icons/ folder
// Assuming they are named 1.png, 2.png, etc. based on your image.
const logos = [
    { name: "Logo 1", image: "/icons/1.png" },
    { name: "Logo 2", image: "/icons/2.png" },
    { name: "Logo 3", image: "/icons/3.png" },
    { name: "Pharmansh", image: "/icons/4.png" },
    { name: "Neural Mind Atlas", image: "/icons/5.png" },
    { name: "Startup India", image: "/icons/6.png" },
    { name: "Byte Blogger Base", image: "/icons/7.png" },
];

export default function LogoTicker() {
    return (
        <section className="py-8 overflow-hidden w-full h-[100px] ">
            <div className="relative">
                <div className="flex [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                    <motion.div 
                        animate={{ x: "-50%" }}
                        transition={{
                            duration: 25,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                        className="flex gap-20 pr-20"
                    >
                        {/* Duplicate the list to create the seamless infinite scroll effect */}
                        {Array.from({ length: 2 }, (_, i) => (
                            <React.Fragment key={i}>
                                {logos.map((logo, index) => (
                                    <div key={`${i}-${index}`} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <Image 
                                            src={logo.image} 
                                            alt={logo.name}
                                            width={100} // You may need to adjust this width based on your actual image dimensions
                                            height={40} // And height to maintain aspect ratio
                                            className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                                        />
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
