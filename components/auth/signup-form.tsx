"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const registerFormSchema = z.object({
  fullname: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  city: z.string(),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    const responseData = await response.json();

    if (!responseData.success) {
      toast.error(`${responseData.message.message}`);
    }

    if (responseData.success) {
      toast.success(`${responseData.message}. Check email to verify account.`);
      router.push("/login");
    }

    setIsLoading(false);
  }

  const tAuth = useTranslations("auth");

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row justify-between bg-primary/20 rounded-2xl h-auto overflow-hidden shadow-lg">
          <div className="flex flex-col justify-center w-full lg:w-1/2 px-4 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary">
                {tAuth("registration")}
              </h1>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 mt-6"
              >
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        {tAuth("fullName")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={tAuth("enterFullName")}
                          disabled={isLoading}
                          className="h-10 sm:h-12 rounded-md text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

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
                          {...field}
                          type="email"
                          placeholder={`${tAuth("enterEmail")}`}
                          disabled={isLoading}
                          className="h-10 sm:h-12 rounded-md text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
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
                        <Input
                          {...field}
                          type="password"
                          placeholder={`${tAuth("createPassword")}`}
                          disabled={isLoading}
                          className="h-10 sm:h-12 rounded-md text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/90 text-sm sm:text-base font-semibold text-white rounded-md"
                >
                  {isLoading ? "Loading" : `${tAuth("register")}`}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center block md:hidden">
              <Link href="/login">
                <Button className="px-6 py-2 sm:px-8 sm:py-3 border border-primary/20 text-sm sm:text-base font-semibold text-white hover:bg-primary/20  rounded-md">
                  {tAuth("signIn")}
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex w-full lg:w-[45%] bg-primary text-white flex-col justify-center items-center rounded-t-2xl lg:rounded-tl-[100px] lg:rounded-bl-[100px] lg:rounded-tr-2xl lg:rounded-br-2xl py-8">
            <div className="text-center px-6">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                {tAuth("welcomeBack")}
              </h3>
              <p className="text-sm sm:text-base lg:text-lg font-medium text-white mb-6">
                {tAuth("haveAcc")}
              </p>
              <Link href="/auth/login">
                <Button className="px-6 py-2 sm:px-8 sm:py-3 border border-white text-sm sm:text-base font-semibold  hover:bg-white hover:text-primary text-white rounded-md">
                  {tAuth("signIn")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
