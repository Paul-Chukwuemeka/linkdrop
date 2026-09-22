import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import ThemeWall from "@/components/landing/ThemeWall";
import HowItWorks from "@/components/landing/HowItWorks";
import FeatureStickers from "@/components/landing/FeatureStickers";
import Pricing from "@/components/landing/Pricing";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";
import { landingFontClass } from "@/lib/fonts";

export default function Home() {
  return (
    <div
      className={`${landingFontClass} paper-grain min-h-dvh bg-background-primary font-[family-name:var(--font-dm-sans)] text-brand-green`}
    >
      <Nav />
      <main>
        <Hero />
        <ThemeWall />
        <HowItWorks />
        <FeatureStickers />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
