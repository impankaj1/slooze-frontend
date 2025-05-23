import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/hoc/UserProvider";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "E-commerce",
  description: "E-commerce to buy and sell products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <ToastContainer position="top-center" autoClose={1000} />
            <main className="max-w-7xl mx-auto px-4 mb-8 sm:px-6 lg:px-8">
              <Navbar />
              <div className="flex-1 py-4 px-2">{children}</div>
            </main>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
