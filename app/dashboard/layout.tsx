import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

import { LayoutDashboard, User, Link2, FolderKanban } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import LogoutButton from "@/components/LogoutButton";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const navItems = [
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      label: "Links",
      href: "/dashboard/links",
      icon: Link2,
    },
    {
      label: "Projects",
      href: "/dashboard/projects",
      icon: FolderKanban,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-black">
      <div className="flex">
        <aside
          className="
            hidden md:flex w-72 min-h-screen
            border-r border-black/10
            bg-white/80 backdrop-blur-xl
            flex-col justify-between
            px-6 py-8
          "
        >
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-2xl border border-black/10
                  bg-black text-white
                  shadow-sm
                "
              >
                <LayoutDashboard size={18} />
              </div>

              <div>
                <h2 className="font-semibold tracking-tight">Dashboard</h2>

                <p className="text-xs text-zinc-500">Manage your portfolio</p>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className="
                        group flex items-center gap-3
                        rounded-2xl px-4 py-3
                        text-sm font-medium
                        transition-all duration-200
                        hover:bg-black hover:text-white
                        hover:shadow-md
                      "
                    >
                      <Icon
                        size={18}
                        className="transition-transform group-hover:scale-110"
                      />

                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-4">
            <Separator />

            <div
              className="
                rounded-2xl border border-black/10
                bg-black/3
                p-4
              "
            >
              <p className="text-sm font-medium">Signed in</p>

              <p className="text-xs text-zinc-500 mt-1 truncate">
                {user.email}
              </p>
            </div>

            <LogoutButton />
          </div>
        </aside>

        <main className="flex-1 min-h-screen">
          <header
            className="
              sticky top-0 z-20
              border-b border-black/10
              bg-white/80 backdrop-blur-xl
            "
          >
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h1 className="text-lg font-semibold tracking-tight">
                  Dashboard
                </h1>

                <p className="text-sm text-zinc-500">Welcome back</p>
              </div>
            </div>
          </header>

          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
