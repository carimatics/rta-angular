import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SignalizedPokemon } from '../../../../lib/pokemon/la/tasks-simulator/pokemon-la-tasks-simulator.service';
import { BaseComponent } from '../../../../lib/components/base.component';
import { PokemonImgComponent } from './pokemon-img.component';

@Component({
  selector: 'app-pokemon-info',
  imports: [
    FormsModule,
    PokemonImgComponent,
  ],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <img
      appPokemonImg
      [pokemon]="pokemon()"
      [alt]="pokemon().name()"
    />
    <div class="flex flex-col font-bold">
      <div>No. {{ pokemon().id }}</div>
      <div>{{ pokemon().name() }}</div>
      <div>{{ pokemon().points() }}</div>
    </div>
  `,
})
export class PokemonInfoComponent extends BaseComponent {
  pokemon = input.required<SignalizedPokemon>()

  override class: InputSignal<string | undefined> = input<string>();
  override defaultClasses: Signal<string> = computed<string>(() => 'flex flex-1 gap-2');
}
