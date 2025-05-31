import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', loadComponent: () => import('./pokemon-page.component'),
  },
  {
    path: 'la', loadChildren: () => import('./la/pokemon-la-page.routes'),
  },
];

export default routes;
