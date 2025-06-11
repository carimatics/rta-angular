import { ChangeDetectionStrategy, Component, InputSignal, Signal, computed, input } from '@angular/core';

import { BaseComponent } from '../../../../lib/components/base.component';
import { SignalizedPokemon } from '../../../../lib/pokemon/la/tasks-simulator';
import { PokemonImgComponent } from './pokemon-img.component';

@Component({
  selector: 'app-pokemon-info',
  imports: [PokemonImgComponent],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <img app-pokemon-img [pokemon]="pokemon()" [alt]="pokemon().name()" />
    <div class="flex flex-col font-bold">
      <div>No. {{ pokemon().id }}</div>
      <div>{{ pokemon().name() }}</div>
      <div>{{ pokemon().points() }}</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonInfoComponent extends BaseComponent {
  pokemon = input.required<SignalizedPokemon>();

  override class: InputSignal<string | undefined> = input<string>();
  override defaultClasses: Signal<string> = computed<string>(() => 'flex flex-1 gap-2');
}
