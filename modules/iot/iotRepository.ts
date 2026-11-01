import "reflect-metadata";
import { startMqtt } from "../../lib/broker/mqttConfig";
import { Service, Token } from "typedi";

export const IOT_REPO_TOKEN = new Token<IotRepository>("IOT_REPO_TOKEN");

export type IncomingMessage = {
	receiveTopic: string;
	message: string;
};

type PublishMessage = {
	sendTopic?: string;
	[key: string]: unknown;
};

@Service({ id: IOT_REPO_TOKEN, global: true })
export default class IotRepository {
	private readonly client = startMqtt();
	private readonly receiveTopic =
		process.env.RECEIVE_TOPIC || "test/topic";
	private listenPromise: Promise<void> | null = null;

	public async publish(message: unknown): Promise<void> {
		const publishMessage =
			typeof message === "object" && message !== null
				? (message as PublishMessage)
				: undefined;
		const sendTopic =
			publishMessage?.sendTopic ||
			process.env.SEND_TOPIC ||
			"test/topic";
		const payload =
			typeof message === "string" ? message : JSON.stringify(message);

		await new Promise<void>((resolve, reject) => {
			this.client.publish(sendTopic, payload, { qos: 1 }, (error) => {
				if (error) {
					reject(error);
					return;
				}

				resolve();
			});
		});
	}

	public async listen(
		onMessageReceived: (response: IncomingMessage) => void | Promise<void>,
	): Promise<void> {
		if (!this.listenPromise) {
			this.listenPromise = new Promise<void>((resolve, reject) => {
				this.client.subscribe(
					this.receiveTopic,
					{ qos: 1 },
					(error) => {
						if (error) {
							this.listenPromise = null;
							reject(error);
							return;
						}

						console.log(
							`Successfully listening persistently on: ${this.receiveTopic}`,
						);

						this.client.on(
							"message",
							(receivedTopic: string, message: Buffer) => {
								if (receivedTopic !== this.receiveTopic) {
									return;
								}

								const incomingMessage: IncomingMessage = {
									receiveTopic: receivedTopic,
									message: message.toString(),
								};

								Promise.resolve(onMessageReceived(incomingMessage)).catch(
									(error) => {
										console.error(
											"Error processing incoming MQTT message:",
											error,
										);
									},
								);
							},
						);
						resolve();
					},
				);
			});
		}

		await this.listenPromise;
	}
}
