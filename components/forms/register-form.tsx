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

import { isAlreadyAuthenticated } from "@/lib/session";
import { registerUser } from "@/services/user-service";

type RegisterFormState = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

const initialState: RegisterFormState = {
  email: "",
  first_name: "",
  last_name: "",
  password: "",
};

export function RegisterForm() {
  const router = useRouter();

  const [isSubmitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<RegisterFormState>(initialState);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSubmitting(true);

      const response = await registerUser(form);

      if (response.success) {
        router.push("/login");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <Image
          src={Logo}
          alt="Logo"
          className="mx-auto mt-2 mb-6 w-30 object-cover"
        />

        <CardTitle>Create an account</CardTitle>

        <CardDescription>
          Please fill in the information below to register.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>

                <Input
                  id="first_name"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="First name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>

                <Input
                  id="last_name"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

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
              Register
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="underline underline-offset-4"
              >
                Login
              </a>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}