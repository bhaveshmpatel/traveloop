import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const cityId = searchParams.get("cityId") || "";
    const maxCost = searchParams.get("maxCost");

    const where: Record<string, unknown> = {};
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }
    if (type) where.type = type;
    if (cityId) where.cityId = cityId;
    if (maxCost) where.cost = { lte: parseFloat(maxCost) };

    const activities = await db.activity.findMany({
      where,
      include: { city: { select: { name: true, country: true } } },
      orderBy: { cost: "asc" },
      take: 50,
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Activities fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
