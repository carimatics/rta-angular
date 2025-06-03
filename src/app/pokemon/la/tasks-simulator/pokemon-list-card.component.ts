import { Component, computed, input, InputSignal, model, output, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SignalizedPokemon } from '../../../../lib/pokemon/la/tasks-simulator/pokemon-la-tasks-simulator.service';
import { BaseComponent } from '../../../../lib/components/base.component';
import { PokemonImgComponent } from './pokemon-img.component';

@Component({
  selector: 'li[pokemonListCard]',
  imports: [
    FormsModule,
    PokemonImgComponent,
  ],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <ng-content>
      <div
        class="bg-primary hover:brightness-125 border border-outline flex gap-2 overflow-clip rounded-xl transition-all sase-out">
        <img pokemonImg [pokemon]="pokemon()" />
        <div class="flex w-full flex-col pr-4 text-on-primary">
          <div class="mt-1 font-bold">No. {{ id() }}</div>
          <div class="font-bold">{{ name() }}</div>
          <div class="text-end">{{ points() }}</div>
        </div>
      </div>
    </ng-content>
  `,
})
export class PokemonListCardComponent extends BaseComponent {
  pokemon = input.required<SignalizedPokemon>()
  click = output<void>();

  id = computed(() => this.pokemon().id);
  name = computed(() => this.pokemon().name());
  points = computed(() => this.pokemon().points());

  override class: InputSignal<string | undefined> = input<string>();
  override defaultClasses: Signal<string> = computed<string>(() => 'gap-2 rounded-xl shadow-md hover:shadow-lg');
}
