"use client";

import { useState } from "react";
import { createProject, deleteProject } from "@/app/actions/project.actions";

type Project = {
  id: string;
  title: string;
  description: string | null;
  repoUrl: string | null;
  liveUrl: string | null;
  techStack: string[];
};

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [items, setItems] = useState(projects);

  const [form, setForm] = useState({
    title: "",
    description: "",
    repoUrl: "",
    liveUrl: "",
    techStack: "",
  });

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const techArray = form.techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await createProject({
      title: form.title,
      description: form.description,
      repoUrl: form.repoUrl,
      liveUrl: form.liveUrl,
      techStack: techArray,
    });

    setLoading(false);

    if (!res.success) {
      setError("Failed to create project");
      return;
    }

    window.location.reload();
  }

  async function handleDelete(id: string) {
    const res = await deleteProject({ id });

    if (!res.success) return;

    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Create Project
          </h2>

          <p className="text-sm text-zinc-500 mt-1">
            Add projects to your public portfolio.
          </p>
        </div>

        <form
          onSubmit={handleCreate}
          className="
          space-y-5 rounded-3xl
          border border-black/10
          bg-zinc-50/50 p-6
        "
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Title</label>

            <input
              placeholder="Portfolio Website"
              className="
              w-full rounded-2xl border border-black/10
              bg-white px-4 py-3
              outline-none transition-all
              focus:border-black
              focus:ring-4 focus:ring-black/5
            "
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>

            <textarea
              placeholder="Describe your project..."
              rows={5}
              className="
              w-full rounded-2xl border border-black/10
              bg-white px-4 py-3
              outline-none resize-none transition-all
              focus:border-black
              focus:ring-4 focus:ring-black/5
            "
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Repository URL</label>

            <input
              placeholder="https://github.com/..."
              className="
              w-full rounded-2xl border border-black/10
              bg-white px-4 py-3
              outline-none transition-all
              focus:border-black
              focus:ring-4 focus:ring-black/5
            "
              value={form.repoUrl}
              onChange={(e) =>
                setForm({
                  ...form,
                  repoUrl: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Live Demo URL</label>

            <input
              placeholder="https://yourproject.com"
              className="
              w-full rounded-2xl border border-black/10
              bg-white px-4 py-3
              outline-none transition-all
              focus:border-black
              focus:ring-4 focus:ring-black/5
            "
              value={form.liveUrl}
              onChange={(e) =>
                setForm({
                  ...form,
                  liveUrl: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tech Stack</label>

            <input
              placeholder="Next.js, Prisma, TailwindCSS..."
              className="
              w-full rounded-2xl border border-black/10
              bg-white px-4 py-3
              outline-none transition-all
              focus:border-black
              focus:ring-4 focus:ring-black/5
            "
              value={form.techStack}
              onChange={(e) =>
                setForm({
                  ...form,
                  techStack: e.target.value,
                })
              }
            />

            <p className="text-xs text-zinc-500">
              Separate technologies with commas.
            </p>
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
              {loading ? "Creating..." : "Create Project"}
            </button>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </form>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Your Projects
          </h2>

          <p className="text-sm text-zinc-500 mt-1">
            Manage and organize your portfolio projects.
          </p>
        </div>

        {items.length === 0 ? (
          <div
            className="
            rounded-3xl border border-dashed
            border-black/10
            p-12 text-center
          "
          >
            <p className="text-zinc-500">No projects added yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((project) => (
              <div
                key={project.id}
                className="
                group rounded-3xl border border-black/10
                bg-white p-6
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold tracking-tight">
                      {project.title}
                    </h3>

                    {project.description && (
                      <p className="text-sm leading-7 text-zinc-500">
                        {project.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(project.id)}
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

                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="
                        rounded-full border border-black/10
                        bg-black/3
                        px-3 py-1.5
                        text-xs font-medium
                        transition-transform duration-200
                        hover:scale-105
                      "
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-5 mt-6 text-sm">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                      font-medium underline-offset-4
                      hover:underline
                    "
                    >
                      Repository
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                      font-medium underline-offset-4
                      hover:underline
                    "
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
