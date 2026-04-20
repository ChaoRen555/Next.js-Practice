import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createIssueSchema } from "@/lib/validationSchemas";

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

const unauthorizedResponse = () =>
  NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 },
  );

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  const session = await auth();

  if (!session?.user) {
    return unauthorizedResponse();
  }

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

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const session = await auth();

  if (!session?.user) {
    return unauthorizedResponse();
  }

  const issueId = await getIssueId(context);

  if (issueId === null) {
    return NextResponse.json(
      { error: "Invalid issue id" },
      { status: 400 },
    );
  }

  try {
    const issue = await prisma.issue.findUnique({
      where: {
        id: issueId,
      },
    });

    if (!issue) {
      return NextResponse.json(
        { error: "Issue not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(issue);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch issue" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  const session = await auth();

  if (!session?.user) {
    return unauthorizedResponse();
  }

  const issueId = await getIssueId(context);

  if (issueId === null) {
    return NextResponse.json(
      { error: "Invalid issue id" },
      { status: 400 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const validation = createIssueSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        fieldErrors: validation.error.flatten().fieldErrors,
      },
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

    const issue = await prisma.issue.update({
      where: {
        id: issueId,
      },
      data: {
        title: validation.data.title,
        description: validation.data.description,
      },
    });

    return NextResponse.json(issue);
  } catch {
    return NextResponse.json(
      { error: "Failed to update issue" },
      { status: 500 },
    );
  }
}
