import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const region = searchParams.get("region") || "";

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
      ];
    }
    if (region) {
      where.region = region;
    }

    const cities = await db.city.findMany({
      where,
      orderBy: { popularity: "desc" },
      take: 50,
    });

    return NextResponse.json({ cities });
  } catch (error) {
    console.error("Cities fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
