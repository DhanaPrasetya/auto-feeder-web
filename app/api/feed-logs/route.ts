import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/lib/helper/errorHandler";

// get feed logs
export const GET = errorHandler(async (request: NextRequest) => {
	return NextResponse.json(
		{ message: "Feed logs fetched successfully !" },
		{ status: 200 },
	);
});
