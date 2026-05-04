"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings, Type, BookOpen, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/provider/app-provider";
import { cn } from "@/lib/utils";
import * as Accordion from "@radix-ui/react-accordion";

export function SettingsPanel() {
  const {
    arabicFontSize,
    setArabicFontSize,
    translationFontSize,
    setTranslationFontSize,
    activeFontFamily,
    setActiveFontFamily,
  } = useSettings();

  // const [activeTab, setActiveTab] = useState<"translation" | "reading">("translation");

  const fontOptions = [
    { label: "KFGQ", value: "KFGQPC Uthman Taha Naskh" },
    { label: "Amiri", value: "Amiri" },
    { label: "Scheherazade", value: "Scheherazade New" },
  ];

  const currentFontLabel = fontOptions.find(f => f.value === activeFontFamily)?.label || "KFGQ";

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
      <SheetContent className="w-[350px] sm:w-[400px] border-l border-[#1F1F1F] bg-[#0A0A0A] p-0 text-foreground">
        <SheetHeader className="p-6 border-b border-[#1F1F1F]">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              Settings
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="p-6 space-y-8">
         

          <Accordion.Root type="multiple" defaultValue={["font-settings"]} className="space-y-4">
            

            {/* Font Settings */}
            <Accordion.Item value="font-settings" className="border-b border-[#1F1F1F] pb-4">
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-between py-4 group">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-lg bg-[#111111] flex items-center justify-center group-data-[state=open]:text-primary transition-colors">
                      <Type className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold group-data-[state=open]:text-primary transition-colors">Font Settings</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-90" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="space-y-8 pt-4 pb-6">
                {/* Arabic Font Size */}
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-foreground/80">Arabic Font Size</label>
                    <span className="text-sm font-bold text-primary">{arabicFontSize}</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="range"
                      min="16"
                      max="64"
                      value={arabicFontSize}
                      onChange={(e) => setArabicFontSize(parseInt(e.target.value))}
                      className="w-full h-1 bg-[#1F1F1F] rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                    />
                  </div>
                </div>

                {/* Translation Font Size */}
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-foreground/80">Translation Font Size</label>
                    <span className="text-sm font-bold text-primary">{translationFontSize}</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="range"
                      min="12"
                      max="40"
                      value={translationFontSize}
                      onChange={(e) => setTranslationFontSize(parseInt(e.target.value))}
                      className="w-full h-1 bg-[#1F1F1F] rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                    />
                  </div>
                </div>

                {/* Arabic Font Face Selection */}
                <div className="space-y-4 pt-4">
                  <label className="text-sm font-bold text-foreground/80">Arabic Font Face</label>
                  <div className="space-y-2">
                    {fontOptions.map((font) => (
                      <button
                        key={font.value}
                        onClick={() => setActiveFontFamily(font.value)}
                        className={cn(
                          "w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                          activeFontFamily === font.value
                            ? "border-primary/40 bg-primary/5 text-primary"
                            : "border-[#1F1F1F] bg-[#111111] text-muted-foreground hover:border-[#2F2F2F]"
                        )}
                      >
                        <span className="text-sm font-bold">{font.label}</span>
                        <ChevronRight className={cn("h-4 w-4 transition-all", activeFontFamily === font.value ? "opacity-100" : "opacity-0")} />
                      </button>
                    ))}
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none">
          <div className="h-12 w-full" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
