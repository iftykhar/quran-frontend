import Link from "next/link";
import { Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const tFooter = useTranslations("footer");

  const socialLinks = tFooter.raw("social") as Array<{
    name: string;
    href: string;
  }>;

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Command className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight uppercase">
                {tFooter("brandName")}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-75">
              {tFooter("description")}
            </p>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">
                {tFooter("newsletter.title")}
              </h4>
              <div className="flex max-w-[320px] items-center space-x-2">
                <Input
                  type="email"
                  placeholder={tFooter("newsletter.placeholder")}
                  className="h-9"
                />
                <Button size="sm" type="submit">
                  {tFooter("newsletter.button")}
                </Button>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8 grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/70">
                {tFooter("sections.product")}
              </h4>
              {(
                tFooter.raw("links.product") as Array<{
                  name: string;
                  href: string;
                }>
              ).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/70">
                {tFooter("sections.company")}
              </h4>
              {(
                tFooter.raw("links.company") as Array<{
                  name: string;
                  href: string;
                }>
              ).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/70">
                {tFooter("sections.legal")}
              </h4>
              {(
                tFooter.raw("links.legal") as Array<{
                  name: string;
                  href: string;
                }>
              ).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="mt-12 pt-8 border-t flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            {tFooter("copyright", { year: currentYear })}
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
