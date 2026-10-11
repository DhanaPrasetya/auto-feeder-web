import "reflect-metadata";
import { Service } from "typedi";
import ScheduleRepository from "./scheduleRepository";
import { Schedules } from "@/lib/database/entities/schedules";

@Service()
export default class UserService {
	constructor(private scheduleRepository: ScheduleRepository) {}

	async addSchedule(schedule: Schedules): Promise<Schedules> {
		return await this.scheduleRepository.addSchedule(schedule);
	}

	async deleteSchedule(id: string): Promise<void> {
		await this.scheduleRepository.deleteSchedule(id);
	}

	async getScheduleById(id: string): Promise<Schedules | null> {
		return await this.scheduleRepository.getScheduleById(id);
	}
}
