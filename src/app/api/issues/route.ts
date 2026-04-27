import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { isIssueStatus, serializeIssue } from "@/lib/issues";
import { prisma } from "@/lib/prisma";
import { createIssueSchema } from "@/lib/validationSchemas";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  if (status !== null && !isIssueStatus(status)) {
    return NextResponse.json(
      { error: "Invalid issue status" },
      { status: 400 },
    );
  }

  try {
    const issues = await prisma.issue.findMany({
      where: status
        ? {
            status,
          }
        : undefined,
      include: {
        creator: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(issues.map(serializeIssue));
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch issues" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
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
    const issue = await prisma.issue.create({
      data: {
        title: validation.data.title,
        description: validation.data.description,
        status: "OPEN",
        creator: {
          connect: {
            id: session.user.id,
          },
        },
      },
      include: {
        creator: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(serializeIssue(issue), { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create issue" },
      { status: 500 },
    );
  }
}
