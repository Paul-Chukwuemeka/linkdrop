import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import TemplatePreview from "@/components/landing/TemplatePreview";
import TrustBar from "@/components/landing/TrustBar";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col bg-background-primary font-(family-name:var(--font-inter)) text-primary">
      <Nav />
      <div className="flex flex-1 flex-col bg-background-primary ">
        <Hero />
        <HowItWorks />
        <TemplatePreview />
        <TrustBar />
      </div>
      <Footer />
    </main>
  );
}
