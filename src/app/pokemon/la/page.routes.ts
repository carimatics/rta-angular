import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page.component'),
    children: [
      {
        path: '',
        loadComponent: () => import('./content.component'),
      },
      {
        path: 'tasks-simulator',
        loadChildren: () => import('./tasks-simulator/page.routes'),
      },
    ],
  },
];

export default routes;
