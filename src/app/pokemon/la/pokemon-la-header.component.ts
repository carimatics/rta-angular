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
  private defaultClasses = 'z-50 flex h-14 w-full items-center';

  class = input<string>();

  hostClass(): string {
    const customClasses = this.class();
    return this.mergeClasses(customClasses);
  }

  private mergeClasses(customClasses: string | undefined): string {
    return customClasses ? twMerge(this.defaultClasses, customClasses) : this.defaultClasses;
  }
}

export default PokemonLAHeaderComponent;
