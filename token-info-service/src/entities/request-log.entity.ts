import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RequestLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    key: string;

    @Column({ type: 'bigint' })
    timestamp: number;

    @Column()
    success: boolean;
}