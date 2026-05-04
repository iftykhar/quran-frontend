import React from "react";
import { getPageById } from "@/lib/api";
import { QuranReader } from "./quran-reader";
import { notFound } from "next/navigation";

interface PageReaderContainerProps {
  id: string;
}

export async function PageReaderContainer({ id }: PageReaderContainerProps) {
  const pageData = await getPageById(id);

  if (!pageData) {
    notFound();
  }

  return <QuranReader initialData={pageData} id={id} type="page" />;
}
