"use client";

import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/app/lib/auth-clent";
import { ModeToggle } from "@/components/theme-button";
import { Button } from "@/components/ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { MyInput } from "@/components/ui/my-input";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const formsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Confirm password is required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const SignUpView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formsSchema>>({
    resolver: zodResolver(formsSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formsSchema>) => {
    setError(null);
    setLoading(true);

    await authClient.signUp.email(
      {
        name: data.name as string,
        email: data.email as string,
        password: data.password as string,
      },
      {
        onSuccess: () => {
          setLoading(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setLoading(false);
          setError(error.message);
        },
      }
    );
  };

  return (
    <div className="bg-background w-full flex items-center justify-center min-h-screen text-foreground">
      <div className="fixed  right-4 top-4">
        <AnimatedThemeToggler />
      </div>
      <div className="my-auto">
      <form
        className="my-auto w- border-2 bg-background max-w-md w-[50vh]  flex flex-col gap-4 px-4 py-5 rounded-2xl text-card-foreground"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="text-4xl font-medium text-center">Let&apos;s get started</h1>
        <p className="text-muted-foreground text-center ">Create a new account</p>

        <div>
        <label >Name</label>
        <MyInput className="mt-2" placeholder="John Doe" type="text" {...form.register("name")} />
        {form.formState.errors.name && (
          <p>{form.formState.errors.name.message}</p>
        )}
        </div>

        <div>
        <label >Email</label>
        <MyInput className="mt-2" type="email" placeholder="example@gmail.com" {...form.register("email")} />
        {form.formState.errors.email && (
          <p>{form.formState.errors.email.message}</p>
        )}
        </div>

        <div>
        <label >Password</label>
        <MyInput className="mt-2" type="password" placeholder="*********" {...form.register("password")} />
        {form.formState.errors.password && (
          <p>{form.formState.errors.password.message}</p>
        )}
        </div>

        <div>
        <label >Confirm Password</label>
        <MyInput className="mt-2" type="password" placeholder="*********" {...form.register("confirmPassword")} />
        {form.formState.errors.confirmPassword && (
          <p>{form.formState.errors.confirmPassword.message}</p>
        )}
        </div>

        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-3xl p-1.5"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        {error && <p>{error}</p>}

        <div className="after:border-border relative text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-card text-muted-foreground relative z-10 px-2 text-sm">
                Or continue with
            </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => {
              authClient.signIn.social({
                provider: "google",
              });
            }}
            disabled={loading}
            variant="outline"
            className="w-full"
            type="button"
          >
            <FaGoogle />
          </Button>

          <Button
            onClick={() => {
              authClient.signIn.social({
                provider: "github",
              });
            }}
            disabled={loading}
            variant="outline"
            className="w-full"
            type="button"
          >
            <FaGithub />
          </Button>
        </div>
        <div className="text-center text-sm">
                                already has an account?{" "} <Link className="underline underline-offset-4" href={"/sign-in"}> Sign in</Link>
                            </div>
      </form>
                    <div className="mt-1 text-muted-foreground *[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By signing in you agree to our{" "} <a href="#">Terms of Service</a> <a href="#">Privacy Policy </a>
        </div>
      </div>
    </div>
  );
};
