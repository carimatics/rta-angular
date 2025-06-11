import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pokemon-la-page',
  imports: [RouterOutlet],
  template: `
    <div data-theme="pokemon-la" class="flex flex-col bg-surface-container">
      <router-outlet />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonLAPageComponent {}

export default PokemonLAPageComponent;
