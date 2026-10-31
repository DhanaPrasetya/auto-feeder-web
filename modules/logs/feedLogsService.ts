import "reflect-metadata";
import { Service, Token } from "typedi";
import DeviceRepository from "./feedLogsRepository";
import IotRepository from "../iot/iotRepository";
import { FeedLogs } from "@/lib/database/entities/feed_logs";

export const FEED_LOGS_SERVICE_TOKEN = new Token<FeedLogsService>(
	"FEED_LOGS_SERVICE_TOKEN",
);

@Service(FEED_LOGS_SERVICE_TOKEN)
export default class FeedLogsService {
	constructor(
		private deviceRepository: DeviceRepository,
		private iotRepository: IotRepository,
	) {}

	async addLogs(device_id: string): Promise<void> {
		try {
			await this.deviceRepository.addLogs(device_id);
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
			return await this.deviceRepository.getLogsIndex(user_id, device_id, date);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
