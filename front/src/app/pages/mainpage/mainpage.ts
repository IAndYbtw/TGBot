import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Telegram } from "../../services/telegram";

@Component({
    selector: 'main-page',
    standalone: true,
    imports: [CommonModule],
    template: '<h1>main page</h1>'
})
export class MainComponent {
    telegram = inject(Telegram)
    /*constructor() {
        this.telegram.MainButton.show();
    }*/
}