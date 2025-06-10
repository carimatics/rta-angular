import { Component, InputSignal, Signal, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { twMerge } from 'tailwind-merge';

import { BaseComponent } from '../../../../lib/components/base.component';
import { ButtonComponent } from '../../../../lib/components/button.component';
import { SearchInputComponent } from '../../../../lib/components/search-input.component';
import { SignalizedPokemon } from '../../../../lib/pokemon/la/tasks-simulator';
import { hiraganaToKatakana } from '../../../../lib/utils/change-case';
import { PokemonListCardComponent } from './pokemon-list-card.component';

@Component({
  selector: 'app-pokemon-list',
  imports: [FormsModule, ButtonComponent, PokemonListCardComponent, SearchInputComponent],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <div class="mx-4 my-2">
      <div class="flex">
        <input lib-search-input type="search" placeholder="Search" [(ngModel)]="searchInputWord" />
        <button lib-button color="error" class="ml-2" (click)="onClickClear()">クリア</button>
      </div>
    </div>
    <div class="{{ classListContainer() }}">
      <ul class="{{ classList() }}">
        @for (pokemon of filteredPokemons(); track pokemon.id) {
          <li class="mx-4 my-2">
            <app-pokemon-list-card [pokemon]="pokemon" (click)="clickPokemon.emit(pokemon)" />
          </li>
        }
      </ul>
    </div>
  `,
})
export class PokemonListComponent extends BaseComponent {
  pokedex = input.required<SignalizedPokemon[]>();

  classListWidth = input<string>('w-80');
  classListHeight = input<string>('h-[calc(100vh-112px)]');
  classListContainer = computed(() => twMerge('my-1 overflow-y-scroll', this.classListHeight()));
  classList = computed(() => twMerge('p-1', this.classListWidth()));

  searchInputWord = signal('');
  clickPokemon = output<SignalizedPokemon>();

  override class: InputSignal<string | undefined> = input<string>();
  override defaultClasses: Signal<string> = computed<string>(() => '');

  private searchWord = computed(() => hiraganaToKatakana(this.searchInputWord()));
  filteredPokemons = computed(() => {
    const searchWord = this.searchWord();
    if (searchWord === '') {
      return this.pokedex();
    }

    return this.pokedex().filter((pokemon) => pokemon.name().includes(searchWord) || pokemon.id.toString().includes(searchWord));
  });

  onClickClear() {
    this.searchInputWord.set('');
  }
}
