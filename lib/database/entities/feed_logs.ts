import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import type { Schedules } from "./schedules";

@Entity()
export class FeedLogs {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ name: "schedule_id" })
	schedule_id: number;

	@Column()
	time_array: Date;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at: Date;

	@OneToMany("Schedules", (schedules: Schedules) => schedules.FeedLogs, {
		onDelete: "RESTRICT",
	})
	schedules: Schedules;
}
