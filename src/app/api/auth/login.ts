import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/user'; // Ensure you have a User model

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Store securely in env

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Find user in your database (ensure you hash and compare passwords properly)
  const user = await User.findOne({ username });
  if (!user || user.password !== password) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

  return NextResponse.json({ token });
}
