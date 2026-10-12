import { AppDataSource } from "../../lib/database/data-source";
import { User } from "../../lib/database/entities/user";
import { Service, Token } from "typedi";

export const USER_REPO_TOKEN = new Token<UserRepository>("USER_REPO_TOKEN");

@Service(USER_REPO_TOKEN)
export default class UserRepository {
	private async initialize() {
		if (!AppDataSource.isInitialized) {
			await AppDataSource.initialize();
		}
	}

	async findbyEmail(email: string): Promise<User | null> {
		await this.initialize();
		return await AppDataSource.getRepository(User).findOne({
			where: { email },
		});
	}
}
