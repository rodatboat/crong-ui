"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

import Logo from "@/assets/cron_logo.png";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  createSession,
  isAlreadyAuthenticated,
} from "@/lib/session";
import { loginUser } from "@/services/user-service";

type LoginFormState = {
  email: string;
  password: string;
};

const initialState: LoginFormState = {
  email: "",
  password: "",
};

export function LoginForm() {
  const router = useRouter();

  const [isSubmitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<LoginFormState>(initialState);

  useEffect(() => {
    if (isAlreadyAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const response = await loginUser(form);

      if (response.success) {
        createSession(response.data.token);
        router.push("/");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <Image
          src={Logo}
          alt="Logo"
          className="mx-auto mt-2 mb-6 w-30 object-cover"
        />

        <CardTitle>Login</CardTitle>

        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Password"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full cursor-pointer"
            >
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              Login
            </Button>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <a
                href="/register"
                className="underline underline-offset-4"
              >
                Sign up
              </a>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}