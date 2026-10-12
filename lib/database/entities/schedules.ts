import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	JoinColumn,
	OneToOne,
	UpdateDateColumn,
	OneToMany,
} from "typeorm";
import type { User } from "./user";
import type { FeedLogs } from "./feed_logs";

@Entity()
export class Schedules {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "timestamp", array: true })
	time_array: Date[];

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at: Date;

	@UpdateDateColumn({ type: "timestamp", nullable: true })
	updated_at: Date;

	@OneToOne("User", (user: User) => user.schedules, { onDelete: "RESTRICT" })
	@JoinColumn({ name: "user_id" })
	user: User;

	@OneToMany("FeedLogs", (feedLogs: FeedLogs) => feedLogs.schedules, {
		onDelete: "RESTRICT",
	})
	FeedLogs: FeedLogs;
}
