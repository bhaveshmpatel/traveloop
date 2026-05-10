import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const where: Record<string, unknown> = { isPublic: true };
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    const trips = await db.trip.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true } },
        stops: {
          include: { city: { select: { name: true, country: true, region: true } } },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return NextResponse.json({ trips });
  } catch (error) {
    console.error("Itineraries fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
