import "reflect-metadata";
import { Service, Inject } from "typedi";
import UserRepository from "./userRepository";
import argon2 from "argon2";
import { NotFoundError, BadRequestError } from "@/lib/helper/errors";
import jwt from "jsonwebtoken";

@Service()
export default class UserService {
	@Inject(() => UserRepository)
	private readonly userRepository!: UserRepository;

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

		const accessToken: string = jwt.sign(
			{ id: userData.id, name: userData.username },
			process.env.JWT_SECRET as string,
			{ expiresIn: "1h" },
		);

		return accessToken;
	}
}
