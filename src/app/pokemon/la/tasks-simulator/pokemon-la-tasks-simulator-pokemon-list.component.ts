import { Component, computed, input, InputSignal, model, output, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SignalizedPokemon } from '../../../../lib/pokemon/la/tasks-simulator/pokemon-la-tasks-simulator.service';
import { BaseComponent } from '../../../../lib/components/base.component';
import { ButtonComponent } from '../../../../lib/components/button.component';
import {
  PokemonLATasksSimulatorPokemonListCardComponent
} from './pokemon-la-tasks-simulator-pokemon-list-card.component';
import { SearchInputComponent } from '../../../../lib/components/search-input.component';
import { hiraganaToKatakana } from '../../../../lib/utils/change-case';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-pokemon-la-tasks-simulator-pokemon-list',
  imports: [
    FormsModule,
    ButtonComponent,
    PokemonLATasksSimulatorPokemonListCardComponent,
    SearchInputComponent,
  ],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <div class="mx-4 my-2">
      <div class="flex">
        <input
          libSearchInput
          type="search"
          placeholder="Search"
          [(ngModel)]="searchInputWord"
        />
        <button
          libButton
          color="error"
          class="ml-2"
          (click)="onClickClear()"
        >
          クリア
        </button>
      </div>
    </div>
    <div class="{{classListContainer()}}">
      <ul class="{{classList()}}">
        @for (pokemon of filteredPokemons(); track pokemon.id) {
          <li
            pokemonListCard
            class="mx-4 my-2"
            [pokemon]="pokemon"
            (click)="clickPokemon.emit(pokemon)"
          ></li>
        }
      </ul>
    </div>
  `,
})
export class PokemonLATasksSimulatorPokemonListComponent extends BaseComponent {
  pokedex = input.required<SignalizedPokemon[]>();

  classListWidth = input<string>('w-80');
  classListHeight = input<string>('h-[calc(100vh-108px)]');
  classListContainer = computed(() => twMerge('my-1 overflow-y-scroll', this.classListHeight()));
  classList = computed(() => twMerge('p-1', this.classListWidth()))

  searchInputWord = model('');
  searchWord = computed(() => hiraganaToKatakana(this.searchInputWord()))

  clickPokemon = output<SignalizedPokemon>();

  filteredPokemons = computed(() => {
    const searchWord = this.searchWord();
    if (searchWord === '') {
      return this.pokedex();
    }

    return this.pokedex().filter(pokemon =>
      pokemon.name().includes(searchWord) ||
      pokemon.id.toString().includes(searchWord)
    );
  });

  override class: InputSignal<string | undefined> = input<string>();
  override defaultClasses: Signal<string> = computed<string>(() => '');

  onClickClear() {
    this.searchInputWord.set('');
  }
}
