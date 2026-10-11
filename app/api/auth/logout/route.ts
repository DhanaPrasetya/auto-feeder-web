import { NextRequest, NextResponse } from "next/server";

// logout
export async function POST(request: NextRequest) {
	const body = await request.json();

	// Example response after creating a user
	return NextResponse.json({ message: "Logout successful !" }, { status: 200 });
}
