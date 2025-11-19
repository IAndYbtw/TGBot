import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    template: '<router-outlet/>',
})

export class AppComponent {
    title = 'TGBot'
    constructor() {
    const tg = (window as any).Telegram.WebApp;
    tg.ready();
    tg.expand();
    }
}