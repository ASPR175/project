import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import LinksClient from "./links-client";

import { Card, CardContent } from "@/components/ui/card";

export default async function LinksPage() {
  const user = await getCurrentUser();

  if (!user || !user.profile) {
    return notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Links</h1>

        <p className="text-sm text-zinc-500 mt-2">
          Add and manage your social and portfolio links.
        </p>
      </div>

      <Card className="rounded-3xl border-black/10 shadow-sm">
        <CardContent className="p-8">
          <LinksClient links={user.profile.links} />
        </CardContent>
      </Card>
    </div>
  );
}
