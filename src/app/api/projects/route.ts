import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createProjectSchema } from "@/lib/validationSchemas";

const serializeProject = (project: {
  id: number;
  name: string;
  description: string | null;
  status: "PLANNED" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  startDate: Date | null;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string | null;
  owner: {
    name: string | null;
  } | null;
}) => {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    startDate: project.startDate?.toISOString() ?? null,
    dueDate: project.dueDate?.toISOString() ?? null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    ownerId: project.ownerId,
    ownerName: project.owner?.name ?? null,
  };
};

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

  const validation = createProjectSchema.safeParse(body);

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
    const project = await prisma.project.create({
      data: {
        name: validation.data.name,
        description: validation.data.description,
        status: validation.data.status,
        startDate: new Date(validation.data.startDate),
        dueDate: new Date(validation.data.dueDate),
        owner: {
          connect: {
            id: session.user.id,
          },
        },
      },
      include: {
        owner: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(serializeProject(project), { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
