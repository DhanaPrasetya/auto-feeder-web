import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
	// This logic only executes for routes defined in the matcher below
	const accessToken = request.cookies.get("accessToken");

	if (!accessToken) {
		return NextResponse.json(
			{ success: false, message: "Auth failed: Missing Access Token" },
			{ status: 401 },
		);
	}

	const secretKey = process.env.JWT_SECRET as string;
	const secretKeyBuffer = new TextEncoder().encode(secretKey);

	try {
		const { payload } = await jwtVerify(accessToken.value, secretKeyBuffer);
		return NextResponse.next();
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Auth failed: Invalid Access Token" },
			{ status: 401 },
		);
	}
}

// Limit the middleware to specific paths
export const config = {
	matcher: ["/api/auth/logout"],
};
