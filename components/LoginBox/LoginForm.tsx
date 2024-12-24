"use client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn, validateEmail } from "@/lib/utils";
import { signInWithEmail } from "@/lib/supabase/auth";

export default function SignInForm() {
  const router = useRouter();

  const onSignInByEmail = async () => {
    const emailAddress = document.getElementById(
      "emailAddress"
    ) as HTMLInputElement;
    const loggingPassword = document.getElementById(
      "loggingPassword"
    ) as HTMLInputElement;
    if (!validateEmail(emailAddress.value)) {
      toast.error("Email address is incorrect!");
      return;
    }
    if (!emailAddress.value) {
      toast.error("EmailAddress is empty!");
      return;
    }
    if (!loggingPassword.value) {
      toast.error("Password is empty!");
      return;
    }
    
    const { data, error } = await signInWithEmail(
      emailAddress.value,
      loggingPassword.value
    );

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data.session) {
      toast.success("Sign in successfully!");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 500);
    }
  };

  return (
    <>
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="emailAddress"
            className="block text-sm text-gray-800 dark:text-gray-200"
          >
            Email Address
          </label>
        </div>

        <div className="mt-2">
          <input
            type="email"
            id="emailAddress"
            className="block w-full rounded-lg border bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300"
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="loggingPassword"
            className="block text-sm text-gray-800 dark:text-gray-200"
          >
            Password
          </label>
        </div>

        <div className="mt-2">
          <input
            type="password"
            id="loggingPassword"
            className="block w-full rounded-lg border bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={onSignInByEmail}
          className="w-full transform rounded-lg bg-blue-500 px-4 py-2 tracking-wide text-white transition-colors duration-300 hover:bg-blue-400 focus:bg-blue-400 focus:outline-none"
        >
          Sign In
        </button>
      </div>
    </>
  );
}
