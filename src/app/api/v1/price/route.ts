import { NextResponse } from "next/server";
import Price from "@/models/price";
import { connectToDatabase } from "@/app/lib/mongodb";

// POST method to add a new income/expense entry
export async function POST(req: Request) {
  await connectToDatabase();
  const { amount, date, type, note, userId } = await req.json();
  
  if (!amount || !date || !type || !userId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (type !== 'income' && type !== 'expense') {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const newPrice = new Price({
    amount,
    date,
    type,
    note,
    userId,
  });

  await newPrice.save();

  return NextResponse.json(newPrice, { status: 201 });
}
