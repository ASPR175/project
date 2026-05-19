"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/profile.actions";

type Props = {
  profile: {
    displayName: string;
    slug: string;
    bio: string | null;
    avatarUrl: string | null;
    theme: string | null;
    isPublic: boolean;
  };
};

export default function ProfileForm({ profile }: Props) {
  const [form, setForm] = useState({
    displayName: profile.displayName,
    slug: profile.slug,
    bio: profile.bio || "",
    avatarUrl: profile.avatarUrl || "",
    theme: profile.theme || "light",
    isPublic: profile.isPublic,
  });

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setFieldErrors({});
    setSuccess(false);

    const cleanedAvatar =
      form.avatarUrl.trim() === ""
        ? ""
        : form.avatarUrl.startsWith("http")
          ? form.avatarUrl
          : `https://${form.avatarUrl}`;

    // const res = await updateProfile(form);
    const res = await updateProfile({
      ...form,
      avatarUrl: cleanedAvatar,
    });
    console.log(res);
    setLoading(false);

    if (!res.success) {
      if (res.fieldErrors) {
        setFieldErrors(res.fieldErrors);
      }
      return;
    }

    setSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center gap-5">
        <div
          className="
          h-24 w-24 overflow-hidden rounded-full
          border border-black/10 bg-zinc-100
          shadow-sm
        "
        >
          {form.avatarUrl ? (
            <img
              src={form.avatarUrl}
              alt="Avatar Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="
              flex h-full w-full items-center justify-center
              text-2xl font-semibold text-zinc-400
            "
            >
              {form.displayName?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-semibold text-lg">
            {form.displayName || "Your Name"}
          </h2>

          <p className="text-sm text-zinc-500">Public profile preview</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Display Name</label>

        <input
          value={form.displayName}
          onChange={(e) =>
            setForm({
              ...form,
              displayName: e.target.value,
            })
          }
          placeholder="John Doe"
          className="
          w-full rounded-2xl border border-black/10
          bg-white px-4 py-3
          outline-none transition-all
          focus:border-black
          focus:ring-4 focus:ring-black/5
        "
        />

        {fieldErrors.displayName && (
          <p className="text-sm text-red-500">{fieldErrors.displayName[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Profile URL</label>

        <div
          className="
          flex items-center rounded-2xl
          border border-black/10
          focus-within:border-black
          focus-within:ring-4 focus-within:ring-black/5
          transition-all overflow-hidden
        "
        >
          <div
            className="
            px-4 py-3 text-sm text-zinc-500
            border-r border-black/10 bg-zinc-50
          "
          >
            /u/
          </div>

          <input
            value={form.slug}
            onChange={(e) =>
              setForm({
                ...form,
                slug: e.target.value,
              })
            }
            placeholder="johndoe"
            className="
            flex-1 bg-transparent px-4 py-3
            outline-none
          "
          />
        </div>

        {fieldErrors.slug && (
          <p className="text-sm text-red-500">{fieldErrors.slug[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Bio</label>

        <textarea
          value={form.bio}
          onChange={(e) =>
            setForm({
              ...form,
              bio: e.target.value,
            })
          }
          placeholder="Tell people about yourself..."
          rows={5}
          className="
          w-full rounded-2xl border border-black/10
          bg-white px-4 py-3
          outline-none resize-none
          transition-all
          focus:border-black
          focus:ring-4 focus:ring-black/5
        "
        />

        {fieldErrors.bio && (
          <p className="text-sm text-red-500">{fieldErrors.bio[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Avatar URL</label>

        <input
          value={form.avatarUrl}
          onChange={(e) =>
            setForm({
              ...form,
              avatarUrl: e.target.value,
            })
          }
          placeholder="https://..."
          className="
          w-full rounded-2xl border border-black/10
          bg-white px-4 py-3
          outline-none transition-all
          focus:border-black
          focus:ring-4 focus:ring-black/5
        "
        />

        {fieldErrors.avatarUrl && (
          <p className="text-sm text-red-500">{fieldErrors.avatarUrl[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Theme</label>

        <select
          value={form.theme || "light"}
          onChange={(e) =>
            setForm({
              ...form,
              theme: e.target.value,
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
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="midnight">Midnight</option>
        </select>
      </div>

      <div
        className="
        flex items-center justify-between
        rounded-2xl border border-black/10
        bg-zinc-50 px-5 py-4
      "
      >
        <div>
          <p className="font-medium">Public Profile</p>

          <p className="text-sm text-zinc-500">
            Allow others to view your portfolio
          </p>
        </div>

        <input
          type="checkbox"
          checked={form.isPublic ?? false}
          onChange={(e) =>
            setForm({
              ...form,
              isPublic: e.target.checked,
            })
          }
          className="h-5 w-5"
        />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          disabled={loading}
          className="
          inline-flex items-center justify-center
          rounded-2xl bg-black px-6 py-3
          text-sm font-medium text-white
          transition-all duration-200
          hover:scale-[1.02]
          hover:bg-zinc-800
          disabled:opacity-50
        "
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {success && (
          <p className="text-sm text-green-600">Profile updated successfully</p>
        )}
      </div>
    </form>
  );
}
