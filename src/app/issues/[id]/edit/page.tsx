import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { serializeIssue } from "@/lib/issues";
import { canManageIssue } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import EditIssueClient from "./EditIssueClient";

type EditIssuePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const EditIssuePage = async ({
  params,
}: EditIssuePageProps) => {
  const session = await auth();
  const { id } = await params;
  const issueId = Number.parseInt(id, 10);

  if (!Number.isInteger(issueId) || issueId <= 0) {
    notFound();
  }

  const issue = await prisma.issue.findUnique({
    include: {
      creator: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      id: issueId,
    },
  });

  if (!issue) {
    notFound();
  }

  if (!session?.user || !canManageIssue(session.user, issue)) {
    redirect(`/issues/${issueId}`);
  }

  return <EditIssueClient issue={serializeIssue(issue, session.user)} />;
};

export default EditIssuePage;
