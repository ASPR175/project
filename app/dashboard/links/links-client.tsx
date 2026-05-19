"use client";

import { useState } from "react";
import { createLink, deleteLink } from "@/app/actions/link.actions";
import { Platform } from "@/app/generated/prisma/enums";

type Link = {
  id: string;
  title: string;
  url: string;
  platform: string;
};

export default function LinksClient({ links }: { links: Link[] }) {
  const [items, setItems] = useState(links);

  const [form, setForm] = useState<{
    title: string;
    url: string;
    platform: Platform;
  }>({
    title: "",
    url: "",
    platform: Platform.CUSTOM,
  });
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await createLink(form);

    if (!res.success) {
      setError("Failed to create link");
      return;
    }

    window.location.reload();
  }

  async function handleDelete(id: string) {
    const res = await deleteLink({ id });

    if (!res.success) {
      return;
    }

    setItems((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="space-y-10">
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Add New Link</h2>

          <p className="text-sm text-zinc-500 mt-1">
            Showcase your socials, portfolio, or important URLs.
          </p>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>

            <input
              placeholder="GitHub"
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
                  title: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">URL</label>

            <input
              placeholder="https://github.com/username"
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
                  url: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Platform</label>

            <select
              value={form.platform}
              onChange={(e) =>
                setForm({
                  ...form,
                  platform: e.target.value as Platform,
                })
              }
              className="
              w-full rounded-2xl border border-black/10
              bg-white px-4 py-3
              outline-none transition-all
              focus:border-black
              focus:ring-4 focus:ring-black/5
            "
            >
              {Object.values(Platform).map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>

          <button
            className="
            inline-flex items-center justify-center
            rounded-2xl bg-black px-6 py-3
            text-sm font-medium text-white
            transition-all duration-200
            hover:scale-[1.02]
            hover:bg-zinc-800
          "
          >
            Add Link
          </button>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Your Links</h2>

          <p className="text-sm text-zinc-500 mt-1">
            Manage visibility and organization of your links.
          </p>
        </div>

        {items.length === 0 ? (
          <div
            className="
            rounded-2xl border border-dashed
            border-black/10
            p-10 text-center
          "
          >
            <p className="text-zinc-500">No links added yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((link) => (
              <div
                key={link.id}
                className="
                group flex items-center justify-between
                rounded-2xl border border-black/10
                bg-white px-5 py-4
                transition-all duration-200
                hover:shadow-md
                hover:border-black/20
              "
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium tracking-tight">{link.title}</p>

                    <span
                      className="
                      rounded-full border border-black/10
                      bg-black/3
                      px-2 py-0.5 text-[10px]
                      uppercase tracking-wide text-zinc-500
                    "
                    >
                      {link.platform}
                    </span>
                  </div>

                  <p
                    className="
                    text-sm text-zinc-500
                    truncate max-w-55 md:max-w-md
                    mt-1
                  "
                  >
                    {link.url}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(link.id)}
                  className="
                  rounded-xl px-3 py-2
                  text-sm font-medium text-red-500
                  transition-all duration-200
                  hover:bg-red-500
                  hover:text-white
                "
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
