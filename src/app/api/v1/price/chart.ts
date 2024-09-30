import { NextResponse } from "next/server";
import Price from "@/models/price";
import { connectToDatabase } from "@/app/lib/mongodb";

// POST method to handle simple chat-like interaction
export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const { userId, message } = await req.json();

    if (!userId || !message) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    // Basic "chat" commands for interacting with the system
    let responseMessage = "Sorry, I don't understand that.";

    if (message.toLowerCase().includes("total income")) {
      const incomeTotal = await Price.aggregate([
        { $match: { userId, type: 'income' } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      responseMessage = `Your total income is ${incomeTotal[0]?.total || 0}`;
    } else if (message.toLowerCase().includes("total expense")) {
      const expenseTotal = await Price.aggregate([
        { $match: { userId, type: 'expense' } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      responseMessage = `Your total expense is ${expenseTotal[0]?.total || 0}`;
    } else if (message.toLowerCase().includes("latest transactions")) {
      const transactions = await Price.find({ userId }).sort({ date: -1 }).limit(5);
      responseMessage = `Here are your latest transactions: ${transactions
        .map((t) => `${t.type} ${t.amount} on ${t.date}`)
        .join(", ")}`;
    }

    return NextResponse.json({ response: responseMessage }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to process chat", error }, { status: 500 });
  }
}
