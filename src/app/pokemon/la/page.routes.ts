import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // The component for this path is PokemonLAPage.
    // It's already being loaded by the parent route in the (now modified) pokemon/page.routes.ts,
    // which points to this file for 'la'.
    // The actual component for '' path within this module's scope is PokemonLAPage.
    loadComponent: () => import('./page.component'), // This is PokemonLAPage
    children: [
      // The '' child route that loaded content.component is removed.
      // If PokemonLAPage itself should display content for '/pokemon/la' path,
      // that content goes into its template. The router-outlet in PokemonLAPage
      // will then render children like 'tasks-simulator'.
      {
        path: 'tasks-simulator',
        loadChildren: () => import('./tasks-simulator/page.routes'),
      },
      // If there was a default child to show for '/pokemon/la',
      // it could be defined here, e.g.
      // { path: '', component: SomeDefaultChildComponent }
      // or a redirect:
      // { path: '', redirectTo: 'some-default-child', pathMatch: 'full' }
    ]
  },
];

export default routes;
