import mqtt, { MqttClient, IClientOptions } from "mqtt";

const mqttGlobal = globalThis as typeof globalThis & {
	mqttClient?: MqttClient;
};

export function startMqtt(): MqttClient {
	if (mqttGlobal.mqttClient) {
		return mqttGlobal.mqttClient;
	}

	console.log("\n------------------------------\n");

	const brokerUrl = process.env.MQTT_URL || "mqtt://localhost:1883";
	const sendTopic = process.env.SEND_TOPIC || "test/topic";
	const receiveTopic = process.env.RECEIVE_TOPIC || "test/response";

	const options: IClientOptions = {
		clientId: `feeder_api_${Math.random().toString(16).substring(2, 10)}`,
		clean: true,
		connectTimeout: 4000,
		reconnectPeriod: 5000,
	};
	const client = mqtt.connect(brokerUrl, options);

	client.on("connect", () => {
		console.log("\n------------------------------\n");
		console.log(`Connected to broker: ${brokerUrl}`);

		client.subscribe(receiveTopic, { qos: 1 }, (error) => {
			if (error) {
				console.error("Subscription error:", error);
				return;
			}

			console.log(`Successfully subscribed to ${receiveTopic}`);
			const payload = JSON.stringify({ status: "ok", timestamp: Date.now() });
			client.publish(sendTopic, payload, { qos: 1 }, (publishError) => {
				if (publishError) {
					console.error("Publish error:", publishError);
					return;
				}

				console.log(`Published startup message to ${sendTopic}`);
			});
		});
	});

	client.on("message", (topic: string, message: Buffer) => {
		console.log(`Received on [${topic}]: ${message.toString()}`);
	});

	client.on("error", (error: Error) => {
		console.error("MQTT Client Error:", error);
	});

	mqttGlobal.mqttClient = client;
	return client;
}
