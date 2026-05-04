import React, { Suspense } from "react";
import { PageReaderContainer } from "@/components/shared/page-reader-container";

export async function generateStaticParams() {
  return Array.from({ length: 604 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

export default async function QuranPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading Page {id}...</div>}>
      <PageReaderContainer id={id} />
    </Suspense>
  );
}
