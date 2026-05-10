import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  ctx: RouteContext<"/api/trips/[id]/stops/[stopId]/activities/[actId]">
) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, actId } = await ctx.params;

    // Verify trip ownership
    const trip = await db.trip.findFirst({ where: { id, userId: user.id } });
    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    await db.stopActivity.delete({ where: { id: actId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("StopActivity delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
