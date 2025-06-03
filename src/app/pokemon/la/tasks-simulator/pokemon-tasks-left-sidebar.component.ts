import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SignalizedPokemon } from '../../../models';
import { PokemonListComponent } from '../../pokemon-list/pokemon-list.component'; // Assuming this path
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-tasks-left-sidebar',
  standalone: true,
  imports: [CommonModule, PokemonListComponent],
  template: `
    <aside class="flex h-[calc(100vh-56px)] w-80 flex-col border-r">
      <app-pokemon-list
        class="flex-grow"
        [pokedex]="pokedex"
        (clickPokemon)="onPokemonClicked($event)">
      </app-pokemon-list>
    </aside>
  `,
})
export class PokemonTasksLeftSidebarComponent {
  @Input({ required: true }) pokedex!: SignalizedPokemon[];
  @Output() pokemonClicked = new EventEmitter<SignalizedPokemon>(); // This output name is used by the parent (PokemonLATasksSimulatorComponent)

  onPokemonClicked(pokemon: SignalizedPokemon) {
    this.pokemonClicked.emit(pokemon);
  }
}
