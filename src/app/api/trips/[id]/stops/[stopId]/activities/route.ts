import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/trips/[id]/stops/[stopId]/activities">
) {
  try {
    const user = await getSession();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, stopId } = await ctx.params;
    const body = await request.json();
    const { activityId, date, estimatedCost, startTime, endTime, notes } = body;

    // Verify trip ownership
    const trip = await db.trip.findFirst({
      where: { id, userId: user.id },
    });
    if (!trip)
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    const stopActivity = await db.stopActivity.create({
      data: {
        stopId,
        activityId,
        date: new Date(date),
        estimatedCost: estimatedCost || null,
        startTime: startTime || null,
        endTime: endTime || null,
        notes: notes || null,
      },
      include: { activity: true },
    });

    return NextResponse.json({ stopActivity }, { status: 201 });
  } catch (error) {
    console.error("StopActivity create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
