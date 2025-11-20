import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlacesService, Place } from '../../services/places.service';

@Component({
    standalone: true,
    selector: 'app-places',
    imports: [CommonModule],
    template: ` 
    <div class="container">

    <h2 
        [style.font-size.px]="26"
        [style.font-weight]="'600'"
        [style.margin-bottom.px]="10"
        [style.color]="tgThemeText"
    >
        Где поесть?
    </h2>

    <div 
        class="place-card"
        [style.margin-top.px]="18"
        [style.padding.px]="16"
        [style.border-radius.px]="14"
        [style.background]="tgThemeBg"
        [style.box-shadow]="'0 2px 8px rgba(0,0,0,0.08)'"
        [style.transition]="'.2s'"
        [style.cursor]="'pointer'"
    >
        <h2 
        [style.font-size.px]="20"
        [style.margin]="0"
        [style.font-weight]="'600'"
        >Пандасад</h2>

        <h3 
        [style.font-size.px]="15"
        [style.margin-top.px]="6"
        [style.margin-bottom.px]="4"
        [style.opacity]="'0.8'"
        >Азиатская еда</h3>

        <h4 
        [style.font-size.px]="14"
        [style.margin]="0"
        [style.opacity]="'0.6'"
        >
        Учебный корпус
        </h4>
    </div>


    <div 
        class="place-card"
        [style.margin-top.px]="18"
        [style.padding.px]="16"
        [style.border-radius.px]="14"
        [style.background]="tgThemeBg"
        [style.box-shadow]="'0 2px 8px rgba(0,0,0,0.08)'"
        [style.transition]="'.2s'"
        [style.cursor]="'pointer'"
    >
        <h2 
        [style.font-size.px]="20"
        [style.margin]="0"
        [style.font-weight]="'600'"
        >Пицца Хот</h2>

        <h3 
        [style.font-size.px]="15"
        [style.margin-top.px]="6"
        [style.margin-bottom.px]="4"
        [style.opacity]="'0.8'"
        >Вкусная и горячая пицца</h3>

        <h4 
        [style.font-size.px]="14"
        [style.margin]="0"
        [style.opacity]="'0.6'"
        >
        ПА 2 этаж
        </h4>
    </div>


    <div 
        class="place-card"
        [style.margin-top.px]="18"
        [style.padding.px]="16"
        [style.border-radius.px]="14"
        [style.background]="tgThemeBg"
        [style.box-shadow]="'0 2px 8px rgba(0,0,0,0.08)'"
        [style.transition]="'.2s'"
        [style.cursor]="'pointer'"
    >
        <h2 
        [style.font-size.px]="20"
        [style.margin]="0"
        [style.font-weight]="'600'"
        >FEIN</h2>

        <h3 
        [style.font-size.px]="15"
        [style.margin-top.px]="6"
        [style.margin-bottom.px]="4"
        [style.opacity]="'0.8'"
        >Напитки</h3>

        <h4 
        [style.font-size.px]="14"
        [style.margin]="0"
        [style.opacity]="'0.6'"
        >
        ЛК 1 этаж
        </h4>
    </div>


    <div 
        class="place-card"
        [style.margin-top.px]="18"
        [style.padding.px]="16"
        [style.border-radius.px]="14"
        [style.background]="tgThemeBg"
        [style.box-shadow]="'0 2px 8px rgba(0,0,0,0.08)'"
        [style.transition]="'.2s'"
        [style.cursor]="'pointer'"
    >
        <h2 
        [style.font-size.px]="20"
        [style.margin]="0"
        [style.font-weight]="'600'"
        >Картошка</h2>

        <h3 
        [style.font-size.px]="15"
        [style.margin-top.px]="6"
        [style.margin-bottom.px]="4"
        [style.opacity]="'0.8'"
        >Аппетитная картошечка</h3>

        <h4 
        [style.font-size.px]="14"
        [style.margin]="0"
        [style.opacity]="'0.6'"
        >
        3 этаж переход из ЛК в Учебный корпус
        </h4>
    </div>

    </div>
    `,


})

export class PlacesPage implements OnInit {

    places: Place[] = [];
tgThemeBg: any;
tgThemeText: any;

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
    this.router.navigate(['/place', id]);
    }
}