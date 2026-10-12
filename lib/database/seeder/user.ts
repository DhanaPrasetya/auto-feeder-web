import "reflect-metadata";
import { AppDataSource } from "../data-source"; // Adjust path to your DataSource
import { User } from "../entities/user"; // Adjust path to your User entity
import argon2 from "argon2";

async function seed() {
	console.log("🌱 Starting database seeding...");

	try {
		// 1. Initialize DB connection
		await AppDataSource.initialize();
		console.log("✅ Data Source initialized successfully.");

		// 2. Get Repositories
		const userRepository = AppDataSource.getRepository(User);

		// Hash the password
		const hashedPassword = await argon2.hash("password123");

		// 4. Seed Users
		console.log("👤 Seeding Users...");
		const user1 = userRepository.create({
			username: "Mock",
			email: "mock@gmail.com",
			password: hashedPassword,
		});

		// Save users to get generated primary keys
		await userRepository.save(user1);

		console.log("🎉 Seeding completed successfully!");
	} catch (error) {
		console.error("❌ Error during seeding:", error);
		process.exitCode = 1;
	} finally {
		// 6. Close the connection
		if (AppDataSource.isInitialized) {
			await AppDataSource.destroy();
			console.log("🔌 Connection closed.");
		}
	}
}

seed();
