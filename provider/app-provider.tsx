"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  const pathname = usePathname();
  const currentLocale = useLocale();

  const hideNavAndFooter = [`/${currentLocale}/auth/login`, `/${currentLocale}/auth/signup`]

  return (
    <QueryClientProvider client={queryClient}>
      {!hideNavAndFooter.includes(pathname) && <Navbar />}
      {children}
      {!hideNavAndFooter.includes(pathname) && <Footer />}
    </QueryClientProvider>
  );
}
