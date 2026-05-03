import { RegisterForm } from "@/components/auth/signup-form";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sign Up | Super Lighting BD",
  description: "Best Lighting Service Provider in Bangladesh",
};

export default function page() {
  return (
    <div>
      <RegisterForm />
    </div>
  );
}
