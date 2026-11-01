import "reflect-metadata";
import { Inject, Service, Token } from "typedi";
import { IOT_REPO_TOKEN } from "./iotRepository";
import IotRepository from "./iotRepository";
import { IncomingMessage } from "./iotRepository";
import deviceService, { DEVICE_SERVICE_TOKEN } from "../devices/deviceService";
import feedLogsService, {
	FEED_LOGS_SERVICE_TOKEN,
} from "../logs/feedLogsService";

export const IOT_SERVICE_TOKEN = new Token<IotService>("IOT_SERVICE_TOKEN");

@Service({ id: IOT_SERVICE_TOKEN, global: true })
export default class IotService {
	constructor(
		@Inject(IOT_REPO_TOKEN)
		private readonly iotRepository: IotRepository,

		@Inject(DEVICE_SERVICE_TOKEN)
		private readonly deviceService: deviceService,

		@Inject(FEED_LOGS_SERVICE_TOKEN)
		private readonly feedLogsService: feedLogsService,
	) {}

	async publish(message: unknown): Promise<void> {
		try {
			await this.iotRepository.publish(message);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async listen(): Promise<void> {
		await this.iotRepository.listen(async (incomingMessage: IncomingMessage) => {
			switch (incomingMessage.message) {
				case "feed_success": {
					const deviceData =
						await this.deviceService.getDeviceDataByReceiveTopic(
							incomingMessage.receiveTopic,
						);

					if (deviceData) {
						await this.feedLogsService.addLogs(deviceData.id);
					}
					break;
				}
				case "request_schedule": {
					const scheduleData =
						await this.deviceService.getDeviceDataByReceiveTopic(
							incomingMessage.receiveTopic,
						);

					if (scheduleData) {
						await this.iotRepository.publish({
							sendTopic: scheduleData.send_topic,
							schedule: scheduleData.schedules,
						});
					}
					break;
				}
				default:
					console.log(
						`Received unknown message "${incomingMessage.message}" on [${incomingMessage.receiveTopic}]`,
					);
			}
		});
	}
}
