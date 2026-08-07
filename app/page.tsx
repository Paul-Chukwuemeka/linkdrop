import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import TrustBar from "@/components/landing/TrustBar";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col bg-background-primary font-[family-name:var(--font-inter)] text-primary">
      <Nav />
      <div className="flex flex-1 flex-col">
        <Hero />
        <HowItWorks />
        <TrustBar />
      </div>
      <Footer />
    </main>
  );
}
