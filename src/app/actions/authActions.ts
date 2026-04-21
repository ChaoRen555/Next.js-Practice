"use server";

import { revalidatePath } from "next/cache";

import { signOut } from "@/auth";

export async function logoutAction() {
  revalidatePath("/issues", "layout");
  revalidatePath("/", "layout");

  await signOut({
    redirectTo: "/",
  });
}
