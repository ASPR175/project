import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import ProfileForm from "./profile-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user || !user.profile) {
    return notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>

        <p className="text-sm text-zinc-500 mt-2">
          Customize your public portfolio profile and appearance.
        </p>
      </div>

      <Card className="rounded-3xl border-black/10 shadow-sm">
        <CardContent className="p-8">
          <ProfileForm profile={user.profile} />
        </CardContent>
      </Card>
    </div>
  );
}
