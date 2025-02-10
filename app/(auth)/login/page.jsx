"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/lib/validators";
import { useEffect, useState } from "react";
import { getUser, signIn } from "@/lib/auth";
import { LoaderCircle } from "lucide-react";
import { ArrowRightIcon } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
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
      await signIn(data.email, data.password);
      router.push("/home");
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const goToFeed = () => {
    router.push("/home");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-500">
      <Card className="w-96 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Log in to Socialo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-sm mb-2 mt-1">{error}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                "Login"
              )}
            </Button>
          </form>
          <p className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => router.push("/signup")}
            >
              Sign up
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
