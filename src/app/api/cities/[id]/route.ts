import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/cities/[id]">
) {
  try {
    const { id } = await ctx.params;
    const city = await db.city.findUnique({
      where: { id },
      include: {
        activities: { orderBy: { type: "asc" } },
      },
    });
    if (!city) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ city });
  } catch (error) {
    console.error("City fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
