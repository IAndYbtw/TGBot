import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlacesService, Place } from '../../services/places.service';

@Component({
    standalone: true,
    selector: 'app-place-details',
    imports: [CommonModule],
    template: `
    <div class="details" *ngIf="place">
        <h2>{{ place.name }}</h2>
        <p>{{ place.description }}</p>

        <button (click)="goBack()">Назад</button>
    </div>
    `,
    styles: [`
    .details { padding: 16px; font-family: Arial; }
    button {
        margin-top: 20px;
        padding: 10px 14px;
        background: #007aff;
        color: white;
        border: none;
        border-radius: 6px;
    }
    `]
})
export class PlaceDetailsPage implements OnInit {

    place!: Place;

    constructor(
    private route: ActivatedRoute,
    private router: Router,
    private placesService: PlacesService
    ) {}

    ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.placesService.getPlace(id).subscribe(data => {
        this.place = data;
    });
    }

    goBack() {
    this.router.navigate(['/']);
    }
}