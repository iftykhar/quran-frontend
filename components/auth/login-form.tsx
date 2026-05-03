"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const loginFormSchema = z.object({
  email: z
    .string()
    .email("Invalid email address.")
    .min(1, "Email is required."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const tAuth = useTranslations("auth");

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      setIsLoading(true);
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl,
      });

      if (response?.ok && !response.error) {
        toast.success("Login successful!");
        router.push(callbackUrl || "/");
      } else {
        toast.error(response?.error || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-between bg-primary/20 rounded-2xl h-auto lg:h-150 overflow-hidden">
          {/* Left section */}
          <div className="hidden lg:flex w-full lg:w-[45%] bg-primary text-white flex-col justify-center items-center rounded-t-2xl lg:rounded-tr-[100px] lg:rounded-br-[100px] lg:rounded-tl-2xl lg:rounded-bl-2xl py-8 lg:py-0">
            <div className="text-center">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5EDE2] mb-4">
                {tAuth("welcomeBack")}
              </h3>
              <p className="text-base sm:text-lg lg:text-xl font-semibold text-[#F5EDE2] mb-6">
                {tAuth("donthaveAcc")}
              </p>
              <Link href="/auth/signup">
                <Button className="px-8 py-3 border border-[#F5EDE2] text-base font-semibold hover:bg-[#F5EDE2] hover:text-primary">
                  {tAuth("register")}
                </Button>
              </Link>
            </div>
          </div>
          {/* Right section */}
          <div className="flex flex-col justify-center w-full lg:w-[55%] py-8 px-4 sm:px-6 lg:px-10">
            <div className="w-full max-w-md mx-auto space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary text-center">
                {tAuth("signIn")}
              </h2>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">
                          {tAuth("email")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={`${tAuth("enterEmail")}`}
                            {...field}
                            className="h-10 sm:h-12 text-sm sm:text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">
                          {tAuth("password")}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder={`${tAuth("enterPassword")}`}
                              {...field}
                              className="h-10 sm:h-12 text-sm sm:text-base"
                            />
                            <button
                              type="button"
                              className="absolute top-1/2 right-4 transform -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <Eye className="h-5 w-5" />
                              ) : (
                                <EyeOff className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-center">
                    <Link
                      href="/forgot-password"
                      className="text-xs sm:text-sm text-[#0a1155] hover:underline"
                    >
                      {tAuth("forgotPassword")}
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/90 text-sm sm:text-base font-bold text-white cursor-pointer"
                  >
                    {isLoading ? "Logging in..." : tAuth("signIn")}
                  </Button>
                </form>
              </Form>

              {/* Mobile-only Register Link */}
              <div className="lg:hidden text-center mt-4">
                <p className="text-sm text-primary mb-2">
                  {tAuth("donthaveAcc")}
                </p>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    className="px-6 py-2 border-primary text-primary hover:bg-primary hover:text-white text-sm cursor-pointer"
                  >
                    {tAuth("register")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
