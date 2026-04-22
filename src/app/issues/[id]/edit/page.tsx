import { notFound } from "next/navigation";

import { serializeIssue } from "@/lib/issues";
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

  return <EditIssueClient issue={serializeIssue(issue)} />;
};

export default EditIssuePage;
