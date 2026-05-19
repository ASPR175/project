"use client";

import { useState } from "react";
import { register } from "@/app/actions/auth.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await register(form);

    router.push("/dashboard");
  }

  return (
    <main
      className="
      relative flex min-h-screen items-center justify-center
      overflow-hidden bg-[#fafafa] px-4
    "
    >
      <div
        className="
        absolute inset-0
        bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_40%)]
      "
      />

      <div
        className="
        relative w-full max-w-md
        rounded-3xl border border-black/10
        bg-white/80 backdrop-blur-xl
        shadow-xl
      "
      >
        <div className="p-8 sm:p-10">
          <div className="mb-8 space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Create account
            </h1>

            <p className="text-sm text-zinc-500">
              Start building your public portfolio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>

              <input
                type="email"
                placeholder="you@example.com"
                className="
                w-full rounded-2xl border border-black/10
                bg-white px-4 py-3
                outline-none transition-all
                focus:border-black
                focus:ring-4 focus:ring-black/5
              "
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>

              <input
                type="text"
                placeholder="johndoe"
                className="
                w-full rounded-2xl border border-black/10
                bg-white px-4 py-3
                outline-none transition-all
                focus:border-black
                focus:ring-4 focus:ring-black/5
              "
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>

              <input
                type="password"
                placeholder="••••••••"
                className="
                w-full rounded-2xl border border-black/10
                bg-white px-4 py-3
                outline-none transition-all
                focus:border-black
                focus:ring-4 focus:ring-black/5
              "
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              className="
              inline-flex w-full items-center justify-center
              rounded-2xl bg-black px-6 py-3
              text-sm font-medium text-white
              transition-all duration-200
              hover:scale-[1.02]
              hover:bg-zinc-800
            "
            >
              Register
            </button>

            <p className="text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="
                font-medium text-black
                underline-offset-4 hover:underline
              "
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
