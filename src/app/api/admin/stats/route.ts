import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [
      totalUsers, totalTrips, totalCities, totalActivities,
      totalPosts, totalExpenses,
    ] = await Promise.all([
      db.user.count(),
      db.trip.count(),
      db.city.count(),
      db.activity.count(),
      db.communityPost.count(),
      db.expense.count(),
    ]);

    // User signups by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const recentUsers = await db.user.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // Trip status distribution
    const tripsByStatus = await db.trip.groupBy({
      by: ["status"],
      _count: true,
    });

    // Top cities by trip stops
    const topCities = await db.tripStop.groupBy({
      by: ["cityId"],
      _count: true,
      orderBy: { _count: { cityId: "desc" } },
      take: 10,
    });
    const cityIds = topCities.map((t) => t.cityId);
    const cities = await db.city.findMany({ where: { id: { in: cityIds } } });
    const topCitiesData = topCities.map((t) => ({
      city: cities.find((c) => c.id === t.cityId),
      trips: t._count,
    }));

    // Activity type distribution
    const activityTypes = await db.activity.groupBy({
      by: ["type"],
      _count: true,
    });

    return NextResponse.json({
      stats: { totalUsers, totalTrips, totalCities, totalActivities, totalPosts, totalExpenses },
      recentUsers: recentUsers.map((u) => u.createdAt),
      tripsByStatus: tripsByStatus.map((t) => ({ status: t.status, count: t._count })),
      topCitiesData,
      activityTypes: activityTypes.map((a) => ({ type: a.type, count: a._count })),
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
