import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pokemon-la',
  imports: [
    RouterOutlet
  ],
  template: `
    <div data-theme="pokemon-la" class="flex flex-col bg-surface underline text-error">
      <header class="bg-surface fixed top-0 z-50 flex h-12 w-full items-center">
        <div class="ml-2 font-bold">へっだ〜</div>
      </header>
      <div class="flex bg-surface pt-12">
        <router-outlet />
      </div>
    </div>
  `,
})
export class PokemonLAPage {

}

export default PokemonLAPage;
