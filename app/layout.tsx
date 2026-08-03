import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { fontVariables , appFontClass} from "@/lib/fonts";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "LinkForge",
  description: "A Linktree-style link-in-bio builder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className={`${fontVariables} ${appFontClass} min-h-full flex flex-col`}>
        <Providers>{children}</Providers>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
