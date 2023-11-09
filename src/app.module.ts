import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';

@Module({
  imports: [
    // Imports Config
    ConfigModule.forRoot(),
    // Imports Telegram Bot
    TelegrafModule.forRoot({
      botName: 'Telegram Webb App Bot',
      token: process.env.TELEGRAM_BOT_TOKEN,
      include: [BotModule],
    }),
    BotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
