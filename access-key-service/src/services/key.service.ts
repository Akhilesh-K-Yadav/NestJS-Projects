import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Key } from '../entities/key.entity';
import { CreateKeyDto } from '../dtos/create-key.dto';
import { UpdateKeyDto } from '../dtos/update-key.dto';
import { KeyPlanDto } from '../dtos/key-plan.dto';
import { IKey } from '../interfaces/key.interface';
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class KeyService {
    private redis: Redis;

    constructor(
        @InjectRepository(Key)
        private keyRepository: Repository<Key>,
    ) {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379
        });
    }

    async createKey(dto: CreateKeyDto): Promise<KeyPlanDto> {
        const key: IKey = {
            key: uuidv4(),
            rateLimit: dto.rateLimit,
            expiration: dto.expiration,
            isActive: true,
        };
        await this.keyRepository.save(key);
        await this.redis.publish('key-updates', JSON.stringify({ action: 'create', key }));
        return key;
    }

    async deleteKey(key: string): Promise<void> {
        const result = await this.keyRepository.delete({ key, isActive: true });
        if (result.affected === 0) throw new Error('Key not found or already inactive');
        await this.redis.publish('key-updates', JSON.stringify({ action: 'delete', key }));
    }

    async updateKey(key: string, dto: UpdateKeyDto): Promise<KeyPlanDto> {
        const keyEntity = await this.keyRepository.findOneBy({ key, isActive: true });
        if (!keyEntity) throw new Error('Key not found or inactive');
        if (dto.rateLimit) keyEntity.rateLimit = dto.rateLimit;
        if (dto.expiration) keyEntity.expiration = dto.expiration;
        await this.keyRepository.save(keyEntity);
        await this.redis.publish('key-updates', JSON.stringify({ action: 'update', key: keyEntity }));
        return keyEntity;
    }

    async listKeys(): Promise<KeyPlanDto[]> {
        return this.keyRepository.find();
    }

    async getKeyPlan(key: string): Promise<KeyPlanDto> {
        const keyEntity = await this.keyRepository.findOneBy({ key });
        if (!keyEntity) throw new Error('Key not found');
        return keyEntity;
    }

    async disableKey(key: string): Promise<void> {
        const keyEntity = await this.keyRepository.findOneBy({ key, isActive: true });
        if (!keyEntity) throw new Error('Key not found or already inactive');
        keyEntity.isActive = false;
        await this.keyRepository.save(keyEntity);
        await this.redis.publish('key-updates', JSON.stringify({ action: 'delete', key }));
    }
}