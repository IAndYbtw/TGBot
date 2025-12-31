import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlacesService, Place, MenuItem } from '../../services/places.service';

@Component({
    standalone: true,
    selector: 'app-place-details',
    imports: [CommonModule],
    template: `
    <div class="details-container fade-in" *ngIf="place">
        <button class="back-button" (click)="goBack()">
            <span class="back-icon">‹</span>
            <span>Назад</span>
        </button>

        <div class="place-header">
            <div class="place-icon-large">{{ place.icon }}</div>
            <h1 class="place-title">{{ place.name }}</h1>
            <div class="menu-categories">
                <button
                *ngFor="let cat of categories"
                (click)="selectedCategory = cat; filterMenu()"
                [class.active]='cat === selectedCategory'>
                    {{cat === 'all' ? 'Все' : cat}}
                </button>
            </div>
        </div>      

        <!-- Меню кафе -->
        <div class="menu-card" *ngIf="menu && menu.length > 0">
            <h2 class="menu-title">Меню</h2>
            <div class="menu-items">
                <div class="menu-item" *ngFor="let item of filteredMenu">
                    <div class="menu-item-content">
                        <div class="menu-item-name">{{ item.name }}</div>
                        <div class="menu-item-description" *ngIf="item.description">
                            {{ item.description }}
                        </div>
                        <div class="menu-item-category" *ngIf="item.category">
                            {{ item.category }}
                        </div>
                    </div>
                    <div class="menu-item-price">
                        {{ item.price | number:'1.0-0' }} ₽
                    </div>
                </div>
            </div>
        </div>

        <div class="menu-empty" *ngIf="filteredMenu && filteredMenu.length === 0 && menu.length > 0">
            <p>Ничего не найдено</p>
        </div>

        <div class="menu-empty" *ngIf="menu && menu.length === 0">
            <p>Меню пока не добавлено</p>
        </div>
    </div>

    <div class="loading" *ngIf="!place">
        <p>Загрузка...</p>
    </div>
    `,
    styles: [`
        .details-container {
            max-width: 600px;
            margin: 0 auto;
            padding-bottom: 24px;
            width: 100%;
        }

        @media (max-width: 375px) {
            .details-container {
                padding-bottom: 16px;
            }
        }

        @media (min-width: 768px) {
            .details-container {
                max-width: 720px;
                padding-bottom: 32px;
            }
        }

        @media (min-width: 1024px) {
            .details-container {
                max-width: 800px;
            }
        }

        .back-button {
            display: flex;
            align-items: center;
            gap: 4px;
            background: transparent;
            color: var(--tg-theme-button-color);
            padding: 8px 10px;
            margin-bottom: 12px;
            font-size: clamp(15px, 4vw, 16px);
            font-weight: 500;
            border-radius: 12px;
            transition: all 0.3s;
        }

        @media (min-width: 768px) {
            .back-button {
                padding: 10px 14px;
                margin-bottom: 18px;
            }
        }

        .back-button:active {
            background: var(--tg-theme-secondary-bg-color);
        }

        @media (hover: hover) {
            .back-button:hover {
                background: var(--tg-theme-secondary-bg-color);
                opacity: 0.9;
            }
        }

        .back-icon {
            font-size: clamp(24px, 7vw, 28px);
            line-height: 1;
            margin-right: 2px;
        }

        .place-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
            padding: 16px 0;
        }

        @media (max-width: 375px) {
            .place-header {
                margin-bottom: 16px;
                padding: 12px 0;
            }
        }

        @media (min-width: 768px) {
            .place-header {
                margin-bottom: 28px;
                padding: 28px 0;
            }
        }

        .place-icon-large {
            font-size: clamp(64px, 18vw, 80px);
            margin-bottom: 14px;
            width: clamp(100px, 28vw, 120px);
            height: clamp(100px, 28vw, 120px);
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--tg-theme-secondary-bg-color);
            border-radius: clamp(24px, 7vw, 30px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        @media (min-width: 768px) {
            .place-icon-large {
                margin-bottom: 18px;
            }
        }

        .place-title {
            font-size: clamp(24px, 6.5vw, 28px);
            font-weight: 700;
            margin: 0;
            color: var(--tg-theme-text-color);
            text-align: center;
            letter-spacing: -0.5px;
            padding: 0 16px;
            word-wrap: break-word;
        }

        @media (min-width: 768px) {
            .place-title {
                padding: 0 24px;
            }
        }

        .info-card {
            background: var(--tg-theme-secondary-bg-color);
            border-radius: var(--card-radius);
            padding: 18px;
            margin-bottom: 14px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        }

        @media (max-width: 375px) {
            .info-card {
                padding: 14px;
                margin-bottom: 12px;
            }
        }

        @media (min-width: 768px) {
            .info-card {
                padding: 24px;
                margin-bottom: 18px;
            }
        }

        .info-section {
            padding: 4px 0;
        }

        @media (min-width: 768px) {
            .info-section {
                padding: 6px 0;
            }
        }

        .section-label {
            font-size: clamp(12px, 3.2vw, 13px);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--tg-theme-hint-color);
            margin: 0 0 8px 0;
        }

        @media (min-width: 768px) {
            .section-label {
                margin: 0 0 10px 0;
            }
        }

        .section-content {
            font-size: clamp(15px, 4vw, 16px);
            line-height: 1.5;
            color: var(--tg-theme-text-color);
            margin: 0;
            word-wrap: break-word;
        }

        @media (min-width: 768px) {
            .section-content {
                line-height: 1.6;
            }
        }

        .location-info {
            display: flex;
            align-items: flex-start;
            gap: 8px;
        }

        .location-icon-detail {
            font-size: clamp(16px, 4.5vw, 18px);
            margin-top: 1px;
            flex-shrink: 0;
        }

        .divider {
            height: 1px;
            background: var(--tg-theme-hint-color);
            opacity: 0.1;
            margin: 14px 0;
        }

        .menu-card {
            background: var(--tg-theme-secondary-bg-color);
            border-radius: var(--card-radius);
            padding: 20px;
            margin-bottom: 14px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        }

        @media (max-width: 375px) {
            .menu-card {
                padding: 16px;
                margin-bottom: 12px;
            }
        }

        @media (min-width: 768px) {
            .menu-card {
                padding: 24px;
                margin-bottom: 18px;
            }
        }

        .menu-title {
            font-size: clamp(20px, 5.5vw, 22px);
            font-weight: 700;
            margin: 0 0 16px 0;
            color: var(--tg-theme-text-color);
            letter-spacing: -0.3px;
        }

        @media (min-width: 768px) {
            .menu-title {
                margin: 0 0 20px 0;
            }
        }

        .menu-items {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        @media (max-width: 375px) {
            .menu-items {
                gap: 10px;
            }
        }

        @media (min-width: 768px) {
            .menu-items {
                gap: 14px;
            }
        }

        .menu-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
            padding: 14px;
            background: var(--tg-theme-bg-color);
            border-radius: 12px;
            transition: all 0.2s;
        }

        @media (max-width: 375px) {
            .menu-item {
                padding: 12px;
                gap: 12px;
            }
        }

        @media (min-width: 768px) {
            .menu-item {
                padding: 16px;
                gap: 20px;
            }
        }

        .menu-item:active {
            transform: scale(0.98);
            opacity: 0.9;
        }

        @media (hover: hover) {
            .menu-item:hover {
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            }
        }

        .menu-item-content {
            flex: 1;
            min-width: 0;
        }

        .menu-item-name {
            font-size: clamp(16px, 4.2vw, 17px);
            font-weight: 600;
            color: var(--tg-theme-text-color);
            margin: 0 0 4px 0;
            line-height: 1.4;
        }

        .menu-item-description {
            font-size: clamp(13px, 3.5vw, 14px);
            color: var(--tg-theme-hint-color);
            line-height: 1.4;
            margin: 0;
        }

        .menu-item-category {
            font-size: clamp(11px, 3vw, 12px);
            color: var(--tg-theme-button-color);
            background: var(--tg-theme-secondary-bg-color);
            padding: 2px 8px;
            border-radius: 10px;
            display: inline-block;
            margin-top: 6px;
        }

        .menu-categories {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 16px;
            justify-content: center;
        }

        .menu-categories button {
            padding: 8px 16px;
            border: none;
            border-radius: 20px;
            background: var(--tg-theme-secondary-bg-color);
            color: var(--tg-theme-text-color);
            font-size: clamp(13px, 3.5vw, 14px);
            cursor: pointer;
            transition: all 0.2s;
        }

        .menu-categories button:active {
            transform: scale(0.95);
        }

        .menu-categories button.active {
            background: var(--tg-theme-button-color);
            color: var(--tg-theme-button-text-color);
        }

        @media (hover: hover) {
            .menu-categories button:hover {
                opacity: 0.85;
            }
        }

        .menu-item-price {
            font-size: clamp(17px, 4.5vw, 18px);
            font-weight: 700;
            color: var(--tg-theme-button-color);
            white-space: nowrap;
            flex-shrink: 0;
        }

        .menu-empty {
            text-align: center;
            padding: 40px 20px;
            color: var(--tg-theme-hint-color);
            font-size: clamp(14px, 4vw, 15px);
            background: var(--tg-theme-secondary-bg-color);
            border-radius: var(--card-radius);
            margin-bottom: 14px;
        }

        @media (prefers-color-scheme: dark) {
            .menu-card {
                box-shadow: 0 2px 16px rgba(0, 0, 0, 0.3);
            }

            .menu-item {
                background: var(--tg-theme-bg-color);
            }
        }

        @media (max-width: 375px) {
            .divider {
                margin: 12px 0;
            }
        }

        @media (min-width: 768px) {
            .divider {
                margin: 18px 0;
            }
        }




        .button-emoji {
            font-size: clamp(17px, 4.5vw, 18px);
        }


        .loading {
            text-align: center;
            padding: 60px 20px;
            color: var(--tg-theme-hint-color);
            font-size: clamp(14px, 4vw, 15px);
        }

        @media (max-width: 375px) {
            .loading {
                padding: 40px 16px;
            }
        }

        @media (min-width: 768px) {
            .loading {
                padding: 80px 24px;
                font-size: 16px;
            }
        }

        @media (prefers-color-scheme: dark) {
            .info-card {
                box-shadow: 0 2px 16px rgba(0, 0, 0, 0.3);
            }
            
            .place-icon-large {
                box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
            }
    }
    `]
})
export class PlaceDetailsPage implements OnInit {
    selectedCategory = 'all';
    place!: Place;
    menu: MenuItem[] = [];
    filteredMenu: MenuItem[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private placesService: PlacesService
    ) {}

    get categories(): string[] {
        const cats = this.menu.map( i => i.category).filter(Boolean);
        return [ 'all', ...Array.from(new Set(cats))]
    }

    filterMenu() {
        if (this.selectedCategory === 'all') {
            this.filteredMenu = this.menu;
        } else {
            this.filteredMenu = this.menu.filter(item =>
                item.category === this.selectedCategory
            );
        }
    }

    ngOnInit() {
        const routeId = this.route.snapshot.paramMap.get('id');
        const id = Number(routeId);

        if (!routeId || isNaN(id) || id <= 0) {
            console.error('Invalid place ID:', routeId);
            this.router.navigate(['/']);
            return;
        }

        // Загружаем информацию о месте
        this.placesService.getPlace(id).subscribe(data => {
            this.place = data;
        });

        // Загружаем меню кафе
        this.placesService.getPlaceMenu(id).subscribe(data => {
            this.menu = data;
            this.filteredMenu = data;
        });
    }

    goBack() {
        this.router.navigate(['/']);
    }
}