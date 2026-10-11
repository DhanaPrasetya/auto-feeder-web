import { Schedules } from "./../../lib/database/entities/schedules";
import { AppDataSource } from "../../lib/database/data-source";

export default class UserRepository {
	private async initialize() {
		await AppDataSource.initialize();
	}

	private userRepo = AppDataSource.getRepository(Schedules);

	constructor() {
		this.initialize();
	}

	async addSchedule(schedule: Schedules): Promise<Schedules> {
		return await this.userRepo.save(schedule);
	}

	async deleteSchedule(id: string): Promise<void> {
		await this.userRepo.delete(id);
	}

	async getScheduleById(id: string): Promise<Schedules | null> {
		return await this.userRepo.findOneBy({ id });
	}
}
