"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/lib/validators";
import { useEffect, useState } from "react";
import { ArrowRightIcon, LoaderCircle } from "lucide-react";
import { getUser, signUp } from "@/lib/auth";

export default function SignupPage() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      if (userData) router.push("/home");
    };
    fetchUser();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signUp(data.email, data.password, data.username);
      router.push("/home");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const goToFeed = () => {
    router.push("/home");
  };

  return (
    <div className="flex justify-center bg-blue-500 items-center h-screen">
      <Card className="w-96 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Sign Up on Socialo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-sm mb-2 mt-1">{error}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input placeholder="Username" {...register("username")} />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <Input placeholder="Email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <LoaderCircle className="animate-spin" size={15} />
              ) : (
                " Sign Up"
              )}
            </Button>
          </form>
          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>
          <Button
            onClick={goToFeed}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 flex justify-center items-center"
          >
            Go to Feed <ArrowRightIcon size={20} />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
