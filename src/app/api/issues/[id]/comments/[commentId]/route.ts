import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { canDeleteComment } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
    commentId: string;
  }>;
};

const getRouteIds = async (context: RouteContext) => {
  const { id, commentId } = await context.params;
  const issueId = Number.parseInt(id, 10);
  const parsedCommentId = Number.parseInt(commentId, 10);

  if (
    !Number.isInteger(issueId) ||
    issueId <= 0 ||
    !Number.isInteger(parsedCommentId) ||
    parsedCommentId <= 0
  ) {
    return null;
  }

  return {
    commentId: parsedCommentId,
    issueId,
  };
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

  const routeIds = await getRouteIds(context);

  if (routeIds === null) {
    return NextResponse.json(
      { error: "Invalid comment id" },
      { status: 400 },
    );
  }

  try {
    const comment = await prisma.comment.findFirst({
      where: {
        id: routeIds.commentId,
        issueId: routeIds.issueId,
      },
      select: {
        authorId: true,
        id: true,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 },
      );
    }

    if (!canDeleteComment(session.user, comment)) {
      return forbiddenResponse();
    }

    await prisma.comment.delete({
      where: {
        id: comment.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 },
    );
  }
}
