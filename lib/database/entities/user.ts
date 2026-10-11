import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Schedules } from "./schedules";

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
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt: Date;

	@OneToOne(() => Schedules, (schedules) => schedules.user)
	schedules: Schedules;
}
