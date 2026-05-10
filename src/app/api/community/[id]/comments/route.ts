import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/community/[id]/comments">
) {
  try {
    const { id } = await ctx.params;

    const comments = await db.postComment.findMany({
      where: { postId: id },
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Comments fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/community/[id]/comments">
) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;
    const body = await request.json();

    if (!body.content) {
      return NextResponse.json({ error: "Comment content required" }, { status: 400 });
    }

    const comment = await db.postComment.create({
      data: {
        postId: id,
        userId: user.id,
        content: body.content,
      },
      include: { user: { select: { firstName: true, lastName: true } } },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error("Comment create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
