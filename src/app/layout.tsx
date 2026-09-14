import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { StoreDataProvider } from "@/context/StoreDataContext";
import { AuthProvider } from "@/context/AuthContext";
import CartDrawer from "@/components/cart/CartDrawer";
import CheckoutModal from "@/components/cart/CheckoutModal";
import SearchModal from "@/components/layout/SearchModal";
import AuthModal from "@/components/auth/AuthModal";
import ProductQuickViewModal from "@/components/products/ProductQuickViewModal";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
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
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col font-sans bg-[#ffffff] text-[#1a1a1a]" suppressHydrationWarning>
        <AuthProvider>
          <StoreDataProvider>
            <CartProvider>
              {children}
              <CartDrawer />
              <CheckoutModal />
              <SearchModal />
              <AuthModal />
              <ProductQuickViewModal />
            </CartProvider>
          </StoreDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
