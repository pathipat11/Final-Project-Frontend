/* eslint-disable @typescript-eslint/no-unused-vars */
import Price from "@/app/models/price"; // Adjust path as necessary
import { connectToDatabase } from "@/app/lib/mongodb";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

// READ data
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDatabase();
    const priceEntry = await Price.findById(id);
    
    if (!priceEntry) {
      return NextResponse.json({ message: "Price entry not found" }, { status: 404 });
    }

    return NextResponse.json({ data: priceEntry });
  } catch (err) {
    return NextResponse.json({
        error: err,
      });
  }
}

// Update
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = params;
      const body = await req.json();
      await connectToDatabase();
  
      const updatedEntry = await Price.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedEntry) {
        return NextResponse.json({ message: "Price entry not found" }, { status: 404 });
      }
  
      return NextResponse.json({ data: updatedEntry });
    } catch (err) {
        return NextResponse.json({
            error: err,
          });
    }
  }
  

// Delete
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = params;
      await connectToDatabase();
      
      const deletedEntry = await Price.findByIdAndDelete(id);
  
      if (!deletedEntry) {
        return NextResponse.json({ message: "Price entry not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Price entry deleted successfully" });
    } catch (err) {
        return NextResponse.json({
            error: err,
          });
    }
  }
  