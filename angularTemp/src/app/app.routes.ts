import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RawDataComponent } from './raw-data/raw-data.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'raw', component: RawDataComponent },
    
  ];
