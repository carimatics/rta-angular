import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', loadComponent: () => import('./pokemon-la-tasks-simulator-page.component'),
  },
];

export default routes;
