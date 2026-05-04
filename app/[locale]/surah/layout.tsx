"use client";

import React from "react";
import { SurahSidebar } from "@/components/shared/surah-sidebar";

export default function SurahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden">
      <SurahSidebar />
      <div className="flex-1 lg:ml-80 overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </div>
  );
}
