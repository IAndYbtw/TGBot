import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlacesService, Place } from '../../services/places.service';

@Component({
    standalone: true,
    selector: 'app-places',
    imports: [CommonModule],
    template: ` 
    <div class="container fade-in">
        <header class="header">
            <h1 class="title">Где поесть?</h1>
            <p class="subtitle">Выберите место по вкусу</p>
        </header>

        <div>
            <p>Места в ГУУ</p>
        </div>

        <div class="places-grid">
            <div class="place-card" 
                 *ngFor="let place of places" 
                 (click)="openPlace(place.id)">
                <div class="place-icon">{{ place.icon }}</div>
                <div class="place-content">
                    <h2 class="place-name">{{ place.name }}</h2>
                    <p class="place-category">{{ place.category }}</p>
                    <div class="place-location">
                        <span class="location-icon">📍</span>
                        <span>{{ place.location }}</span>
                    </div>
                </div>
                <div class="place-arrow">›</div>
            </div>
        </div>

        <div class="loading" *ngIf="places.length === 0">
            <p>Загрузка мест...</p>
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

        @media (max-width: 375px) {
            .header {
                margin-bottom: 16px;
            }
        }

        @media (min-width: 768px) {
            .header {
                margin-bottom: 28px;
                padding: 12px 0;
            }
        }

        .places-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        @media (max-width: 375px) {
            .places-grid {
                gap: 10px;
            }
        }

        @media (min-width: 768px) {
            .places-grid {
                gap: 14px;
            }
        }

        .place-card {
            display: flex;
            align-items: center;
            padding: 14px;
            background: var(--tg-theme-secondary-bg-color);
            border-radius: var(--card-radius);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            position: relative;
            overflow: hidden;
            min-height: 88px;
        }

        @media (max-width: 375px) {
            .place-card {
                padding: 12px;
                min-height: 82px;
            }
        }

        @media (min-width: 768px) {
            .place-card {
                padding: 18px;
                min-height: 100px;
            }
        }

        .place-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--tg-theme-button-color);
            opacity: 0;
            transition: opacity 0.3s;
        }

        .place-card:active {
            transform: scale(0.98);
        }

        .place-card:active::before {
            opacity: 0.05;
        }

        .place-icon {
            font-size: clamp(36px, 10vw, 40px);
            margin-right: 14px;
            flex-shrink: 0;
            width: clamp(52px, 14vw, 56px);
            height: clamp(52px, 14vw, 56px);
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--tg-theme-bg-color);
            border-radius: 12px;
            position: relative;
            z-index: 1;
        }

        @media (min-width: 768px) {
            .place-icon {
                margin-right: 18px;
                border-radius: 14px;
            }
        }

        .place-content {
            flex: 1;
            min-width: 0;
            position: relative;
            z-index: 1;
        }

        .place-name {
            font-size: clamp(16px, 4.5vw, 18px);
            font-weight: 600;
            margin: 0 0 4px 0;
            color: var(--tg-theme-text-color);
            letter-spacing: -0.2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        @media (min-width: 768px) {
            .place-name {
                margin: 0 0 6px 0;
            }
        }

        .place-category {
            font-size: clamp(13px, 3.5vw, 14px);
            margin: 0 0 6px 0;
            color: var(--tg-theme-hint-color);
            font-weight: 400;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        @media (max-width: 375px) {
            .place-category {
                margin: 0 0 4px 0;
            }
        }

        @media (min-width: 768px) {
            .place-category {
                margin: 0 0 8px 0;
            }
        }

        .place-location {
            display: flex;
            align-items: center;
            font-size: clamp(12px, 3.2vw, 13px);
            color: var(--tg-theme-hint-color);
            gap: 4px;
            overflow: hidden;
        }

        .place-location span:last-child {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .location-icon {
            font-size: clamp(11px, 3vw, 12px);
            opacity: 0.8;
            flex-shrink: 0;
        }

        .place-arrow {
            font-size: clamp(24px, 7vw, 28px);
            color: var(--tg-theme-hint-color);
            margin-left: 8px;
            opacity: 0.4;
            flex-shrink: 0;
            position: relative;
            z-index: 1;
            transition: all 0.3s;
        }

        @media (min-width: 768px) {
            .place-arrow {
                margin-left: 12px;
            }
        }

        .place-card:active .place-arrow {
            transform: translateX(4px);
            opacity: 0.6;
        }

        .loading {
            text-align: center;
            padding: 40px 20px;
            color: var(--tg-theme-hint-color);
            font-size: clamp(14px, 4vw, 15px);
        }

        @media (max-width: 375px) {
            .loading {
                padding: 30px 16px;
            }
        }

        @media (min-width: 768px) {
            .loading {
                padding: 60px 24px;
                font-size: 16px;
            }
        }

        @media (prefers-color-scheme: dark) {
            .place-card {
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
            }
        }

        /* Улучшение hover эффекта для десктопа */
        @media (hover: hover) {
            .place-card:hover {
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                transform: translateY(-2px);
            }

            .place-card:hover .place-arrow {
                opacity: 0.7;
            }
        }
    `]


})

export class PlacesPage implements OnInit {

    places: Place[] = [];

    constructor(
        private placesService: PlacesService,
        private router: Router
    ) {}

    ngOnInit() {
        this.placesService.getPlaces().subscribe(data => {
            this.places = data;
        });
    }

    openPlace(id: number) {
        console.log('Opening place with ID:', id, '(type:', typeof id, ')');
        if (!id || isNaN(Number(id))) {
            console.error('Invalid place ID:', id);
            return;
        }
        this.router.navigate(['/place', id]);
    }
}