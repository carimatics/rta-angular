import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tasks-simulator', loadChildren: () => import('./tasks-simulator/page.routes'),
  },
];

export default routes;
