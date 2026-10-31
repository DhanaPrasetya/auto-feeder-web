import { Devices } from "../../lib/database/entities/devices";
import { AppDataSource } from "../../lib/database/data-source";
import { Service, Token } from "typedi";
import { NotFoundError } from "@/lib/helper/errors";

export const DEVICE_REPO_TOKEN = new Token<Devices>("DEVICE_REPO_TOKEN");

export type addDeviceData = {
	name: string;
	schedules: Date[];
	send_topic: string;
	receive_topic: string;
};

@Service(DEVICE_REPO_TOKEN)
export default class DeviceRepository {
	private async initialize() {
		await AppDataSource.initialize();
	}

	private deviceRepo = AppDataSource.getRepository(Devices);

	constructor() {
		this.initialize();
	}

	async addDevice(schedule: addDeviceData): Promise<void> {
		await this.deviceRepo.save(schedule);
	}

	async updateDeviceSchedule(id: string, schedule: Date[]): Promise<Devices> {
		const updatedSchedule: Devices = await this.deviceRepo
			.createQueryBuilder()
			.update(Devices)
			.set({ schedules: schedule })
			.where("id = :id", { id })
			.returning("*")
			.execute()
			.then((result) => result.raw[0]);

		if (!updatedSchedule) {
			throw new NotFoundError(`Device not found!`);
		}

		return updatedSchedule;
	}

	async getDeviceById(id: string): Promise<Devices | null> {
		return await this.deviceRepo.findOneBy({ id });
	}
}
