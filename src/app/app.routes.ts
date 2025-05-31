import { Routes } from '@angular/router';
import { App } from './app.component';

export const routes: Routes = [
  {
    path: '', component: App,
  },
  {
    path: 'pokemon', loadChildren: () => import('./pokemon/pokemon-page.routes'),
  },
];
