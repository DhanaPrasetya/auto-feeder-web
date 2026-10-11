import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	JoinColumn,
	OneToOne,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from "typeorm";
import { User } from "./user";
import { FeedLogs } from "./feed_logs";

@Entity()
export class Schedules {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "timestamp", array: true })
	time_array: Date[];

	@CreateDateColumn({ type: "timestamp" })
	created_at: Date;

	@UpdateDateColumn({ type: "timestamp" })
	updated_at: Date;

	@OneToOne(() => User, (user) => user.schedules, { onDelete: "RESTRICT" })
	@JoinColumn({ name: "user_id" })
	user: User;

	@OneToMany(() => FeedLogs, (feedLogs) => feedLogs.schedules, {
		onDelete: "RESTRICT",
	})
	FeedLogs: FeedLogs;
}
