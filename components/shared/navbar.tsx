"use client";

import * as React from "react";
import Link from "next/link";
import { Command } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./language-switcher";

const navigationItems = [
  { key: "home", href: "/" },
  { key: "recent", href: "/recent" },
  { key: "video", href: "/video" },
];

export function Navbar() {

  const t = useTranslations("navLinks");
  const tAuth = useTranslations("auth");

  console.log("Intl navigation links: ", t("home"))

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Command className="h-6 w-6" />
            <span className="font-bold">PRIME TV</span>
          </Link>

          <nav className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.key}>
                    <NavigationMenuLink
                      asChild
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link href={item.href}>{t(item.key)}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button variant="ghost" asChild>
            <Link href="/auth/login">{tAuth("signIn")}</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">{tAuth("signUp")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
