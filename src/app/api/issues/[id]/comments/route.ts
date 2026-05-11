import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serializeComment } from "@/lib/issues";
import { createCommentSchema } from "@/lib/validationSchemas";

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

    const comments = await prisma.comment.findMany({
      where: {
        issueId,
      },
      include: {
        author: {
          select: {
            email: true,
            image: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(
      comments.map((comment) => serializeComment(comment, session.user)),
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(
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

  const validation = createCommentSchema.safeParse(body);

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

    const comment = await prisma.comment.create({
      data: {
        body: validation.data.body,
        issueId,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            email: true,
            image: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(serializeComment(comment, session.user), {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
