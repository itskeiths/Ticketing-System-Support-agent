"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signinSchema } from "../../validators/auth-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { redirect, useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useToast } from "@/components/ui/use-toast";
import Dashboard from "@/app/dashboard/page";

type Input = z.infer<typeof signinSchema>;

export default function AdminLogin() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<Input>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: Input) {
    const allowedEmails = ["admin1@gmail.com", "admin2@gmail.com"];

    if (!allowedEmails.includes(data.email)) {
      toast({
        title: "Only Admins are allowed!",
        variant: "destructive",
      });
      return;
    }

    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        toast({
          title: "Sign-in successful! Redirecting to the Dashboard.",
        });
        router.push('/dashboard');
      })
      .catch((error) => {
        toast({
          title: "Oops! Something went wrong. Please try again.",
          variant: "destructive",
        });
        console.log(error);
      });
  }

  return (
    <main>
      <div className='min-h-screen'>
        <Card className="w-[350px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <CardHeader>
            <CardTitle>Admin Sign-In</CardTitle>
            <CardDescription>Sign in to access the professional Customer Care Portal.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your admin email address..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your admin password..." type="password"  {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col space-y-4">

                  <Button type="submit">Sign In</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    </main>
  );
}
