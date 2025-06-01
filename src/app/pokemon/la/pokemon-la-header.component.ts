import { Component, input } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-pokemon-la-header',
  imports: [],
  host: { '[class]': 'hostClass()' },
  template: `
    <header>
      <div class="ml-2 font-bold">へっだ〜</div>
    </header>
  `,
})
export class PokemonLAHeaderComponent {
  private classDefault = 'bg-surface z-50 flex h-14 w-full items-center';

  class = input<string>();

  hostClass() {
    const classOverrides = this.class();
    return classOverrides ? twMerge(this.classDefault, classOverrides) : this.classDefault;
  }
}

export default PokemonLAHeaderComponent;
