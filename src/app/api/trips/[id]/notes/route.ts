import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/trips/[id]/notes">
) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await ctx.params;
    const trip = await db.trip.findFirst({ where: { id, userId: user.id } });
    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    const notes = await db.tripNote.findMany({
      where: { tripId: id },
      include: { stop: { include: { city: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Notes fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/trips/[id]/notes">
) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await ctx.params;
    const trip = await db.trip.findFirst({ where: { id, userId: user.id } });
    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    const body = await request.json();
    const note = await db.tripNote.create({
      data: {
        tripId: id,
        title: body.title || "",
        content: body.content,
        stopId: body.stopId || null,
        dayNumber: body.dayNumber || null,
      },
      include: { stop: { include: { city: true } } },
    });
    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("Note create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  ctx: RouteContext<"/api/trips/[id]/notes">
) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get("noteId");
    if (noteId) await db.tripNote.delete({ where: { id: noteId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Note delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
