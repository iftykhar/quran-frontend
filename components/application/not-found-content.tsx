
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NotFoundContent() {
  const t = useTranslations("notFound");

  return (
    <div className="bg-[#F8F9FE] min-h-screen relative overflow-hidden">
      <div className="container">
        <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6 text-center">
          <h1 className="absolute text-[220px] font-extrabold tracking-tighter text-[#E9ECF9] select-none md:text-[300px]">
            404
          </h1>

          <div className="relative z-10 flex flex-col items-center gap-12 max-w-200">
            <div className="relative h-62.5 w-62.5 md:h-75 md:w-75">
              <Image
                src="/images/panda.png"
                alt="Fuzzy rainbow monster reading a book"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Text Content */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#1A1A1D] sm:text-4xl">
                {t("title")}
              </h2>
              <p className="mx-auto max-w-125 text-sm text-muted-foreground sm:text-base">
                {t("description")}
              </p>
            </div>

            {/* Action Button - Pill style with Arrow icon */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-[#5E627B]/20 px-8 py-6 text-[#1A1A1D] hover:bg-[#F0F2F9] gap-2"
            >
              <Link href="/">
                {t("button")}
                <ArrowRight className="h-4 w-4 text-[#5E627B]" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}