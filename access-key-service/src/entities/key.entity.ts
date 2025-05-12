import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Key {
    @PrimaryColumn()
    key: string;

    @Column()
    rateLimit: number;

    @Column({ type: 'bigint' })
    expiration: number;

    @Column({ default: true })
    isActive: boolean;
}