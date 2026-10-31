import { FeedLogs } from "../../lib/database/entities/feed_logs";
import { AppDataSource } from "../../lib/database/data-source";
import { Service, Token } from "typedi";
import { NotFoundError } from "@/lib/helper/errors";

export const LOGS_REPO_TOKEN = new Token<FeedLogs>("LOGS_REPO_TOKEN");

@Service(LOGS_REPO_TOKEN)
export default class LogsRepository {
	private async initialize() {
		await AppDataSource.initialize();
	}

	private logsRepo = AppDataSource.getRepository(FeedLogs);

	constructor() {
		this.initialize();
	}

	async addLogs(device_id: string): Promise<void> {
		try {
			await this.logsRepo.save({ device_id });
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async getLogsIndex(
		user_id: string,
		device_id: string,
		date: Date,
	): Promise<FeedLogs[]> {
		try {
			return await this.logsRepo
				.createQueryBuilder("logs")
				.innerJoin("logs.device", "device")
				.innerJoin("device.user", "user")
				.where("user.id = :user_id", { user_id })
				.andWhere("device.id = :device_id", { device_id })
				.andWhere("DATE(logs.created_at) = :date", {
					date: date.toISOString().split("T")[0],
				})
				.getMany();
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
