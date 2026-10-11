import "reflect-metadata";
import { Container } from "typedi";
import { NextRequest, NextResponse } from "next/server";
import UserService from "@/modules/users/userService";
import { LoginSchema } from "@/app/actions/login";
import { errorHandler } from "@/lib/helper/errorHandler";

const userService = Container.get(UserService);

export const POST = errorHandler(async (req: NextRequest) => {
	const body: unknown = await req.json();

	const result = LoginSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json(
			{
				message: "Validation failed",
				errors: result.error.flatten().fieldErrors,
			},
			{ status: 400 },
		);
	}

	const accessToken: string = await userService.login(
		result.data.email,
		result.data.password,
	);

	const response: NextResponse = NextResponse.json(
		{ message: "Login successful" },
		{ status: 200 },
	);

	response.cookies.set("authToken", accessToken, {
		httpOnly: true,
		secure: process.env.ENV === "prod",
		sameSite: "lax",
		path: "/",
	});

	return response;
});
