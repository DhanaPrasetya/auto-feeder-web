import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	ManyToOne,
	Index,
} from "typeorm";
import { User } from "./user";
import { FeedLogs } from "./feed_logs";

@Entity()
export class Devices {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	@Index()
	name: string;

	@Column({ type: "timestamp", array: true })
	schedules: Date[];

	@Column()
	@Index()
	send_topic: string;

	@Column()
	@Index()
	receive_topic: string;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at: Date;

	@UpdateDateColumn({ type: "timestamp", nullable: true })
	updated_at: Date;

	// ManyToOne holds the onDelete option and join column definition
	@ManyToOne(() => User, (user) => user.devices, { onDelete: "RESTRICT" })
	@JoinColumn({ name: "user_id" })
	user: User;

	@Column({ type: "uuid", name: "user_id" })
	@Index()
	user_id: string;

	@OneToMany(() => FeedLogs, (feedLogs) => feedLogs.device)
	feedLogs: FeedLogs[];
}
