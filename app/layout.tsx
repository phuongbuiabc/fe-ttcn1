import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata = {
  title: "MDFARM - Nông Nghiệp Số",
  description: "High-end agricultural management dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${manrope.variable}`}>
      <body className={`${inter.variable} ${manrope.variable} font-body bg-[#f8f9fa] text-on-background selection:bg-emerald-100 selection:text-emerald-900`}>
        <AuthProvider>
          <DashboardLayout>
            {children}
            <Footer />
          </DashboardLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
