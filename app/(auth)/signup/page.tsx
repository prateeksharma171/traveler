/** @format */

"use client";

import { signIn } from "next-auth/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaGithub, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import { ArrowRight } from "lucide-react";
import { signUp } from "@/app/api/system/signup";
import { Input } from "@/components/ui/input";

const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<
    "none" | "signup" | "google" | "github"
  >("none");

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is Required"),
    email: Yup.string().email("Invalid email").required("Email is Required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is Required"),
  });

  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage =
    error === "OAuthAccountNotLinked"
      ? "An account already exists with this email. Please sign in using the originally used provider."
      : null;

  const handleSubmit = async (values: typeof initialValues) => {
    setLoading("signup");
    try {
      const res = await signUp(values);
      const { status, error } = res;

      if (status !== 201) {
        toast.error(error || "Signup failed!");
        return;
      }

      toast.success("Signed up successfully!");
      router.replace("/signin");
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Something went wrong!");
    } finally {
      setLoading("none");
    }
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5f8cab] via-gray-700 to-gray-900 flex">
      {/* Left side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5f8cab]/90 to-[#5f8cab]/90 z-10"></div>
        <div
          className="w-full h-full bg-cover bg-center relative"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
          }}
        >
          <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Traveler</h1>
              <button
                onClick={() => router.push("/")}
                className="text-white/90 hover:text-white flex items-center cursor-pointer gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <span className="text-sm">Back to website</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="text-white">
              <h2 className="text-5xl font-bold mb-4 leading-tight">
                Welcome,
                <br />
                Let&apos;s Get Started
              </h2>
              <div className="flex gap-2 mt-8">
                <div className="w-8 h-1 bg-white rounded-full"></div>
                <div className="w-8 h-1 bg-white/40 rounded-full"></div>
                <div className="w-8 h-1 bg-white/40 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create your account
            </h1>
            <p className="text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/signin")}
                className="text-[#5f8cab] hover:text-[#abc3d3] underline transition-colors cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-6">
              <div>
                <Field
                  as={Input}
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-[#5f8cab] focus:ring-[#5f8cab]"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  as={Input}
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-[#5f8cab] focus:ring-[#5f8cab]"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              <div className="relative">
                <Field
                  as={Input}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-[#5f8cab] focus:ring-[#5f8cab] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              <Button
                type="submit"
                disabled={loading !== "none"}
                className="w-full bg-[#5f8cab] hover:bg-[#abc3d3] cursor-pointer text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {loading === "signup" && (
                  <ImSpinner2 className="animate-spin mr-2 inline-block" />
                )}
                Sign Up
              </Button>
            </Form>
          </Formik>

          {/* Social login */}
          <div className="mt-8">
            <div className="text-center mb-4">
              <span className="text-gray-400 text-sm">Or sign up with</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={async () => {
                  setLoading("google");
                  try {
                    await signIn("google", { callbackUrl: "/traveler/trips" });
                  } catch {
                    toast.error("Google sign-up failed");
                    setLoading("none");
                  }
                }}
                disabled={loading !== "none"}
                variant="outline"
                className="bg-gray-800/50 border-gray-700 text-white hover:text-white hover:bg-gray-700 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading === "google" ? (
                  <ImSpinner2 className="animate-spin w-5 h-5" />
                ) : (
                  <FaGoogle className="w-5 h-5" />
                )}
                Google
              </Button>
              <Button
                onClick={async () => {
                  setLoading("github");
                  try {
                    await signIn("github", { callbackUrl: "/traveler/trips" });
                  } catch {
                    toast.error("GitHub sign-up failed");
                    setLoading("none");
                  }
                }}
                disabled={loading !== "none"}
                variant="outline"
                className="bg-gray-800/50 border-gray-700 text-white hover:text-white hover:bg-gray-700 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading === "github" ? (
                  <ImSpinner2 className="animate-spin w-5 h-5" />
                ) : (
                  <FaGithub className="w-5 h-5" />
                )}
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
