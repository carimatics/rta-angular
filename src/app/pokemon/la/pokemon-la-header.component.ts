import { Component, computed, input } from '@angular/core';
import { BaseComponent } from '../../../lib/components/base.component';

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
export class PokemonLAHeaderComponent extends BaseComponent {
  override class = input<string>();
  override defaultClasses = computed(() => 'z-50 flex h-14 w-full items-center');
}

export default PokemonLAHeaderComponent;
