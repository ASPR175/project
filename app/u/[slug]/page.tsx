import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const themeStyles = {
  light: {
    page: "bg-[#fafafa] text-black",
    card: "bg-white border-black/10",
    muted: "text-zinc-500",
    badge: "border-black/10 bg-black/[0.04]",
    skill: "border-black/20 text-black bg-black/[0.02]",
    link: "bg-white/80 border-black/10 hover:border-black hover:bg-white",
    glow: "bg-black/5",
  },

  dark: {
    page: "bg-zinc-950 text-white",

    card: `
    bg-zinc-900
    border-zinc-700
    shadow-[0_0_0_1px_rgba(255,255,255,0.03)]
  `,

    muted: "text-zinc-300",

    badge: `
    border-zinc-600
    bg-zinc-800
    text-zinc-200
  `,

    skill: `
    border-zinc-500
    bg-zinc-700/60
    text-zinc-100
  `,

    link: `
    bg-zinc-900
    border-zinc-700
    hover:border-zinc-400
    hover:bg-zinc-800
  `,

    glow: "bg-white/[0.06]",
  },

  midnight: {
    page: "bg-[#020617] text-white",

    card: `
    bg-slate-900
    border-slate-700
    shadow-[0_0_0_1px_rgba(148,163,184,0.08)]
  `,

    muted: "text-slate-300",

    badge: `
    border-slate-600
    bg-slate-800
    text-slate-200
  `,

    skill: `
    border-slate-500
    bg-slate-700/50
    text-slate-100
  `,

    link: `
    bg-slate-900
    border-slate-700
    hover:border-slate-300
    hover:bg-slate-800
  `,

    glow: "bg-blue-400/10",
  },
} as const;

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;

  const profile = await prisma.profile.findUnique({
    where: { slug },
    include: {
      links: {
        where: { isVisible: true },
        orderBy: { position: "asc" },
      },

      projects: {
        orderBy: { position: "asc" },

        include: {
          skills: {
            include: {
              skill: true,
            },
          },
        },
      },
    },
  });

  if (!profile || !profile.isPublic) {
    return notFound();
  }

  const theme =
    themeStyles[(profile.theme as keyof typeof themeStyles) || "light"];

  return (
    <main
      className={`
        relative overflow-hidden min-h-screen
        transition-colors duration-500
        ${theme.page}
      `}
    >
      <div
        className={`
          absolute inset-0 pointer-events-none
          mask-[radial-gradient(circle_at_top,black,transparent_70%)]
          ${theme.glow}
        `}
      />

      <div className="relative max-w-2xl mx-auto px-5 py-14">
        <section className="flex flex-col items-center text-center mb-16">
          {profile.avatarUrl && (
            <div className="relative group mb-6">
              <div
                className="
                  absolute inset-0 rounded-full blur-2xl opacity-30
                  scale-110 bg-black/10
                "
              />

              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="
                  relative w-28 h-28 rounded-full object-cover
                  border border-white/10
                  shadow-2xl
                  transition-transform duration-300
                  group-hover:scale-[1.03]
                "
              />
            </div>
          )}

          <h1
            className="
              text-4xl font-bold tracking-tight
              sm:text-5xl
            "
          >
            {profile.displayName}
          </h1>

          {profile.bio && (
            <p
              className={`
                mt-4 text-sm leading-7 max-w-lg
                ${theme.muted}
              `}
            >
              {profile.bio}
            </p>
          )}
        </section>

        {profile.links.length > 0 && (
          <section className="mb-16">
            <div className="space-y-4">
              {profile.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    group block rounded-2xl border backdrop-blur
                    px-5 py-4 transition-all duration-300
                    hover:scale-[1.01]
                    hover:shadow-xl
                    ${theme.link}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium tracking-tight">{link.title}</p>
                    </div>

                    <div
                      className="
                        text-lg transition-transform duration-300
                        group-hover:translate-x-1
                        group-hover:-translate-y-1
                      "
                    >
                      ↗
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {profile.projects.length > 0 && (
          <section className="space-y-6">
            {profile.projects.map((project) => (
              <Card
                key={project.id}
                className={`
    group rounded-3xl border backdrop-blur-xl
    transition-all duration-300
    hover:-translate-y-1
    hover:shadow-2xl
    hover:shadow-black/30
    ${theme.card}
  `}
              >
                <CardContent className="p-7">
                  <div className="space-y-5">
                    {/* Title */}
                    <div>
                      <h2
                        className="
                          text-2xl font-semibold tracking-tight
                        "
                      >
                        {project.title}
                      </h2>

                      {project.description && (
                        <p
                          className={`
                            mt-3 text-sm leading-7
                            ${theme.muted}
                          `}
                        >
                          {project.description}
                        </p>
                      )}
                    </div>

                    {project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className={`
                              text-xs rounded-full border
                              px-3 py-1.5 font-medium
                              transition-transform duration-200
                              hover:scale-105
                              ${theme.badge}
                            `}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((ps) => (
                          <span
                            key={ps.id}
                            className={`
                              text-xs rounded-full border
                              px-3 py-1.5
                              transition-transform duration-200
                              hover:scale-105
                              ${theme.skill}
                            `}
                          >
                            {ps.skill.name}
                            {ps.level && ` • ${ps.level}`}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-6 pt-2">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            text-sm font-medium
                            underline-offset-4
                            hover:underline
                          "
                        >
                          GitHub
                        </a>
                      )}

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            text-sm font-medium
                            underline-offset-4
                            hover:underline
                          "
                        >
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
