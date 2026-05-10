import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sortBy") || "recent";

    let orderBy: Record<string, string> = { createdAt: "desc" };
    if (sortBy === "likes") orderBy = { likes: "desc" };

    const posts = await db.communityPost.findMany({
      include: {
        user: { select: { firstName: true, lastName: true } },
        trip: { select: { name: true } },
        comments: {
          include: { user: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { comments: true } },
      },
      orderBy: sortBy === "comments"
        ? { comments: { _count: "desc" } }
        : orderBy,
      take: 30,
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Community fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { title, content, tripId, imageUrl } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const post = await db.communityPost.create({
      data: {
        userId: user.id,
        title,
        content,
        tripId: tripId || null,
        imageUrl: imageUrl || null,
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
        trip: { select: { name: true } },
        comments: true,
        _count: { select: { comments: true } },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Community post error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
