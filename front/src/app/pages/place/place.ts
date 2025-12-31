import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlacesService, Place, FoodSearchResult } from '../../services/places.service';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
declare const ymaps: any;

@Component({
    standalone: true,
    selector: 'app-places',
    imports: [CommonModule, FormsModule],
    template: `
    <div class="search-box">
        <div>
            <input
            type="text"
            placeholder="Поиск еды: пицца, кофе, суп..."
            [(ngModel)]="searchQuery"
            (input)="onSearchInput()"
            />
        </div>
    </div>

    <!-- Результаты поиска еды -->
    <div class="food-results" *ngIf="foodResults.length > 0">
        <div class="results-header">
            <p>Найдено блюд: {{ foodResults.length }}</p>
            <button class="clear-btn" (click)="clearSearch()">Очистить</button>
        </div>
        <div class="food-card" *ngFor="let item of foodResults" (click)="openPlace(item.cafe_id)">
            <div class="food-icon">{{ item.cafe_icon }}</div>
            <div class="food-content">
                <div class="food-name">{{ item.name }}</div>
                <div class="food-description" *ngIf="item.description">{{ item.description }}</div>
                <div class="food-meta">
                    <span class="food-category">{{ item.category }}</span>
                    <span class="food-cafe">{{ item.cafe_name }}</span>
                </div>
            </div>
            <div class="food-price">{{ item.price | number:'1.0-0' }} ₽</div>
        </div>
    </div>

    <div class="container fade-in" *ngIf="foodResults.length === 0">
        <header class="header">
            <h1 class="title">Где поесть?</h1>
            <p class="subtitle">Выберите место по вкусу</p>
        </header>

        <div class="header-actions">
            <p>Места в ГУУ</p>
        </div>

        <div class="places-grid">
            <div class="place-card"
                 *ngFor="let place of filtredPlaces"
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
            <div id="map" class="map"></div>
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

        .header-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .header-actions p {
            margin: 0;
            font-size: clamp(14px, 4vw, 15px);
            color: var(--tg-theme-hint-color);
        }

        .chat-button {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 14px;
            background: var(--tg-theme-button-color);
            color: var(--tg-theme-button-text-color);
            border: none;
            border-radius: 20px;
            font-size: clamp(13px, 3.5vw, 14px);
            cursor: pointer;
            transition: all 0.2s;
        }

        .chat-button:active {
            transform: scale(0.95);
        }

        .chat-button span:first-child {
            font-size: 16px;
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

        .search-box {
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .search-box input {
            width: 100%;
            padding: 12px 14px;
            border-radius: 12px;
            border: none;
            font-size: 15px;
            background: var(--tg-theme-secondary-bg-color);
            color: var(--tg-theme-text-color);
            outline: none;
        }

        .search-box input::placeholder {
            color: var(--tg-theme-hint-color);
        }

        .food-results {
            margin-bottom: 20px;
        }

        .results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }

        .results-header p {
            margin: 0;
            font-size: 14px;
            color: var(--tg-theme-hint-color);
        }

        .clear-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 16px;
            background: var(--tg-theme-secondary-bg-color);
            color: var(--tg-theme-button-color);
            font-size: 13px;
            cursor: pointer;
        }

        .food-card {
            display: flex;
            align-items: center;
            padding: 12px;
            background: var(--tg-theme-secondary-bg-color);
            border-radius: var(--card-radius);
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .food-card:active {
            transform: scale(0.98);
        }

        .food-icon {
            font-size: 28px;
            margin-right: 12px;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--tg-theme-bg-color);
            border-radius: 10px;
            flex-shrink: 0;
        }

        .food-content {
            flex: 1;
            min-width: 0;
        }

        .food-name {
            font-size: 15px;
            font-weight: 600;
            color: var(--tg-theme-text-color);
            margin-bottom: 2px;
        }

        .food-description {
            font-size: 12px;
            color: var(--tg-theme-hint-color);
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .food-meta {
            display: flex;
            gap: 8px;
            font-size: 11px;
        }

        .food-category {
            color: var(--tg-theme-button-color);
            background: var(--tg-theme-bg-color);
            padding: 2px 6px;
            border-radius: 8px;
        }

        .food-cafe {
            color: var(--tg-theme-hint-color);
        }

        .food-price {
            font-size: 16px;
            font-weight: 700;
            color: var(--tg-theme-button-color);
            margin-left: 10px;
            flex-shrink: 0;
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

        @media (hover: hover) {
            .place-card:hover {
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                transform: translateY(-2px);
            }

            .place-card:hover .place-arrow {
                opacity: 0.7;
            }
        }
        .map {
            width: 100%;
            height: 260px;
            border-radius: var(--card-radius);
            margin-bottom: 16px;
            overflow: hidden;
        }

        @media (max-width: 375px) {
            .map {
                height: 220px;
            }
        }

        @media (min-width: 768px) {
            .map {
                height: 320px;
            }
        }
    `]


})


export class PlacesPage implements OnInit {
    places: Place[] = [];
    map: any;
    searchQuery = '';
    filtredPlaces: Place[] = [];
    foodResults: FoodSearchResult[] = [];
    private searchSubject = new Subject<string>();

    constructor(
        private placesService: PlacesService,
        private router: Router
    ) {
        this.searchSubject.pipe(
            debounceTime(300)
        ).subscribe(query => {
            this.searchFood(query);
        });
    }

    onSearchInput() {
        this.searchSubject.next(this.searchQuery);
    }

    searchFood(query: string) {
        if (!query || query.trim().length < 2) {
            this.foodResults = [];
            this.filterPlaces();
            return;
        }

        this.placesService.searchFood(query).subscribe(results => {
            this.foodResults = results;
        });
    }

    clearSearch() {
        this.searchQuery = '';
        this.foodResults = [];
        this.filtredPlaces = this.places;
    }

    filterPlaces() {
        const query = this.searchQuery.toLowerCase().trim();

        if (!query) {
            this.filtredPlaces = this.places;
            return;
        }

        this.filtredPlaces = this.places.filter(place =>
            place.name.toLowerCase().includes(query) ||
            place.category.toLowerCase().includes(query) ||
            place.location.toLowerCase().includes(query)
        );
    }

    ngOnInit() {
        this.placesService.getPlaces().subscribe(data => {
            this.places = data;
            this.filtredPlaces = data;
            this.initMap();
        });
    }

    
    initMap() {
        if (!this.places.length) return;
        console.log('ymaps:', (window as any).ymaps)

        ymaps.ready(() => {
        this.map = new ymaps.Map('map', {
            center: [55.714354, 37.811395],
            zoom: 16,
            controls: ['zoomControl']
        });

        this.places.forEach(place => {
            if (!place.lat || !place.lon) return;

            const placemark = new ymaps.Placemark(
            [place.lat, place.lon],
            {
                balloonContent: `
                <div style="font-size:14px">
                    <strong>${place.name}</strong><br>
                    ${place.location}<br><br>
                    ${place.description}<br>

                    <a 
                    href="/place/${place.id}" 
                    style="
                        display:inline-block;
                        padding:6px 10px;
                        background:#1976d2;
                        color:white;
                        border-radius:6px;
                        text-decoration:none;
                        font-size:13px;
                    ">
                    Меню
                    </a>
                </div>
                `
            },
            {
                preset: 'islands#redFoodIcon'
            }
            );

            this.map.geoObjects.add(placemark);
        });
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