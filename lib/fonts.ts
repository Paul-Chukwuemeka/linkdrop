// lib/fonts.ts
import {
  Inter,
  DM_Sans,
  Plus_Jakarta_Sans,
  Outfit,
  Cormorant_Garamond,
  Playfair_Display,
  Lora,
  DM_Serif_Display,
  Nunito,
  Quicksand,
  Pacifico,
  Righteous,
  Bebas_Neue,
  Oswald,
  Raleway,
  Space_Grotesk,
  JetBrains_Mono,
  Syne,
} from "next/font/google";
import { FontType } from "./types";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cormorant",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
});
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});
const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});
const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
});
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });

export const fonts: FontType[] = [
  { name: "Inter", font: inter },
  { name: "DM Sans", font: dmSans },
  { name: "Plus Jakarta Sans", font: plusJakarta },
  { name: "Outfit", font: outfit },
  { name: "Cormorant Garamond", font: cormorant },
  { name: "Playfair Display", font: playfair },
  { name: "Lora", font: lora },
  { name: "DM Serif Display", font: dmSerif },
  { name: "Nunito", font: nunito },
  { name: "Quicksand", font: quicksand },
  { name: "Pacifico", font: pacifico },
  { name: "Righteous", font: righteous },
  { name: "Bebas Neue", font: bebasNeue },
  { name: "Oswald", font: oswald },
  { name: "Raleway", font: raleway },
  { name: "Space Grotesk", font: spaceGrotesk },
  { name: "JetBrains Mono", font: jetbrainsMono },
  { name: "Syne", font: syne },
];




export const fontVariables = fonts.map((f) => f.font.className).join(" ");

export const landingFontClass = [dmSerif.className, dmSans.className].join(" ");

const appFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-app",
});
export const appFontClass = appFont.className;
