import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Place {
    id: number;
    name: string;
    description: string;
}

@Injectable({ providedIn: 'root' })
export class PlacesService {

  private apiUrl = 'http://localhost:3000/places'; // твой бэкенд

    constructor(private http: HttpClient) {}

    getPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(this.apiUrl);
    }

    getPlace(id: number): Observable<Place> {
    return this.http.get<Place>(`${this.apiUrl}/${id}`);
    }
}