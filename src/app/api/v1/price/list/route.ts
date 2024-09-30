import { NextResponse } from "next/server";
import Price from "@/models/price"; // Adjust path based on your setup
import { connectToDatabase } from "@/app/lib/mongodb";

// GET method to fetch all entries
export async function GET(req: Request) {
  await connectToDatabase();

  const userId = req.headers.get("userId");

  try {
    // Fetch all entries for the current user
    const entries = await Price.find({ userId }).sort({ date: -1 });

    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch entries" }, { status: 500 });
  }
}
