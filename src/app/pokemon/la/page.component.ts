import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-pokemon-la-page',
  imports: [
    RouterOutlet,
    HeaderComponent
  ],
  template: `
    <div data-theme="pokemon-la" class="flex flex-col bg-surface-container">
      <app-pokemon-la-header class="fixed top-0" />
      <div class="mt-14">
        <router-outlet />
      </div>
    </div>
  `,
})
export class PokemonLAPage {

}

export default PokemonLAPage;
