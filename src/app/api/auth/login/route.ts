import { NextRequest, NextResponse } from "next/server";
import { validateCredentials, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  if (!validateCredentials(username, password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  await setAuthCookie();
  return NextResponse.json({ success: true });
}
