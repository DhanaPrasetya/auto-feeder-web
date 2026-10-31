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
		// FIXED CLIENT ID: Required for persistent sessions (clean: false)
		clientId: "feeder_api_backend_persistent_client",

		// FALSE: Tells the broker to queue QoS 1/2 messages while offline
		clean: false,

		connectTimeout: 4000,
		reconnectPeriod: 5000,
	};
	const client = mqtt.connect(brokerUrl, options);

	client.on("connect", () => {
		console.log("\n------------------------------\n");
		console.log(`Connected to broker (Persistent Mode): ${brokerUrl}`);

		// When clean: false, subscription is technically saved on the broker,
		// but re-subscribing on connect is safe practice in MQTT libraries.
		client.subscribe(receiveTopic, { qos: 1 }, (error) => {
			if (error) {
				console.error("Subscription error:", error);
				return;
			}

			console.log(`Successfully subscribed to ${receiveTopic}`);
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
