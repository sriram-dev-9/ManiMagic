import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ManiMagic - Create Beautiful Mathematical Animations",
  description: "Build, preview, and export stunning Manim animations right in your browser. Interactive playground with SVG support, LaTeX expressions, and real-time preview.",
  keywords: "manim, animation, mathematics, python, svg, latex, educational, visualization",
  authors: [{ name: "ManiMagic Team" }],
  creator: "ManiMagic",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/manimagiclogo.svg", type: "image/svg+xml" }
    ],
    shortcut: "/favicon.svg",
    apple: "/manimagiclogo.svg",
  },
  openGraph: {
    title: "ManiMagic - Create Beautiful Mathematical Animations",
    description: "Build, preview, and export stunning Manim animations right in your browser.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ManiMagic - Create Beautiful Mathematical Animations",
    description: "Build, preview, and export stunning Manim animations right in your browser.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


//THIS 

