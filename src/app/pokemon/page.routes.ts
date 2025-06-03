import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'la', // The 'la' route is now directly under 'pokemon'
    loadChildren: () => import('./la/page.routes'),
  },
  // If there were other children of PokemonPage, they would be listed here at the same level as 'la'.
  // If 'pokemon' itself should have a default component/content,
  // it would be defined like: { path: '', component: SomePokemonLandingComponent }
  // For now, just make 'la' a direct child.
];

export default routes;
