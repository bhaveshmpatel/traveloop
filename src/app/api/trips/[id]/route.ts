import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/trips/[id]">
) {
  try {
    const { id } = await ctx.params;
    const trip = await db.trip.findUnique({
      where: { id },
      include: {
        stops: {
          include: {
            city: true,
            activities: { include: { activity: true } },
          },
          orderBy: { order: "asc" },
        },
        packingItems: true,
        notes: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json({ trip });
  } catch (error) {
    console.error("Trip fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  ctx: RouteContext<"/api/trips/[id]">
) {
  try {
    const user = await getSession();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;
    const body = await request.json();

    const trip = await db.trip.update({
      where: { id, userId: user.id },
      data: body,
    });

    return NextResponse.json({ trip });
  } catch (error) {
    console.error("Trip update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  ctx: RouteContext<"/api/trips/[id]">
) {
  try {
    const user = await getSession();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;

    await db.trip.delete({
      where: { id, userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Trip delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
