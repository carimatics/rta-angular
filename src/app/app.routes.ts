import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'pokemon',
    loadChildren: () => import('./pokemon/page.routes'),
  },
  { path: '', redirectTo: 'pokemon', pathMatch: 'full' }
];
