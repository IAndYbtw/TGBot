import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Place {
    id: number;
    name: string;
    description: string;
    category: string;
    location: string;
    icon: string;
}

export interface MenuItem {
    id: number;
    name: string;
    description: string | null;
    price: number;
}

export interface PlaceMenu {
    place_id: number;
    place_name: string;
    menu: MenuItem[];
}

@Injectable({ providedIn: 'root' })
export class PlacesService {
    // URL вашего бэкенда из environment конфигурации
    private apiUrl = `${environment.apiUrl}/places`;

    // Моковые данные в качестве fallback
    private mockPlaces: Place[] = [
        {
            id: 1,
            name: 'Пандасад',
            description: 'Вкусная азиатская кухня с большим выбором блюд. Здесь вы найдете лапшу, рис, супы и многое другое.',
            category: 'Азиатская кухня',
            location: 'Учебный корпус',
            icon: '🍜'
        },
        {
            id: 2,
            name: 'Пицца Хот',
            description: 'Свежая горячая пицца на любой вкус. Готовим быстро, доставляем горячей!',
            category: 'Итальянская кухня',
            location: 'ПА, 2 этаж',
            icon: '🍕'
        },
        {
            id: 3,
            name: 'FEIN',
            description: 'Лучший кофе в кампусе! Также большой выбор чая, смузи и других напитков.',
            category: 'Кофейня',
            location: 'ЛК, 1 этаж',
            icon: '☕'
        },
        {
            id: 4,
            name: 'Картошка',
            description: 'Аппетитная картошечка в различных вариациях. Фри, по-деревенски, драники и многое другое!',
            category: 'Фастфуд',
            location: '3 этаж, переход ЛК → УК',
            icon: '🥔'
        }
    ];

    constructor(private http: HttpClient) {}

    /**
     * Получить все места
     * Если бэкенд недоступен, вернутся тестовые данные
     */
    getPlaces(): Observable<Place[]> {
        return this.http.get<Place[]>(this.apiUrl).pipe(
            catchError(error => {
                console.warn('Ошибка загрузки данных с бэкенда, используются тестовые данные:', error);
                return of(this.mockPlaces);
            })
        );
    }

    /**
     * Получить место по ID
     * Если бэкенд недоступен, вернутся тестовые данные
     */
    getPlace(id: number): Observable<Place> {
        return this.http.get<Place>(`${this.apiUrl}/${id}`).pipe(
            catchError(error => {
                console.warn('Ошибка загрузки места с бэкенда, используются тестовые данные:', error);
                const place = this.mockPlaces.find(p => p.id === id);
                return of(place || this.mockPlaces[0]);
            })
        );
    }

    /**
     * Получить меню кафе
     * Если бэкенд недоступен, вернется пустой массив
     */
    getPlaceMenu(placeId: number | string): Observable<PlaceMenu> {
        // Проверяем, что placeId - это число
        const id = typeof placeId === 'string' ? Number(placeId) : placeId;
        
        if (isNaN(id) || id <= 0) {
            console.error('Invalid placeId:', placeId);
            return of({
                place_id: 0,
                place_name: '',
                menu: []
            });
        }
        
        const menuUrl = `${this.apiUrl}/${id}/menu`;
        console.log('Запрос меню - placeId:', placeId, '-> URL:', menuUrl);
        
        return this.http.get<PlaceMenu>(menuUrl).pipe(
            catchError(error => {
                console.error('Ошибка загрузки меню:', {
                    placeId: placeId,
                    url: menuUrl,
                    status: error.status,
                    message: error.message,
                    error: error.error
                });
                // Возвращаем пустое меню при ошибке
                return of({
                    place_id: id,
                    place_name: '',
                    menu: []
                });
            })
        );
    }

    /**
     * Создать новое место
     */
    createPlace(place: Omit<Place, 'id'>): Observable<Place> {
        return this.http.post<Place>(this.apiUrl, place);
    }
}