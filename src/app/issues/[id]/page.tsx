import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { serializeIssue } from "@/lib/issues";
import { prisma } from "@/lib/prisma";
import IssueDetailClient from "../_components/IssueDetailClient";

type IssueDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const IssueDetailPage = async ({
  params,
}: IssueDetailPageProps) => {
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

  return <IssueDetailClient issue={serializeIssue(issue, session?.user)} />;
};

export default IssueDetailPage;
