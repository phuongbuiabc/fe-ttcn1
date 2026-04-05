import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata = {
  title: "AgriIntel - Nông Nghiệp Số",
  description: "High-end agricultural management dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${manrope.variable}`}>
      <body className={`${inter.variable} ${manrope.variable} font-body bg-[#f8f9fa] text-on-background min-h-screen flex overflow-hidden selection:bg-emerald-100 selection:text-emerald-900`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-10 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            <div className="max-w-7xl mx-auto">
              {children}
              <Footer />
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
