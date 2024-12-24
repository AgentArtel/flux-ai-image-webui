"use client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { validateEmail } from "@/lib/utils";
import { signUpWithEmail } from "@/lib/supabase/auth";

export default function SignUpForm() {
  const router = useRouter();

  const onSignUp = async () => {
    const EmailAddress = document.getElementById(
      "EmailAddress"
    ) as HTMLInputElement;
    const UserName = document.getElementById("UserName") as HTMLInputElement;
    const Password = document.getElementById("Password") as HTMLInputElement;
    const ConfirmPassword = document.getElementById(
      "ConfirmPassword"
    ) as HTMLInputElement;

    if (!validateEmail(EmailAddress.value)) {
      console.info(EmailAddress.value, !validateEmail(EmailAddress.value))
      toast.error("Email address is incorrect!");
      return;
    }
    if (!EmailAddress.value) {
      toast.error("EmailAddress is empty!");
      return;
    }
    if (!UserName.value) {
      toast.error("UserName is empty!");
      return;
    }
    if (!Password.value) {
      toast.error("Password is empty!");
      return;
    }
    if (Password.value !== ConfirmPassword.value) {
      toast.error("Password inconsistency!");
      return;
    }

    const { data, error } = await signUpWithEmail(EmailAddress.value, Password.value);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data) {
      toast.success("Sign up successfully! Please check your email to verify your account.");
      setTimeout(() => {
        router.push("/sign-in");
        router.refresh();
      }, 500);
    }
  };

  return (
    <>
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="EmailAddress"
            className="block text-sm text-gray-800 dark:text-gray-200"
          >
            Email Address
          </label>
        </div>

        <div className="mt-2">
          <input
            type="email"
            id="EmailAddress"
            className="block w-full rounded-lg border bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300"
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="UserName"
            className="block text-sm text-gray-800 dark:text-gray-200"
          >
            User Name
          </label>
        </div>

        <div className="mt-2">
          <input
            type="text"
            id="UserName"
            className="block w-full rounded-lg border bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300"
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="Password"
            className="block text-sm text-gray-800 dark:text-gray-200"
          >
            Password
          </label>
        </div>

        <div className="mt-2">
          <input
            type="password"
            id="Password"
            className="block w-full rounded-lg border bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300"
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="ConfirmPassword"
            className="block text-sm text-gray-800 dark:text-gray-200"
          >
            Confirm Password
          </label>
        </div>

        <div className="mt-2">
          <input
            type="password"
            id="ConfirmPassword"
            className="block w-full rounded-lg border bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={onSignUp}
          className="w-full transform rounded-lg bg-blue-500 px-4 py-2 tracking-wide text-white transition-colors duration-300 hover:bg-blue-400 focus:bg-blue-400 focus:outline-none"
        >
          Sign Up
        </button>
      </div>
    </>
  );
}
