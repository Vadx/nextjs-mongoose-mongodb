import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  const { firstName, lastName, email, password } = await req.json();

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 },
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { error: "User already exists." },
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  await user.save();

  return NextResponse.json(
    { message: "User created successfully." },
    { status: 201 },
  );
}
