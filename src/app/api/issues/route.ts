import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
  isIssueOrderBy,
  isIssueOrderDirection,
  isIssueStatus,
  serializeIssue,
  type IssueOrderBy,
  type IssueOrderDirection,
} from "@/lib/issues";
import { prisma } from "@/lib/prisma";
import { createIssueSchema } from "@/lib/validationSchemas";

const defaultOrderBy: IssueOrderBy = "createdAt";
const defaultOrder: IssueOrderDirection = "desc";

const getIssueOrderBy = (
  orderBy: IssueOrderBy,
  order: IssueOrderDirection,
): Prisma.IssueOrderByWithRelationInput => {
  if (orderBy === "createdByName") {
    return {
      creator: {
        name: order,
      },
    };
  }

  return {
    [orderBy]: order,
  };
};

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
  const orderByParam = searchParams.get("orderBy") ?? defaultOrderBy;
  const orderParam = searchParams.get("order") ?? defaultOrder;

  if (status !== null && !isIssueStatus(status)) {
    return NextResponse.json(
      { error: "Invalid issue status" },
      { status: 400 },
    );
  }

  if (!isIssueOrderBy(orderByParam)) {
    return NextResponse.json(
      { error: "Invalid issue order field" },
      { status: 400 },
    );
  }

  if (!isIssueOrderDirection(orderParam)) {
    return NextResponse.json(
      { error: "Invalid issue order direction" },
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
      orderBy: getIssueOrderBy(orderByParam, orderParam),
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
