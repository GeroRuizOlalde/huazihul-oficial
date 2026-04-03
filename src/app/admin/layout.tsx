import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminAccessState } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin | Huazihul",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await getAdminAccessState();

  if (access.kind === "forbidden") {
    redirect("/?acceso=denegado");
  }

  if (access.kind === "anonymous") {
    return <AdminLogin />;
  }

  return <AdminShell>{children}</AdminShell>;
}
