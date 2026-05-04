import { Suspense } from "react"; 
import { JuzReaderContainer } from "@/components/ayah/juz-reader-container";

export async function generateStaticParams() {
  return Array.from({ length: 30 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

export default async function JuzPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading Juz {id}...</div>}>
      <JuzReaderContainer id={id} />
    </Suspense>
  );
}
