import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pokemon-la-page.component'),
    children: [
      {
        path: '',
        loadComponent: () => import('./pokemon-la.component'),
      },
      {
        path: 'tasks-simulator',
        loadChildren: () => import('./tasks-simulator/pokemon-la-tasks-simulator.routes'),
      },
    ]
  },
];

export default routes;
