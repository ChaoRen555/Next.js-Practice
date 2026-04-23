import DashboardHome from "./DashboardHome";

import { prisma } from "@/lib/prisma";
import { serializeIssue } from "@/lib/issues";

export default async function HomePage() {
  const issues = await prisma.issue.findMany({
    include: {
      creator: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return <DashboardHome issues={issues.map(serializeIssue)} />;
}
