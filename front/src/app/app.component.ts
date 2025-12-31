import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { TelegramService } from "./services/telegram";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    template: '<router-outlet/>',
})

export class AppComponent {
    title = 'TGBot'
    constructor(private telegramm: TelegramService) {
    const tg = (window as any).Telegram?.WebApp;
    tg.ready();
    tg.expand();
    }
}