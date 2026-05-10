import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const search = searchParams.get("search") || "";

    const where: Record<string, unknown> = { userId: user.id };
    if (status) where.status = status;
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    const orderBy: Record<string, string> = {};
    orderBy[sortBy] = sortOrder;

    const trips = await db.trip.findMany({
      where,
      orderBy,
      include: {
        stops: {
          include: { city: true },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({ trips });
  } catch (error) {
    console.error("Trips fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, startDate, endDate, budget, isPublic } = body;

    if (!name || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Trip name, start date, and end date are required" },
        { status: 400 }
      );
    }

    const trip = await db.trip.create({
      data: {
        userId: user.id,
        name,
        description: description || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budget: budget ? parseFloat(budget) : null,
        isPublic: isPublic || false,
      },
    });

    return NextResponse.json({ trip }, { status: 201 });
  } catch (error) {
    console.error("Trip create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
