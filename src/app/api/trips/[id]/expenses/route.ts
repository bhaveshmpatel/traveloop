import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/trips/[id]/expenses">
) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await ctx.params;
    const trip = await db.trip.findFirst({
      where: { id, userId: user.id },
      include: {
        stops: { include: { city: true, activities: { include: { activity: true } } } },
        expenses: { orderBy: { date: "desc" } },
      },
    });
    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    return NextResponse.json({ trip });
  } catch (error) {
    console.error("Expenses fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/trips/[id]/expenses">
) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await ctx.params;
    const body = await request.json();
    const expense = await db.expense.create({
      data: {
        tripId: id,
        category: body.category || "OTHER",
        description: body.description,
        amount: parseFloat(body.amount),
        date: body.date ? new Date(body.date) : new Date(),
        isPaid: body.isPaid || false,
      },
    });
    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.error("Expense create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  ctx: RouteContext<"/api/trips/[id]/expenses">
) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    if (body.expenseId) {
      await db.expense.update({
        where: { id: body.expenseId },
        data: { isPaid: body.isPaid },
      });
    }
    if (body.markAllPaid) {
      const { id } = await ctx.params;
      await db.expense.updateMany({ where: { tripId: id }, data: { isPaid: true } });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Expense update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const expenseId = searchParams.get("expenseId");
    if (expenseId) await db.expense.delete({ where: { id: expenseId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Expense delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
