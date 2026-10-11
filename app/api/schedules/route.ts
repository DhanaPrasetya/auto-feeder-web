import { NextRequest, NextResponse } from "next/server";

// Add feed schedule
export async function POST(request: NextRequest) {
	const body = await request.json();

	return NextResponse.json(
		{ message: "Feed schedule added successfully !" },
		{ status: 201 },
	);
}

export async function PUT(request: NextRequest) {
	const body = await request.json();

	return NextResponse.json(
		{ message: "Feed schedule updated successfully !" },
		{ status: 200 },
	);
}

// Delete feed schedule
export async function DELETE(request: NextRequest) {
	const body = await request.json();

	return NextResponse.json(
		{ message: "Feed schedule deleted successfully !" },
		{ status: 200 },
	);
}
