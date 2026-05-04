"use client";

import React, { useState, useEffect } from "react";
import { Rocket, Bell, Sparkles, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppsPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Target date: 30 days from now
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const CountdownItem = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center group">
      <div className="relative w-20 h-24 sm:w-28 sm:h-32 flex items-center justify-center bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-primary/30 group-hover:shadow-primary/10 overflow-hidden">
        {/* Animated Glow */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter drop-shadow-lg z-10">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="mt-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 group-hover:text-primary transition-colors">
        {label}
      </span>
    </div>
  );

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

      {/* Content Header */}
      <div className="max-w-4xl w-full text-center space-y-8 z-10">
        

        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
              Upcoming
            </span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto font-medium leading-relaxed">
            We are building a suite of powerful tools to enhance your Quranic study experience. Stay tuned for the revolution.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 py-12 animate-in fade-in zoom-in duration-1000 delay-300">
          <CountdownItem value={timeLeft.days} label="Days" />
          <CountdownItem value={timeLeft.hours} label="Hours" />
          <CountdownItem value={timeLeft.minutes} label="Minutes" />
          <CountdownItem value={timeLeft.seconds} label="Seconds" />
        </div>

       
      </div>
    </div>
  );
}