// import mqtt, { MqttClient, IClientOptions } from "mqtt";

// const brokerUrl = process.env.MQTT_URL || "mqtt://localhost:1883";

// const options: IClientOptions = {
// 	clientId: `feeder_api_${Math.random().toString(16).substring(2, 10)}`,
// 	clean: true,
// 	connectTimeout: 4000,
// 	reconnectPeriod: 5000, // Auto-reconnect every 5 seconds
// };

// const client: MqttClient = mqtt.connect(brokerUrl, options);

// client.on("connect", () => {
// 	console.log(`Connected to broker: ${brokerUrl}`);

// 	// Subscribe to a topic upon successful connection
// 	const targetTopic = process.env.MQTT_TOPIC || "test/topic";

// 	client.subscribe(targetTopic, { qos: 1 }, (err) => {
// 		if (!err) {
// 			console.log(`Successfully subscribed to ${targetTopic}`);

// 			// Publish a test message
// 			const payload = JSON.stringify({ status: "ok", timestamp: Date.now() });
// 			client.publish(targetTopic, payload, { qos: 1 });
// 		} else {
// 			console.error("Subscription error:", err);
// 		}
// 	});
// });

// // Handle Incoming Messages Type-Safely
// client.on("message", (topic: string, message: Buffer) => {
// 	// Payload arrives as a Buffer; convert it to string
// 	const stringMessage = message.toString();
// 	console.log(`Received on [${topic}]: ${stringMessage}`);
// });

// // Global Error Handling
// client.on("error", (error: Error) => {
// 	console.error("MQTT Client Error:", error);
// });
