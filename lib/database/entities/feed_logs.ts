import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	Index,
	CreateDateColumn,
} from "typeorm";
import { Devices } from "./devices";

@Entity()
export class FeedLogs {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at: Date;

	// Explicit JoinColumn mapping to device_id
	@ManyToOne(() => Devices, (device) => device.feedLogs, {
		onDelete: "RESTRICT",
	})
	@JoinColumn({ name: "device_id" })
	device: Devices;

	@Column({ type: "uuid", name: "device_id" })
	@Index()
	device_id: string;
}
