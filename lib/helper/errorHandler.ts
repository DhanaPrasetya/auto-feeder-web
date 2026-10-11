// src/lib/api-handler.ts
import { NextRequest, NextResponse } from "next/server";
import { NotFoundError, BadRequestError } from "@/lib/helper/errors";

type Handler = (req: NextRequest, context?: unknown) => Promise<NextResponse>;

export function errorHandler(handler: Handler): Handler {
	return async (req, context) => {
		try {
			return await handler(req, context);
		} catch (error: unknown) {
			if (error instanceof NotFoundError || error instanceof BadRequestError) {
				return NextResponse.json(
					{ error: error.message },
					{ status: error.statusCode },
				);
			}

			console.error("Unhandled API Error:", error);
			return NextResponse.json(
				{ error: "Internal Server Error" },
				{ status: 500 },
			);
		}
	};
}
