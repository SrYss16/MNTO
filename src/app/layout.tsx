import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Sidebar, BottomNav } from "@/components/Navigation";
import { Header } from "@/components/Header";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { ToasterProvider } from "@/components/Toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CACESA Maintenance PWA",
  description: "Progressive Web App for Industrial Maintenance Technicians at CACESA",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CACESA Maint",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased bg-industrial-base text-zinc-100 h-full flex flex-col md:flex-row micro-perforated leading-tight`}>
        <ToasterProvider>
          <ServiceWorkerRegistration />
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
            <Header />
            <main className="flex-1 px-4 sm:px-8 pt-24 pb-28 md:pb-8 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
            <BottomNav />
          </div>
        </ToasterProvider>
      </body>
    </html>
  );
}
