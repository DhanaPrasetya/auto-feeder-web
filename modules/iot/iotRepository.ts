import { startMqtt } from "../../lib/broker/mqttConfig";

export const IOT_REPO_TOKEN = Symbol("IOT_REPO_TOKEN");

export interface IotResponse {
	identifier: string;
	status: string;
	[key: string]: unknown;
}

export default class IotRepository {
	public async publish(message: unknown): Promise<void> {
		const client = startMqtt();
		const sendTopic = process.env.SEND_TOPIC || "test/topic";
		const payload =
			typeof message === "string" ? message : JSON.stringify(message);

		await new Promise<void>((resolve, reject) => {
			client.publish(sendTopic, payload, { qos: 1 }, (error) => {
				if (error) {
					reject(error);
					return;
				}

				resolve();
			});
		});
	}

	public async listen(
		identifier: string,
		topic: string = process.env.RECEIVE_TOPIC || "test/topic",
		timeoutMs = 10000,
	): Promise<IotResponse> {
		const client = startMqtt();

		return new Promise((resolve, reject) => {
			let timeout: NodeJS.Timeout;

			const cleanup = () => {
				clearTimeout(timeout);
				client.off("message", handleMessage);
			};

			const handleMessage = (receivedTopic: string, message: Buffer) => {
				if (receivedTopic !== topic) {
					return;
				}

				let response: IotResponse;
				try {
					response = JSON.parse(message.toString()) as IotResponse;
				} catch {
					return;
				}

				if (response.identifier !== identifier) {
					return;
				}

				cleanup();
				resolve(response);
			};

			timeout = setTimeout(() => {
				cleanup();
				reject(
					new Error(
						`Timed out waiting for MQTT response with identifier "${identifier}"`,
					),
				);
			}, timeoutMs);

			client.on("message", handleMessage);
			client.subscribe(topic, { qos: 1 }, (error) => {
				if (error) {
					cleanup();
					reject(error);
				}
			});
		});
	}
}
