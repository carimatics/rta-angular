import { ChangeDetectionStrategy, Component, InputSignal, Signal, computed, input } from '@angular/core';

import { BaseComponent } from '../../../../lib/components/base.component';
import { SignalizedPokemon } from '../../../../lib/pokemon/la/tasks-simulator';
import { PokemonImgComponent } from './pokemon-img.component';

@Component({
  selector: 'app-pokemon-list-card',
  imports: [PokemonImgComponent],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <div class="bg-primary hover:brightness-125 border border-outline flex gap-2 overflow-clip rounded-xl transition-all sase-out">
      <img app-pokemon-img [pokemon]="pokemon()" [alt]="pokemon().name()" />
      <div class="flex w-full flex-col pr-4 text-on-primary">
        <div class="mt-1 font-bold">No. {{ pokemon().id }}</div>
        <div class="font-bold">{{ pokemon().name() }}</div>
        <div class="text-end">{{ pokemon().points() }}</div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonListCardComponent extends BaseComponent {
  pokemon = input.required<SignalizedPokemon>();

  override class: InputSignal<string | undefined> = input<string>();
  override defaultClasses: Signal<string> = computed<string>(() => 'gap-2 rounded-xl shadow-md hover:shadow-lg');
}
