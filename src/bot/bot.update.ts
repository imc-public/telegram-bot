import { Context, Hears, Message, Start, Update } from 'nestjs-telegraf';
import { CTX } from './bot.interface';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as url from 'url';
import * as CryptoJS from 'crypto-js';

@Update()
export class BotUpdate {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  private encryptString(plainText: string, secretKey: string) {
    const ciphertext = CryptoJS.AES.encrypt(plainText, secretKey).toString();
    return ciphertext;
  }

  @Start()
  async onStart(@Context() ctx: CTX) {
    await ctx.reply('Hi!', {
      reply_markup: {
        inline_keyboard: [],
      },
    });
  }

  @Hears(/.+/)
  async onHears(@Context() ctx: CTX, @Message('text') message: string) {
    const buttons: InlineKeyboardButton[][] = [];
    // this.config.get<string>('DOMAIN2')
    const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*|www\.[^\s/$.?#].[^\s]*/gi;
    const domainRegex = new RegExp(
      `^(?:www\\.)?${this.config.get<string>('DOMAIN2')}\\.${this.config.get<string>('DOMAIN1')}$`,
    );
    const urls = message.match(urlRegex);
    if (urls) {
      urls.forEach((URL) => {
        const parsedUrl = url.parse(URL, true);
        if (
          parsedUrl?.hasOwnProperty('host') &&
          domainRegex.test(parsedUrl.host) &&
          parsedUrl.hasOwnProperty('path') &&
          parsedUrl.path.length > 1
        ) {
          const encryptedPath = this.encryptString(
            parsedUrl.path,
            this.config.get<string>('SECRET'),
          );
          const button = [
            {
              text: 'Open web app',
              web_app: {
                url:
                  this.config.get<string>('WEB_APP_URL') +
                  '?hash=' +
                  Buffer.from(encryptedPath).toString('base64'),
              },
            },
          ];
          buttons.push(button);
        }
      });

      //Add inline keyboard to message
      if (buttons && buttons.length > 0) {
        console.log(buttons);
        try {
          await ctx.reply('Read as a WEB-APP', {
            reply_markup: {
              inline_keyboard: buttons,
            },
          });
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}
