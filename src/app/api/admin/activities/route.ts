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

    const activities = await db.activity.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      } : undefined,
      include: { city: { select: { name: true, country: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Admin activities error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const activity = await db.activity.create({
      data: {
        cityId: body.cityId,
        name: body.name,
        type: body.type || "SIGHTSEEING",
        description: body.description || null,
        cost: parseFloat(body.cost) || 0,
        duration: parseFloat(body.duration) || 1,
      },
    });
    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error("Admin activity create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get("activityId");
    if (activityId) await db.activity.delete({ where: { id: activityId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin activity delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
