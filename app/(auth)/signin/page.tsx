/** @format */

"use client";

import { signIn } from "next-auth/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ArrowRight } from "lucide-react";

const SignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<
    "none" | "signup" | "google" | "github"
  >("none");

  const initialValues = {
    email: "",
    password: "",
    remember: false,
  };

  const validationSchema = Yup.object({
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
    toast.dismiss();
    setLoading("signup");
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        remember: values.remember ? "true" : "false",
      });

      if (res?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Signed in successfully!");
        router.replace("/traveler/trips");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
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
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h1 className="text-3xl font-bold tracking-wider">Traveler</h1>
              </div>
              <button
                onClick={() => router.push("/")}
                className="text-white/90 hover:text-white flex items-center gap-2 px-4 py-2 cursor-pointer rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <span className="text-sm">Back to website</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="text-white">
              <h2 className="text-5xl font-bold mb-4 leading-tight">
                Welcome Back,
                <br />
                Let&apos;s Continue
              </h2>

              {/* Progress indicators */}
              <div className="flex gap-2 mt-8">
                <div className="w-8 h-1 bg-white/40 rounded-full"></div>
                <div className="w-8 h-1 bg-white rounded-full"></div>
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
              Access your account
            </h1>
            <p className="text-gray-400">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => router.push("/signup")}
                className="text-[#5f8cab] hover:text-[#abc3d3] underline transition-colors cursor-pointer"
              >
                Sign up
              </button>
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Email field */}
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

                {/* Password field */}
                <div className="relative">
                  <Field
                    as={Input}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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

                {/* Remember me checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={values.remember}
                    onCheckedChange={(checked: boolean) =>
                      setFieldValue("remember", checked)
                    }
                    className="border-gray-300 data-[state=checked]:bg-[#5f8cab] data-[state=checked]:border-[#5f8cab]"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-400">
                    Remember Me
                  </label>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={loading !== "none"}
                  className="w-full bg-[#5f8cab] hover:bg-[#abc3d3] cursor-pointer text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {loading === "signup" ? (
                    <ImSpinner2 className="animate-spin mr-2 inline-block" />
                  ) : null}
                  Sign In
                </Button>
              </Form>
            )}
          </Formik>

          {/* Social login */}
          <div className="mt-8">
            <div className="text-center mb-4">
              <span className="text-gray-400 text-sm">Or sign in with</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={async () => {
                  setLoading("google");
                  try {
                    await signIn("google", { callbackUrl: "/traveler/trips" });
                  } catch (err) {
                    toast.error("Google sign-in failed", err!);
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
                  } catch (err) {
                    toast.error("GitHub sign-in failed", err!);
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

export default SignIn;
