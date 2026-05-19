"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth.actions";

import { LogOut, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
export default function LogoutButton() {
  const [pending, startTransition] = useTransition();

  const router = useRouter();

  function handleLogout() {
    startTransition(async () => {
      await logout();

      router.push("/login");
      router.refresh();
    });
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={pending}
      variant="outline"
      className="
        w-full rounded-2xl
        border-red-200
        text-red-500
        hover:bg-red-500
        hover:text-white
        hover:border-red-500
        transition-all duration-200
      "
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </>
      )}
    </Button>
  );
}
