import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Key } from '../entities/key.entity';
import { Redis } from 'ioredis';
import { IKey } from '../interfaces/key.interface';

@Injectable()
export class KeySubscriber implements OnModuleInit {
    private redis: Redis;

    constructor(
        @InjectRepository(Key)
        private keyRepository: Repository<Key>,
    ) {
        this.redis = new Redis({ host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) });
    }

    onModuleInit() {
        this.redis.subscribe('key-updates', (err) => {
            if (err) console.error('Redis subscription error:', err);
        });

        this.redis.on('message', async (channel, message) => {
            if (channel !== 'key-updates') return;
            const { action, key }: { action: string; key: IKey | string } = JSON.parse(message);

            if (action === 'create' || action === 'update') {
                const keyData = key as IKey;
                await this.keyRepository.save(keyData);
            } else if (action === 'delete') {
                await this.keyRepository.delete({ key: key as string });
            }
        });
    }
}