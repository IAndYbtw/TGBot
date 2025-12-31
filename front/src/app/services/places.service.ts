import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Place {
    lat: number;
    lon: number;
    id: number;
    name: string;
    description: string;
    category: string;
    location: string;
    icon: string;
}


export interface MenuItem {
    id: number;
    cafe_id: number;
    name: string;
    description: string | null;
    category: string;
    price: number;
}

export interface PlaceMenu {
    place_id: number;
    place_name: string;
    menu: MenuItem[];
}

export interface FoodSearchResult {
    id: number;
    name: string;
    description: string | null;
    category: string;
    price: number;
    cafe_id: number;
    cafe_name: string;
    cafe_icon: string;
    cafe_location: string;
}

@Injectable({ providedIn: 'root' })
export class CafeService {
    constructor(private http: HttpClient) {}

    getCafes() {
        return this.http.get<any[]>('/cafes');
    }
}

@Injectable({ providedIn: 'root' })
export class PlacesService {
    private apiUrl = `${environment.apiUrl}/places`;

    private mockPlaces: Place[] = [
        {
            lat: 55.714069,
            lon: 37.811555,
            id: 1,
            name: 'Пандасад',
            description: 'Вкусная азиатская кухня с большим выбором блюд.',
            category: 'Азиатская кухня',
            location: 'Учебный корпус',
            icon: '🍜'
        },
        {
            lat: 55.713434,
            lon: 37.815917,
            id: 2,
            name: 'Пицца Хот',
            description: 'Свежая горячая пицца на любой вкус.',
            category: 'Итальянская кухня',
            location: 'ПА, 2 этаж',
            icon: '🍕'
        },
        {
            lat: 55.713469,
            lon: 37.815382,
            id: 3,
            name: 'FEIN',
            description: 'Лучший кофе в кампусе! Также большой выбор кофе и других напитков.',
            category: 'Кофейня',
            location: 'ЛК, 1 этаж',
            icon: '☕'
        },
        {
            lat: 55.713996,
            lon: 37.813418,
            id: 4,
            name: 'Картошка',
            description: 'Аппетитная картошечка в различных вариациях.',
            category: 'Картофельная кухня',
            location: '3 этаж, переход ЛК → УК',
            icon: '🥔'
        }
    ];

    constructor(private http: HttpClient) {}


    getPlaces(): Observable<Place[]> {
        return this.http.get<Place[]>(this.apiUrl).pipe(
            catchError(error => {
                console.warn('Ошибка загрузки данных с бэкенда, используются тестовые данные:', error);
                return of(this.mockPlaces);
            })
        );
    }


    getPlace(id: number): Observable<Place> {
        return this.http.get<Place>(`${this.apiUrl}/${id}`).pipe(
            catchError(error => {
                console.warn('Ошибка загрузки места с бэкенда, используются тестовые данные:', error);
                const place = this.mockPlaces.find(p => p.id === id);
                return of(place || this.mockPlaces[0]);
            })
        );
    }
    
    getMenuItems(){
        return this.http.get<MenuItem[]>('/menu-items');
    }

    getMenuByCafeId(id: number){
        return this.http.get<MenuItem[]>('/place/${placeId}/menu')
    }


    getPlaceMenu(placeId: number | string): Observable<MenuItem[]> {
        const id = typeof placeId === 'string' ? Number(placeId) : placeId;
        
        if (isNaN(id) || id <= 0) {
            console.error('Invalid placeId:', placeId);
            return of([]);
        }
        
        const menuUrl = `${this.apiUrl}/${id}/menu`;
        console.log('Запрос меню - placeId:', placeId, '-> URL:', menuUrl);
        
        return this.http.get<MenuItem[]>(menuUrl).pipe(
            catchError(error => {
                console.error('Ошибка загрузки меню:', {
                    placeId: placeId,
                    url: menuUrl,
                    status: error.status,
                    message: error.message,
                    error: error.error
                });
                return of([]);
            })
        );
    }

    createPlace(place: Omit<Place, 'id'>): Observable<Place> {
        return this.http.post<Place>(this.apiUrl, place);
    }

    searchFood(query: string): Observable<FoodSearchResult[]> {
        if (!query || query.trim().length < 2) {
            return of([]);
        }
        return this.http.get<FoodSearchResult[]>(`${environment.apiUrl}/menu/search?q=${encodeURIComponent(query)}`).pipe(
            catchError(error => {
                console.error('Ошибка поиска еды:', error);
                return of([]);
            })
        );
    }
}