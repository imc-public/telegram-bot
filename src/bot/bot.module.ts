import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [BotUpdate, ConfigService],
})
export class BotModule {}
