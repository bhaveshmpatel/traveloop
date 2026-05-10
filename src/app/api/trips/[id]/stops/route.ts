import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/trips/[id]/stops">
) {
  try {
    const user = await getSession();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;
    const body = await request.json();
    const { cityId, arrivalDate, departureDate, order, notes } = body;

    // Verify trip ownership
    const trip = await db.trip.findFirst({
      where: { id, userId: user.id },
    });
    if (!trip)
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    const stop = await db.tripStop.create({
      data: {
        tripId: id,
        cityId,
        arrivalDate: new Date(arrivalDate),
        departureDate: new Date(departureDate),
        order: order ?? 0,
        notes: notes || null,
      },
      include: { city: true },
    });

    return NextResponse.json({ stop }, { status: 201 });
  } catch (error) {
    console.error("Stop create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
