import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/page";
import Footer from "@/components/footer";
import ConditionalCTA from "@/components/ConditinalRender";

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "MetaUpSpace",
  description:
    "MetaUpSpace is an AI-first digital agency specializing in next-gen websites, AI development, and premium app experiences—designed for ambitious brands that want to scale fast.",
  icons: {
    icon: "/fav.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfairDisplay.variable} dark antialiased flex flex-col  items-center justify-center  bg-[#000103] w-full `}>
        <div className="w-full">
        <Navbar/>
        {children}
        {/* <ConditionalCTA/> */}
        <Footer/>
        </div>
      </body>
    </html>
  );
}
