import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

interface TgButton {
  show(): void;
  hide(): void;
  setText(text: string): void;
}

@Injectable({
  providedIn: 'root',
})
export class TelegramService {

  tg: any = null;

  constructor(@Inject(DOCUMENT) private document: Document) {
    const window = this.document.defaultView as any;

    // ✅ ВАЖНАЯ ПРОВЕРКА
    if (window && window.Telegram && window.Telegram.WebApp) {
      this.tg = window.Telegram.WebApp;
      this.tg.ready();
      this.tg.expand();
    } else {
      console.warn('Telegram WebApp API недоступен (браузер)');
    }
  }

  /** Проверка — мы в Telegram или нет */
  isTelegram(): boolean {
    return !!this.tg;
  }

  /** Пример безопасного доступа к кнопке */
  getMainButton(): TgButton | null {
    return this.tg ? this.tg.MainButton : null;
  }
}