import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createIssueSchema } from "@/lib/validationSchemas";

export async function POST(request: Request) {
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
      },
    });

    return NextResponse.json(issue, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create issue" },
      { status: 500 },
    );
  }
}
