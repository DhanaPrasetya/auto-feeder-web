import "reflect-metadata";
import { Service, Token } from "typedi";
import DeviceRepository from "./deviceRepository";
import { Devices } from "@/lib/database/entities/devices";
import IotRepository from "../iot/iotRepository";
import crypto from "crypto";
import { addDeviceData } from "./deviceRepository";
import { sendTopicPattern, receiveTopicPattern } from "@/constant/topicPattern";

function generateRandomBase62(length: number): string {
	const charset =
		"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let result = "";

	const randomBytes = crypto.randomBytes(length);

	for (let i = 0; i < length; i++) {
		result += charset[randomBytes[i] % 62];
	}

	return result;
}

export const DEVICE_SERVICE_TOKEN = new Token<DeviceService>(
	"DEVICE_SERVICE_TOKEN",
);

@Service(DEVICE_SERVICE_TOKEN)
export default class DeviceService {
	constructor(
		private deviceRepository: DeviceRepository,
		private iotRepository: IotRepository,
	) {}

	async addDevice(deviceData: addDeviceData): Promise<object> {
		try {
			let sendTopic = `${sendTopicPattern}/${deviceData.name}/`;
			let receiveTopic = `${receiveTopicPattern}/${deviceData.name}/`;

			const length: number = deviceData.name.length;

			const base62String = generateRandomBase62(81 - length);

			sendTopic += base62String;
			receiveTopic += base62String;

			const storedDevice: addDeviceData = {
				name: deviceData.name,
				schedules: deviceData.schedules,
				send_topic: sendTopic,
				receive_topic: receiveTopic,
			};

			await this.deviceRepository.addDevice(storedDevice);

			await this.iotRepository.publish({
				sendTopicPattern,
				schedule: deviceData.schedules,
			});

			return {
				send_topic: sendTopicPattern,
				receive_topic: receiveTopicPattern,
			};
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async updateDeviceSchedule(id: string, schedule: Date[]): Promise<void> {
		try {
			const updatedDevice: Devices =
				await this.deviceRepository.updateDeviceSchedule(id, schedule);

			await this.iotRepository.publish({
				identifier: updatedDevice.send_topic,
				schedule: updatedDevice.schedules,
			});

			return;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async getDeviceById(id: string): Promise<Devices | null> {
		return await this.deviceRepository.getDeviceById(id);
	}
}
