import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SignalizedPokemon } from '../../../../lib/pokemon/la/tasks-simulator/pokemon-la-tasks-simulator.service';
import { BaseComponent } from '../../../../lib/components/base.component';

@Component({
  selector: 'img[appPokemonImg]',
  imports: [
    FormsModule,
  ],
  host: {
    '[class]': 'hostClass()',
    '[width]': 'size()',
    '[height]': 'size()',
    '[alt]': 'name()',
    '[src]': '`/pokemon/la/images/pokemon/${id()}.png`',
  },
  template: ``,
})
export class PokemonImgComponent extends BaseComponent {
  pokemon = input.required<SignalizedPokemon>()
  size = input<number>(80);

  id = computed(() => this.pokemon().id);
  name = computed(() => this.pokemon().name());

  override class: InputSignal<string | undefined> = input<string>();
  override defaultClasses: Signal<string> = computed<string>(() => '');
}
