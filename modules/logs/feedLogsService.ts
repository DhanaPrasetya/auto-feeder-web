import "reflect-metadata";
import { Inject, Service, Token } from "typedi";
import FeedLogsRepository from "./feedLogsRepository";
import { FEED_LOGS_REPO_TOKEN } from "./feedLogsRepository";
import { FeedLogs } from "@/lib/database/entities/feed_logs";

export const FEED_LOGS_SERVICE_TOKEN = new Token<FeedLogsService>(
	"FEED_LOGS_SERVICE_TOKEN",
);

@Service(FEED_LOGS_SERVICE_TOKEN)
export default class FeedLogsService {
	constructor(
		@Inject(FEED_LOGS_REPO_TOKEN)
		private readonly feedLogRepository: FeedLogsRepository,
	) {}

	async addLogs(device_id: string): Promise<void> {
		try {
			await this.feedLogRepository.addLogs(device_id);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async index(
		user_id: string,
		device_id: string,
		date: Date,
	): Promise<FeedLogs[]> {
		try {
			return await this.feedLogRepository.getLogsIndex(
				user_id,
				device_id,
				date,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
