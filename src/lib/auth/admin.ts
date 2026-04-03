import "server-only";

import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

type AnonymousAccess = {
  kind: "anonymous";
};

type ForbiddenAccess = {
  kind: "forbidden";
};

type AdminAccess = {
  kind: "admin";
  user: User;
};

export type AdminAccessState =
  | AnonymousAccess
  | ForbiddenAccess
  | AdminAccess;

export async function getAdminAccessState(): Promise<AdminAccessState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { kind: "anonymous" };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile || profile.role !== "admin") {
    return { kind: "forbidden" };
  }

  return { kind: "admin", user };
}

export async function requireAdminAccess() {
  const access = await getAdminAccessState();

  if (access.kind !== "admin") {
    throw new Error("No autorizado.");
  }

  return access.user;
}
