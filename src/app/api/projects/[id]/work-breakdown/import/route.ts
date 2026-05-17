import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  importWorkBreakdownRows,
  parseWorkBreakdownImportFile,
} from "@/lib/work-breakdown";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const getProjectId = async (context: RouteContext) => {
  const { id } = await context.params;
  const projectId = Number.parseInt(id, 10);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return null;
  }

  return projectId;
};

export async function POST(
  request: Request,
  context: RouteContext,
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const projectId = await getProjectId(context);

  if (projectId === null) {
    return NextResponse.json(
      { error: "Invalid project id" },
      { status: 400 },
    );
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      id: true,
      ownerId: true,
    },
  });

  if (!project) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 },
    );
  }

  if (project.ownerId !== session.user.id) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data" },
      { status: 400 },
    );
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Upload file is required" },
      { status: 400 },
    );
  }

  const parseResult = await parseWorkBreakdownImportFile(file);

  if (parseResult.issues.length > 0) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parseResult.issues,
      },
      { status: 400 },
    );
  }

  if (parseResult.rows.length === 0) {
    return NextResponse.json(
      { error: "Import file has no rows" },
      { status: 400 },
    );
  }

  try {
    const result = await prisma.$transaction((tx) => {
      return importWorkBreakdownRows(tx, projectId, parseResult.rows);
    });

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to import work breakdown" },
      { status: 500 },
    );
  }
}
