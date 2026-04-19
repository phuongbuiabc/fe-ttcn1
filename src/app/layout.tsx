import { Roboto } from "next/font/google";
import "./globals.css";
import { DashboardLayout } from "@/widgets/layout/DashboardLayout";
import { AuthProvider } from "@/shared/components/AuthProvider";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-roboto",
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
    <html lang="vi" className={`${roboto.variable}`}>
      <body className={`${roboto.variable} font-body bg-[#f8f9fa] text-on-background selection:bg-emerald-100 selection:text-emerald-900`}>
        <AuthProvider>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

