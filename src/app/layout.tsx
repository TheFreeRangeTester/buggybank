import type { Metadata } from "next";
import { QaRootProvider } from "@/components/qa/qa-root-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuggyBank",
  description: "Sandbox educativo para testing manual y automation"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <QaRootProvider>{children}</QaRootProvider>
      </body>
    </html>
  );
}
