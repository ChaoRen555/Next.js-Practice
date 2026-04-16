import { notFound } from "next/navigation";

import type { IssueItem } from "@/lib/issues";
import { prisma } from "@/lib/prisma";
import IssueDetailClient from "./IssueDetailClient";

type IssueDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const IssueDetailPage = async ({
  params,
}: IssueDetailPageProps) => {
  const { id } = await params;
  const issueId = Number.parseInt(id, 10);

  if (!Number.isInteger(issueId) || issueId <= 0) {
    notFound();
  }

  const issue = await prisma.issue.findUnique({
    where: {
      id: issueId,
    },
  });

  if (!issue) {
    notFound();
  }

  const serializedIssue: IssueItem = {
    ...issue,
    createdAt: issue.createdAt.toISOString(),
    updatedAt: issue.updatedAt.toISOString(),
  };

  return <IssueDetailClient issue={serializedIssue} />;
};

export default IssueDetailPage;
