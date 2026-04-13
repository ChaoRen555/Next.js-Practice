import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const getIssueId = async (context: RouteContext) => {
  const { id } = await context.params;
  const issueId = Number.parseInt(id, 10);

  if (!Number.isInteger(issueId) || issueId <= 0) {
    return null;
  }

  return issueId;
};

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  const issueId = await getIssueId(context);

  if (issueId === null) {
    return NextResponse.json(
      { error: "Invalid issue id" },
      { status: 400 },
    );
  }

  try {
    const existingIssue = await prisma.issue.findUnique({
      where: {
        id: issueId,
      },
      select: {
        id: true,
      },
    });

    if (!existingIssue) {
      return NextResponse.json(
        { error: "Issue not found" },
        { status: 404 },
      );
    }

    await prisma.issue.delete({
      where: {
        id: issueId,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete issue" },
      { status: 500 },
    );
  }
}
