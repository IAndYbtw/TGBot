import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Message {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

interface FoodRecommendation {
    place_name: string;
    place_id: number;
    items: Array<{
        name: string;
        description: string | null;
        price: number;
    }>;
    reason: string;
}

@Component({
    standalone: true,
    selector: 'app-chat',
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container fade-in">
        <header class="header">
            <h1 class="title">ИИ-Помощник</h1>
            <p class="subtitle">Спросите, что хотите съесть</p>
        </header>

        <div class="chat-container">
            <div class="messages" #messagesContainer>
                <div *ngFor="let message of messages" 
                     [class]="'message ' + (message.isUser ? 'user-message' : 'bot-message')">
                    <div class="message-content">
                        <p>{{ message.text }}</p>
                        <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
                    </div>
                </div>
                <div *ngIf="isLoading" class="message bot-message">
                    <div class="message-content">
                        <div class="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="input-container">
            <input 
                type="text" 
                [(ngModel)]="userInput" 
                (keyup.enter)="sendMessage()"
                placeholder="Например: хочу что-то острое и сытное..."
                class="chat-input"
                [disabled]="isLoading">
            <button 
                (click)="sendMessage()" 
                class="send-button"
                [disabled]="!userInput.trim() || isLoading">
                <span>➤</span>
            </button>
        </div>
    </div>
    `,
    styles: [`
        .header {
            margin-bottom: 20px;
            padding: 8px 0;
        }

        .title {
            font-size: clamp(26px, 7vw, 32px);
            font-weight: 700;
            margin: 0 0 6px 0;
            color: var(--tg-theme-text-color);
            letter-spacing: -0.5px;
        }

        .subtitle {
            font-size: clamp(14px, 4vw, 15px);
            margin: 0;
            color: var(--tg-theme-hint-color);
            font-weight: 400;
        }

        .chat-container {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 16px;
            padding: 8px 0;
            min-height: 300px;
            max-height: calc(100vh - 250px);
        }

        .messages {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .message {
            display: flex;
            animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .user-message {
            justify-content: flex-end;
        }

        .bot-message {
            justify-content: flex-start;
        }

        .message-content {
            max-width: 75%;
            padding: 12px 16px;
            border-radius: 18px;
            position: relative;
        }

        .user-message .message-content {
            background: var(--tg-theme-button-color);
            color: var(--tg-theme-button-text-color);
            border-bottom-right-radius: 4px;
        }

        .bot-message .message-content {
            background: var(--tg-theme-secondary-bg-color);
            color: var(--tg-theme-text-color);
            border-bottom-left-radius: 4px;
        }

        .message-content p {
            margin: 0 0 4px 0;
            font-size: clamp(14px, 4vw, 15px);
            line-height: 1.4;
            word-wrap: break-word;
        }

        .timestamp {
            font-size: 10px;
            opacity: 0.6;
            display: block;
            margin-top: 4px;
        }

        .typing-indicator {
            display: flex;
            gap: 4px;
            padding: 8px 0;
        }

        .typing-indicator span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--tg-theme-hint-color);
            animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
            animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typing {
            0%, 60%, 100% {
                transform: translateY(0);
                opacity: 0.7;
            }
            30% {
                transform: translateY(-10px);
                opacity: 1;
            }
        }

        .input-container {
            display: flex;
            gap: 8px;
            padding: 12px 0;
            border-top: 1px solid var(--tg-theme-secondary-bg-color);
            position: sticky;
            bottom: 0;
            background: var(--tg-theme-bg-color);
        }

        .chat-input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid var(--tg-theme-secondary-bg-color);
            border-radius: 24px;
            background: var(--tg-theme-secondary-bg-color);
            color: var(--tg-theme-text-color);
            font-size: clamp(14px, 4vw, 15px);
            outline: none;
        }

        .chat-input:focus {
            border-color: var(--tg-theme-button-color);
        }

        .chat-input:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .send-button {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--tg-theme-button-color);
            color: var(--tg-theme-button-text-color);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            transition: all 0.2s;
            flex-shrink: 0;
        }

        .send-button:active:not(:disabled) {
            transform: scale(0.95);
        }

        .send-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .send-button span {
            display: block;
            transform: rotate(-90deg);
        }
    `]
})
export class ChatPage implements OnInit, AfterViewChecked {
    @ViewChild('messagesContainer') messagesContainer!: ElementRef;

    messages: Message[] = [];
    userInput: string = '';
    isLoading: boolean = false;
    private messageIdCounter: number = 0;

    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.addBotMessage('Привет! Я помогу вам найти идеальное блюдо. Опишите, что вы хотите съесть, и я подберу лучшие варианты из кафе рядом с ГУУ.');
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        try {
            const container = this.messagesContainer.nativeElement;
            container.scrollTop = container.scrollHeight;
        } catch (err) {
            // Игнорируем ошибки прокрутки
        }
    }

    formatTime(date: Date): string {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    addMessage(text: string, isUser: boolean) {
        this.messages.push({
            id: this.messageIdCounter++,
            text,
            isUser,
            timestamp: new Date()
        });
    }

    addBotMessage(text: string) {
        this.addMessage(text, false);
    }

    addUserMessage(text: string) {
        this.addMessage(text, true);
    }

    async sendMessage() {
        const query = this.userInput.trim();
        if (!query || this.isLoading) return;

        this.addUserMessage(query);
        this.userInput = '';
        this.isLoading = true;

        try {
            const response = await firstValueFrom(
                this.http.post<FoodRecommendation>(
                    `${environment.apiUrl}/chat/search-food`,
                    { query }
                )
            );

            if (response) {
                let message = `🍽️ Нашел для вас:\n\n`;
                message += `📍 **${response.place_name}**\n\n`;
                
                if (response.items && response.items.length > 0) {
                    message += `Рекомендую:\n`;
                    response.items.forEach(item => {
                        message += `• ${item.name}`;
                        if (item.description) {
                            message += ` - ${item.description}`;
                        }
                        message += ` (${item.price}₽)\n`;
                    });
                }
                
                if (response.reason) {
                    message += `\n💡 ${response.reason}`;
                }

                this.addBotMessage(message);
            } else {
                this.addBotMessage('К сожалению, не удалось найти подходящие блюда. Попробуйте описать ваши предпочтения по-другому.');
            }
        } catch (error) {
            console.error('Ошибка при поиске еды:', error);
            this.addBotMessage('Произошла ошибка при поиске. Попробуйте еще раз.');
        } finally {
            this.isLoading = false;
        }
    }
}

