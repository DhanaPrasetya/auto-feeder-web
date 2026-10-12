import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/user";
import { Schedules } from "./entities/schedules";
import { FeedLogs } from "./entities/feed_logs";
import { loadEnvConfig } from "@next/env";
import pg from "pg";

loadEnvConfig(process.cwd());

let synchronizeValue: boolean = false;

if (process.env.ENV === "local") {
	synchronizeValue = true;
}

export const AppDataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: synchronizeValue,
	logging: false,
	entities: [User, Schedules, FeedLogs],
	driver: pg,
	subscribers: [],
	migrations: ["./lib/database/migrations/*.{ts,js}"], // Migrations path
});
