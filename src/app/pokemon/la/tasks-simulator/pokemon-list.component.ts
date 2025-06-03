import { Component, computed, input, InputSignal, model, output, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SignalizedPokemon } from '../../../../lib/pokemon/la/tasks-simulator/pokemon-la-tasks-simulator.service';
import { BaseComponent } from '../../../../lib/components/base.component';
import { ButtonComponent } from '../../../../lib/components/button.component';
import {
  PokemonListCardComponent
} from './pokemon-list-card.component';
import { SearchInputComponent } from '../../../../lib/components/search-input.component';
import { hiraganaToKatakana } from '../../../../lib/utils/change-case';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-pokemon-list',
  imports: [
    FormsModule,
    ButtonComponent,
    PokemonListCardComponent,
    SearchInputComponent,
  ],
  host: {
    '[class]': "hostClass() + ' flex flex-col h-full'", // Added flex flex-col and h-full
  },
  template: `
    <div class="mx-4 my-2"> <!-- Search bar part -->
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
    <div class="my-1 overflow-y-scroll flex-grow"> <!-- List part, flex-grow to take available space -->
      <ul class="p-1 w-full">
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
export class PokemonListComponent extends BaseComponent {
  pokedex = input.required<SignalizedPokemon[]>();

  // Removed classListWidth, classListHeight, classListContainer, classList

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
