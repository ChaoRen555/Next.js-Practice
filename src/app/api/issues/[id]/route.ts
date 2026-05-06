import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { serializeIssue } from "@/lib/issues";
import { canManageIssue, canUpdateIssueStatus } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  createIssueSchema,
  updateIssueStatusSchema,
} from "@/lib/validationSchemas";

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

const forbiddenResponse = () =>
  NextResponse.json(
    { error: "Forbidden" },
    { status: 403 },
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
        creatorId: true,
      },
    });

    if (!existingIssue) {
      return NextResponse.json(
        { error: "Issue not found" },
        { status: 404 },
      );
    }

    if (!canManageIssue(session.user, existingIssue)) {
      return forbiddenResponse();
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
      return NextResponse.json(
        { error: "Issue not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(serializeIssue(issue, session.user));
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

  const statusValidation = updateIssueStatusSchema.safeParse(body);

  if (statusValidation.success) {
    if (!canUpdateIssueStatus(session.user)) {
      return forbiddenResponse();
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
          status: statusValidation.data.status,
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return NextResponse.json(serializeIssue(issue, session.user));
    } catch {
      return NextResponse.json(
        { error: "Failed to update issue status" },
        { status: 500 },
      );
    }
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
        creatorId: true,
      },
    });

    if (!existingIssue) {
      return NextResponse.json(
        { error: "Issue not found" },
        { status: 404 },
      );
    }

    if (!canManageIssue(session.user, existingIssue)) {
      return forbiddenResponse();
    }

    const issue = await prisma.issue.update({
      where: {
        id: issueId,
      },
      data: {
        title: validation.data.title,
        description: validation.data.description,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(serializeIssue(issue, session.user));
  } catch {
    return NextResponse.json(
      { error: "Failed to update issue" },
      { status: 500 },
    );
  }
}
