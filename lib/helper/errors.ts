export class NotFoundError extends Error {
	public statusCode = 404;

	constructor(message: string = "Resource not found") {
		super(message);
		this.name = "NotFoundError";
	}
}

export class BadRequestError extends Error {
	public statusCode = 400;

	constructor(message: string = "Bad request") {
		super(message);
		this.name = "BadRequestError";
	}
}
