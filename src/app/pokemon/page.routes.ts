import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page.component'),
    children: [
      {
        path: 'la',
        loadChildren: () => import('./la/page.routes'),
      },
    ],
  },
];

export default routes;
