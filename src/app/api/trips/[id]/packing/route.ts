import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/trips/[id]/packing">
) {
  try {
    const { id } = await ctx.params;

    const items = await db.packingItem.findMany({
      where: { tripId: id },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Packing fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/trips/[id]/packing">
) {
  try {
    const { id } = await ctx.params;

    const body = await request.json();

    // Support bulk create (array) or single
    if (Array.isArray(body.items)) {
      const created = await Promise.all(
        body.items.map((item: { name: string; category: string }) =>
          db.packingItem.create({
            data: { tripId: id, name: item.name, category: item.category as never },
          })
        )
      );
      return NextResponse.json({ items: created }, { status: 201 });
    }

    const item = await db.packingItem.create({
      data: {
        tripId: id,
        name: body.name,
        category: body.category || "OTHER",
      },
    });
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("Packing create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  ctx: RouteContext<"/api/trips/[id]/packing">
) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await ctx.params;

    const body = await request.json();

    // Toggle single item
    if (body.itemId) {
      const item = await db.packingItem.update({
        where: { id: body.itemId },
        data: { isPacked: body.isPacked },
      });
      return NextResponse.json({ item });
    }

    // Reset all
    if (body.resetAll) {
      await db.packingItem.updateMany({
        where: { tripId: id },
        data: { isPacked: false },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Packing update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  ctx: RouteContext<"/api/trips/[id]/packing">
) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (itemId) {
      await db.packingItem.delete({ where: { id: itemId } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Packing delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
