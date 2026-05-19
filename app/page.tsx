import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Globe, Layers3, Link2, User } from "lucide-react";
import { Icon } from "lucide-react";
import { getCurrentUser } from "@/lib/session";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard/profile");
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <div className="mb-6 flex items-center gap-2 rounded-full border px-4 py-1 text-sm">
          <Link2 className="h-4 w-4" />
          DevLinks — Developer Portfolio + Link-in-bio
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
          One clean place for your{" "}
          <span className="text-muted-foreground">
            projects, links, and developer identity
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Create a public developer profile with your social links, projects,
          tech stack, and portfolio — all shareable with a single link.
        </p>

        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-white transition hover:opacity-90"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href="/u/fatku"
            className="rounded-lg border px-6 py-3 transition hover:bg-muted"
          >
            View Demo
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 md:grid-cols-3">
        <div className="rounded-2xl border p-6">
          <div className="mb-4 w-fit rounded-lg border p-3">
            <User className="h-5 w-5" />
          </div>

          <h3 className="text-lg font-semibold">Public Developer Profile</h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Customize your slug, avatar, bio, and visibility settings to create
            your personal developer identity.
          </p>
        </div>

        <div className="rounded-2xl border p-6">
          <div className="mb-4 w-fit rounded-lg border p-3">
            <Layers3 className="h-5 w-5" />
          </div>

          <h3 className="text-lg font-semibold">Showcase Projects</h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Add your projects, live demos, repositories, and tech stack in a
            clean portfolio layout.
          </p>
        </div>

        <div className="rounded-2xl border p-6">
          <div className="mb-4 w-fit rounded-lg border p-3">
            <Globe className="h-5 w-5" />
          </div>

          <h3 className="text-lg font-semibold">All Your Links Together</h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Share GitHub, LinkedIn, Twitter, YouTube, websites, and more from
            one centralized page.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="overflow-hidden rounded-3xl border bg-muted/30 p-8">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-background text-xl font-bold">
                  A
                </div>

                <div>
                  <h2 className="text-xl font-semibold">Atharva</h2>

                  <p className="text-sm text-muted-foreground">
                    Full Stack Developer
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Building modern web apps with Next.js, TypeScript, Prisma, and
                PostgreSQL.
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-lg border bg-background p-3">
                  https://github.com/ASPR175
                </div>

                <div className="flex items-center gap-2 rounded-lg border bg-background p-3">
                  <Globe className="h-4 w-4" />
                  https://www.linkedin.com/in/atharva-risbud
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-background p-6">
              <h3 className="mb-4 text-lg font-semibold">Featured Project</h3>

              <div className="space-y-3">
                <div className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">DevLinks</h4>

                    <span className="text-xs text-muted-foreground">
                      Next.js
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Developer portfolio and link-in-bio platform built with
                    Next.js, Prisma, PostgreSQL, and TailwindCSS.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Next.js", "TypeScript", "Prisma", "PostgreSQL"].map(
                      (tech) => (
                        <span
                          key={tech}
                          className="rounded-full border px-2 py-1 text-xs"
                        >
                          {tech}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
