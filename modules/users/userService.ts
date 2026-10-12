import "reflect-metadata";
import { Service, Inject, Token } from "typedi";
import UserRepository from "./userRepository";
import argon2 from "argon2";
import { NotFoundError, BadRequestError } from "@/lib/helper/errors";
import { SignJWT } from "jose";
import { USER_REPO_TOKEN } from "./userRepository";

export const USER_SERVICE_TOKEN = new Token<UserService>("USER_SERVICE_TOKEN");

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

@Service(USER_SERVICE_TOKEN)
export default class UserService {
	constructor(
		@Inject(USER_REPO_TOKEN) private readonly userRepository: UserRepository,
	) {}

	async login(email: string, password: string): Promise<string> {
		const userData = await this.userRepository.findbyEmail(email);

		if (!userData) {
			throw new NotFoundError(`User not found`);
		}

		const isPasswordValid: boolean = await argon2.verify(
			userData.password,
			password,
		);

		if (!isPasswordValid) {
			throw new BadRequestError(`Invalid password or email`);
		}

		const accessToken: Promise<string> = new SignJWT({
			id: userData.id,
			name: userData.username,
		})
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("1h")
			.sign(JWT_SECRET);

		return accessToken;
	}
}
