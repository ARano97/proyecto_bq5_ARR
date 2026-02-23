import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'categoria/:categoria', component: InicioComponent }
];