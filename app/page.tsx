import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import FeatureBento from "@/components/landing/FeatureBento";
import TemplatePreview from "@/components/landing/TemplatePreview";
import TrustBar from "@/components/landing/TrustBar";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col bg-background-primary font-(family-name:var(--font-inter)) text-primary">
      <Nav />
      <div className="flex flex-1 flex-col bg-background-primary ">
        <Hero />
        <HowItWorks />
        <FeatureBento />
        <TemplatePreview />
        <TrustBar />
        <Pricing />
      </div>
      <Footer />
    </main>
  );
}
