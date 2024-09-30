import { NextResponse } from "next/server";
import Price from "@/models/price"; // Adjust path based on your setup
import { connectToDatabase } from "@/app/lib/mongodb";

// GET method to calculate total income and expense
export async function GET(req: Request) {
  await connectToDatabase();

  const userId = req.headers.get("userId");

  try {
    // Calculate total income
    const incomeTotal = await Price.aggregate([
      { $match: { userId, type: 'income' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Calculate total expense
    const expenseTotal = await Price.aggregate([
      { $match: { userId, type: 'expense' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    return NextResponse.json({
      incomeTotal: incomeTotal[0]?.total || 0,
      expenseTotal: expenseTotal[0]?.total || 0,
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to calculate totals" }, { status: 500 });
  }
}
