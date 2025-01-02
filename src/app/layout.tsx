import type { Metadata } from "next";
import '@/styles/globals.css';
import '@/styles/main.css';
import { WithFullWidthFlyoutMenu as Header } from '@/components/tailwind-ui/'
import KTWizFooter from "@/components/common/KTWizFooter";

export const metadata: Metadata = {
  title: "next.js prototype",
  description: "kt-wiz prototype",
  icons: {
    icon: '/icons/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="">
      <body className="flex h-full w-dvw flex-col">
        <Header />
        {children}
        <KTWizFooter/>
      </body>
    </html>
  );
}
