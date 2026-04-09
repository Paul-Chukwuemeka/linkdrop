import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { fontVariables , appFontClass} from "@/lib/fonts";

export const metadata: Metadata = {
  title: "LinkForge",
  description: "A Linktree-style link-in-bio builder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${fontVariables} ${appFontClass} min-h-full flex flex-col`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
