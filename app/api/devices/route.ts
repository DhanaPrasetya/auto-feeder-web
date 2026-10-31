import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/lib/helper/errorHandler";

// add device
export const POST = errorHandler(async (request: NextRequest) => {
	const addDevice = await request.json();

	return NextResponse.json(
		{ message: "Device added successfully !" },
		{ status: 201 },
	);
});

// get paginated device data
export const GET = errorHandler(async (request: NextRequest) => {
	return NextResponse.json(
		{ message: "Device data fetched successfully !" },
		{ status: 200 },
	);
});

// update device data
export const PATCH = errorHandler(async (request: NextRequest) => {
	const body = await request.json();

	return NextResponse.json(
		{ message: "Device data updated successfully !" },
		{ status: 200 },
	);
});

// delete device data
export const DELETE = errorHandler(async (request: NextRequest) => {
	const body = await request.json();

	return NextResponse.json(
		{ message: "Feed schedule deleted successfully !" },
		{ status: 200 },
	);
});
