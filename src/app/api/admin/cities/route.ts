import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const cities = await db.city.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { country: { contains: search, mode: "insensitive" } },
        ],
      } : undefined,
      include: { _count: { select: { activities: true, stops: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ cities });
  } catch (error) {
    console.error("Admin cities error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const city = await db.city.create({
      data: {
        name: body.name,
        country: body.country,
        region: body.region || "Other",
        costIndex: body.costIndex || 3,
        popularity: body.popularity || 50,
        description: body.description || null,
      },
    });
    return NextResponse.json({ city }, { status: 201 });
  } catch (error) {
    console.error("Admin city create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get("cityId");
    if (cityId) await db.city.delete({ where: { id: cityId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin city delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
