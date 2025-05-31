import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'la', loadChildren: () => import('./la/page.routes'),
  },
];

export default routes;
