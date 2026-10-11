import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Schedules } from "./schedules";
import { OneToMany } from "typeorm/browser/decorator/relations/OneToMany.js";

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

	@OneToMany(() => Schedules, (schedules) => schedules.FeedLogs, {
		onDelete: "RESTRICT",
	})
	schedules: Schedules;
}
