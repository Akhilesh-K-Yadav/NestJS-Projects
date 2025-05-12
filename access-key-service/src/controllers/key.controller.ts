import { Controller, Post, Body, Delete, Param, Get, Put, HttpCode } from '@nestjs/common';
import { KeyService } from '../services/key.service';
import { CreateKeyDto } from '../dtos/create-key.dto';
import { UpdateKeyDto } from '../dtos/update-key.dto';
import { KeyPlanDto } from '../dtos/key-plan.dto';
@Controller('keys')
export class KeyController {
    constructor(private readonly keyService: KeyService) { }

    @Post()
    async createKey(@Body() dto: CreateKeyDto): Promise<KeyPlanDto> {
        return this.keyService.createKey(dto);
    }

    @Delete(':key')
    @HttpCode(204)
    async deleteKey(@Param('key') key: string): Promise<void> {
        await this.keyService.deleteKey(key);
    }

    @Put(':key')
    async updateKey(@Param('key') key: string, @Body() dto: UpdateKeyDto): Promise<KeyPlanDto> {
        return this.keyService.updateKey(key, dto);
    }

    @Get()
    async listKeys(): Promise<KeyPlanDto[]> {
        return this.keyService.listKeys();
    }

    @Get(':key')
    async getKeyPlan(@Param('key') key: string): Promise<KeyPlanDto> {
        return this.keyService.getKeyPlan(key);
    }

    @Post(':key/disable')
    @HttpCode(204)
    async disableKey(@Param('key') key: string): Promise<void> {
        await this.keyService.disableKey(key);
    }
}