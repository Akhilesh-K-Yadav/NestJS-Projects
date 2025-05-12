import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Key } from './entities/key.entity';
import { KeyService } from './services/key.service';
import { KeyController } from './controllers/key.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH,
      entities: [Key],
      synchronize: true, // For POC only
    }),
    TypeOrmModule.forFeature([Key]),
  ],
  controllers: [KeyController],
  providers: [KeyService],
})
export class AppModule { }