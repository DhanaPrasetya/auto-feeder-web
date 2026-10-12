import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { errorHandler } from "@/lib/helper/errorHandler";

// logout
export const POST = errorHandler(async () => {
	const cookieStore = await cookies();
	cookieStore.delete("accessToken");
	return NextResponse.json({ message: "Logout successful !" }, { status: 200 });
});
