import { NextResponse } from "next/server";
import Price from "@/models/price";
import { connectToDatabase } from "@/app/lib/mongodb";

// GET method for fetching chart data
export async function GET(req: Request) {
  await connectToDatabase();
  const userId = req.headers.get("userId");

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  try {
    const data = await Price.aggregate([
      { $match: { userId, date: { $gte: twoMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$date" },
          totalIncome: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
        },
      },
    ]);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch chart data" }, { status: 500 });
  }
}
