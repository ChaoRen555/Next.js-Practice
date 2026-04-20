import { redirect } from "next/navigation";

import { auth } from "@/auth";

type IssuesLayoutProps = {
  children: React.ReactNode;
};

const IssuesLayout = async ({
  children,
}: IssuesLayoutProps) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/issues");
  }

  return children;
};

export default IssuesLayout;
