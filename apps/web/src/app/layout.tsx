import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { Navbar } from "ui";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LISTavia",
  description: "Manage your lists efficiently!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#492fb5" />
      </head>
      <body className={montserrat.className}>
        <Navbar
          username="geetsethi"
          sessions={[
            { id: "1", title: "Default Session" },
            { id: "2", title: "Session #1" },
          ]}
        />
        <div className="mx-auto max-w-2xl">{children}</div>
      </body>
    </html>
  );
}
