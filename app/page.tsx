import Background from "@/components/background";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import Mockup from "@/components/landing/Mockup";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh overflow-hidden flex-col">
      <Background />
      <div className="relative z-10 mx-auto w-full max-w-7xl flex flex-col flex-1">
        <div className="px-4 sm:px-6 lg:px-8">
          <Nav />
        </div>
        <div className="px-4 sm:px-6 lg:px-8 flex-1">
          <Hero />
        </div>
      </div>

      <div className="relative z-10 w-full">
        <HowItWorks />
        <div className="hidden lg:block">
          <Mockup />
        </div>
        <Features />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
