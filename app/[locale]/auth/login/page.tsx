import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login | Super Lighting BD",
  description: "Best Lighting Service Provider in Bangladesh",
};

export default function page() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
