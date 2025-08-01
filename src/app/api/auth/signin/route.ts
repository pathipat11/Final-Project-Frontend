import { NextResponse } from 'next/server';
import User from '@/app/models/user';

export async function POST(req: Request) {
    const { username, password } = await req.json();
    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
}
