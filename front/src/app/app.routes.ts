import { Routes } from '@angular/router';
import { MainComponent } from './pages/mainpage/mainpage';
import { InfoComponent } from './pages/infopage/infopage';


export const routes: Routes = [
    {path: '', component: MainComponent, pathMatch: 'full'},
    {path:'info/:id', component: InfoComponent}
];
