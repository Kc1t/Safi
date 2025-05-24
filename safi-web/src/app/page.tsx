import DestktopFeature from "@/components/landing/desktop-feature";
import FeaturesResume from "@/components/landing/features-resume";
import FeaturesStart from "@/components/landing/features-start";
import Footer from "@/components/landing/footer";
import Header from "@/components/landing/header";
import MobileCarousel from "@/components/landing/mobile-carousel";
import MobileFeature from "@/components/landing/mobile-feature";
import Navbar from "@/components/landing/navbar";
import SupportForm from "@/components/landing/support-form";
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
      <FeaturesResume />
      <SupportForm />
      <Footer />
    </div>
  );
}
