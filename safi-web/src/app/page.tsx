import DestktopFeature from "@/components/landing/desktop-feature";
import FeaturesStart from "@/components/landing/features-start";
import Header from "@/components/landing/header";
import MobileCarousel from "@/components/landing/mobile-carousel";
import MobileFeature from "@/components/landing/mobile-feature";
import Navbar from "@/components/landing/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Header />
      <FeaturesStart />
      <DestktopFeature />
      {/* <MobileFeature /> */}
      <MobileCarousel />
    </div>
  );
}
