import ChatbotWidget from "@/components/landing/chatbot-widget";
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
      <ChatbotWidget />
      <Header />
      <FeaturesStart />
      {/* <div className="w-full flex items-center justify-center px-4 md:px-8">
      <hr className="w-6xl my-8" />
      </div> */}
      <DestktopFeature />
      {/* <MobileFeature /> */}
      <MobileCarousel />
      <FeaturesResume />
      <SupportForm />
      <Footer />
    </div>
  );
}
