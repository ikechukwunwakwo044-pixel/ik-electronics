import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const sans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "IK Electronics and Gadgets",
    template: "%s | IK Electronics",
  },
  description:
    "Shop electronics, TVs, kitchen appliances, home entertainment, gadgets, and office equipment from IK Electronics and Gadgets.",
  openGraph: {
    title: "IK Electronics and Gadgets",
    description:
      "Premium electronics, appliances, gadgets, and combo deals for homes and offices.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} antialiased`}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
