import "reflect-metadata";
import { Service, Token } from "typedi";
import ScheduleRepository from "./scheduleRepository";
import { Schedules } from "@/lib/database/entities/schedules";
import IotRepository from "../iot/iotRepository";
import crypto from "crypto";
import { NotFoundError } from "@/lib/helper/errors";

export const SCHEDULE_SERVICE_TOKEN = new Token<ScheduleService>(
	"SCHEDULE_SERVICE_TOKEN",
);

@Service(SCHEDULE_SERVICE_TOKEN)
export default class ScheduleService {
	constructor(
		private scheduleRepository: ScheduleRepository,
		private iotRepository: IotRepository,
	) {}

	async addSchedule(schedule: Schedules): Promise<void> {
		try {
			await this.scheduleRepository.addSchedule(schedule);

			const identifier = crypto.randomUUID();

			const responsePromise = this.iotRepository.listen(identifier);

			await this.iotRepository.publish({
				identifier,
				schedule: schedule.time_array,
			});

			await responsePromise;

			return;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async updateSchedule(id: string, data: Partial<Schedules>): Promise<void> {
		try {
			await this.scheduleRepository.updateSchedule(id, data);
			const schedule = await this.getScheduleById(id);
			if (!schedule) {
				throw new NotFoundError(`Schedule not found !`);
			}
			const identifier = crypto.randomUUID();

			const responsePromise = this.iotRepository.listen(identifier);

			await this.iotRepository.publish({
				identifier,
				schedule: schedule.time_array,
			});

			await responsePromise;

			return;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async getScheduleById(id: string): Promise<Schedules | null> {
		return await this.scheduleRepository.getScheduleById(id);
	}
}
