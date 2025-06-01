import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pokemon-la-page',
  imports: [
    RouterOutlet
  ],
  template: `
    <div data-theme="pokemon-la" class="flex flex-col bg-surface">
      <header class="bg-surface fixed top-0 z-50 flex h-14 w-full items-center">
        <div class="ml-2 font-bold">へっだ〜</div>
      </header>
      <div class="flex bg-surface mt-14">
        <router-outlet />
      </div>
    </div>
  `,
})
export class PokemonLAPage {

}

export default PokemonLAPage;
