import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app.component'),
    children: [
      {
        path: 'pokemon',
        loadChildren: () => import('./pokemon/page.routes'),
      },
    ]
  },
];
