"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/provider/app-provider";
import { Separator } from "@/components/ui/separator";

export function SettingsPanel() {
  const {
    arabicFontSize,
    setArabicFontSize,
    translationFontSize,
    setTranslationFontSize,
    activeFontFamily,
    setActiveFontFamily,
  } = useSettings();

  const fontOptions = [
    { label: "Uthman Taha Naskh", value: "KFGQPC Uthman Taha Naskh" },
    { label: "Amiri", value: "Amiri, serif" },
    { label: "Scheherazade", value: "Scheherazade New, serif" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-muted/50 text-muted-foreground hover:text-primary transition-all"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[350px] sm:w-[400px] border-l border-border bg-card">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Settings
          </SheetTitle>
          <SheetDescription>
            Customize your reading experience.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          {/* Arabic Font Family */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-foreground">Arabic Font</label>
            <div className="grid grid-cols-1 gap-2">
              {fontOptions.map((font) => (
                <button
                  key={font.value}
                  onClick={() => setActiveFontFamily(font.value)}
                  className={`px-4 py-3 text-sm text-left rounded-xl border transition-all ${
                    activeFontFamily === font.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-muted/20 text-muted-foreground hover:border-muted-foreground/50"
                  }`}
                >
                  <span className="block font-semibold">{font.label}</span>
                  <span className="block font-quran text-lg mt-1" style={{ fontFamily: font.value }}>
                    ??????? ??????
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Arabic Font Size */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-foreground">Arabic Font Size</label>
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{arabicFontSize}px</span>
            </div>
            <input
              type="range"
              min="16"
              max="64"
              value={arabicFontSize}
              onChange={(e) => setArabicFontSize(parseInt(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Translation Font Size */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-foreground">Translation Font Size</label>
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{translationFontSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="40"
              value={translationFontSize}
              onChange={(e) => setTranslationFontSize(parseInt(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
