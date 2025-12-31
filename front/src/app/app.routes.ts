import { Routes } from '@angular/router';
import { PlacesPage } from './pages/place/place';
import { PlaceDetailsPage} from './pages/placedetails/place-details';


export const routes: Routes = [
    {path: '', component: PlacesPage, pathMatch: 'full'},
    {path:'place/:id', component: PlaceDetailsPage}
];
