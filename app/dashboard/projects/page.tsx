import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import ProjectsClient from "./projects-client";

import { Card, CardContent } from "@/components/ui/card";

export default async function ProjectsPage() {
  const user = await getCurrentUser();

  if (!user || !user.profile) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>

        <p className="text-sm text-zinc-500 mt-2">
          Showcase your best work, side projects, and experiments.
        </p>
      </div>

      {/* Main Card */}
      <Card className="rounded-3xl border-black/10 shadow-sm">
        <CardContent className="p-8">
          <ProjectsClient projects={user.profile.projects} />
        </CardContent>
      </Card>
    </div>
  );
}
