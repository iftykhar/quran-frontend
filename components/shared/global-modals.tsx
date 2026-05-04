"use client";

import React, { useState, useEffect } from "react";
import { JumpToAyahModal } from "./jump-to-ayah-modal";
import { SearchModal } from "./search-modal";

export function GlobalModals() {
  const [isJumpOpen, setIsJumpOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleToggleJump = () => setIsJumpOpen(true);
    const handleToggleSearch = () => setIsSearchOpen((prev) => !prev);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("toggle-jump-modal", handleToggleJump);
    window.addEventListener("toggle-search-modal", handleToggleSearch);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("toggle-jump-modal", handleToggleJump);
      window.removeEventListener("toggle-search-modal", handleToggleSearch);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <JumpToAyahModal isOpen={isJumpOpen} onClose={() => setIsJumpOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
