import { AppDataSource } from "../../lib/database/data-source";
import { User } from "../../lib/database/entities/user";

export default class UserRepository {
	private async initialize() {
		await AppDataSource.initialize();
	}

	private userRepo = AppDataSource.getRepository(User);

	constructor() {
		this.initialize();
	}

	async findbyEmail(email: string): Promise<User | null> {
		return await this.userRepo.findOne({ where: { email } });
	}
}
