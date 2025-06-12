import { ChangeDetectionStrategy, Component, InputSignal, Signal, computed, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
    <div class="my-1">
      <ul class="w-80 h-[calc(100vh-112px)] flex flex-col overflow-y-auto p-1">
        @for (pokemon of filteredPokemons(); track pokemon.id) {
          <li class="mx-4 my-2">
            <app-pokemon-list-card [pokemon]="pokemon" (click)="clickPokemon.emit(pokemon)" />
          </li>
        }
      </ul>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonListComponent extends BaseComponent {
  pokedex = input.required<SignalizedPokemon[]>();
  clickPokemon = output<SignalizedPokemon>();

  searchInputWord = model('');

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
