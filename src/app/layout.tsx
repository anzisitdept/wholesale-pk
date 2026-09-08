import type { Metadata } from "next";
import { Josefin_Sans, Abril_Fatface } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { StoreDataProvider } from "@/context/StoreDataContext";
import CartDrawer from "@/components/cart/CartDrawer";
import CheckoutModal from "@/components/cart/CheckoutModal";
import SearchModal from "@/components/layout/SearchModal";

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
});

const abrilFatface = Abril_Fatface({
  weight: "400",
  variable: "--font-abril-fatface",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wholesaler-PK | Premium Products & Everyday Essentials",
  description: "Wholesaler-PK brings you premium quality products and everyday essentials at the best prices, delivered across Pakistan.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${josefinSans.variable} ${abrilFatface.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col font-sans bg-white" suppressHydrationWarning>
        <StoreDataProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <CheckoutModal />
            <SearchModal />
          </CartProvider>
        </StoreDataProvider>
      </body>
    </html>
  );
}
