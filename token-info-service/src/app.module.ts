import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Key } from './entities/key.entity';
import { RequestLog } from './entities/request-log.entity';
import { TokenService } from './services/token.service';
import { TokenController } from './controllers/token.controller';
import { KeySubscriber } from './subscribers/key.subscriber';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH,
      entities: [Key, RequestLog],
      synchronize: true, // For POC only
    }),
    TypeOrmModule.forFeature([Key, RequestLog]),
  ],
  controllers: [TokenController],
  providers: [TokenService, KeySubscriber],
})
export class AppModule { }