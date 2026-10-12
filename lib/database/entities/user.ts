import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import type { Schedules } from "./schedules";

@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	username: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at: Date;

	@Column({
		type: "timestamp",
		onUpdate: "CURRENT_TIMESTAMP",
		nullable: true,
	})
	updated_at: Date;

	@OneToOne("Schedules", (schedules: Schedules) => schedules.user)
	schedules: Schedules;
}
