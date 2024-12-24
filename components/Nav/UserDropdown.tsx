"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { signOut } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UserDropdown({
  user,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null };
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    router.refresh();
  };

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="sr-only">Open user menu</span>
          <img
            className="h-8 w-8 rounded-full"
            src={user?.image || "https://avatar.vercel.sh/leerob"}
            height={32}
            width={32}
            alt={`${user?.name || "placeholder"} avatar`}
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? "bg-gray-100" : ""
                } block w-full px-4 py-2 text-sm text-gray-700`}
                onClick={handleSignOut}
              >
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
