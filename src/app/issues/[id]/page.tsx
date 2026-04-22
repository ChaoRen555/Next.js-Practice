import { notFound } from "next/navigation";

import { serializeIssue } from "@/lib/issues";
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
    include: {
      creator: {
        select: {
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

  return <IssueDetailClient issue={serializeIssue(issue)} />;
};

export default IssueDetailPage;
