import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/lib/helper/errorHandler";

// add feed schedule
export const POST = errorHandler(async (request: NextRequest) => {
	const body = await request.json();

	return NextResponse.json(
		{ message: "Feed schedule added successfully !" },
		{ status: 201 },
	);
});

// update feed schedule
export const GET = errorHandler(async (request: NextRequest) => {
	const body = await request.json();

	return NextResponse.json(
		{ message: "Feed schedule fetched successfully !" },
		{ status: 200 },
	);
});

// update feed schedule
export const PUT = errorHandler(async (request: NextRequest) => {
	const body = await request.json();

	return NextResponse.json(
		{ message: "Feed schedule updated successfully !" },
		{ status: 200 },
	);
});

// delete feed schedule
export const DELETE = errorHandler(async (request: NextRequest) => {
	const body = await request.json();

	return NextResponse.json(
		{ message: "Feed schedule deleted successfully !" },
		{ status: 200 },
	);
});
