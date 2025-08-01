// auth/login/route.ts
import { NextResponse } from 'next/server';
import User from '@/app/models/user';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Make sure this is secure

export async function POST(req: Request) {
    const { username, password } = await req.json();
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    return NextResponse.json({ token });
}
