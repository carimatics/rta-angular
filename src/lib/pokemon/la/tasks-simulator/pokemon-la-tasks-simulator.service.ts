import { Injectable, InjectionToken, Signal, WritableSignal, computed, inject, signal } from '@angular/core';

import { Dictionary, getDictionary } from '../dictionaries';
import { Language, Pokedex, Pokemon, Segment, pokedex } from '../fixtures';
import { closedRangePokemons, closedRangeSegments } from '../utils/la-range';
import { PointsBySegment } from './points-by-segment';
import { SignalizedPokemon } from './signalized-pokemon';

export const SERVICE_POKEDEX_TOKEN: InjectionToken<Pokedex> = new InjectionToken<Pokedex>('lib.pokemon.la.tasks-simulator.service.pokedex', {
  providedIn: 'root',
  factory: () => pokedex,
});
export const SERVICE_LANG_TOKEN: InjectionToken<Language> = new InjectionToken<Language>('lib.pokemon.la.tasks-simulator.service.lang', {
  providedIn: 'root',
  factory: () => (/^ja\b/.test(navigator.language) ? Language.Ja : Language.En),
});

@Injectable({ providedIn: 'root' })
export class PokemonLaTasksSimulatorService {
  readonly pokedex: WritableSignal<SignalizedPokemon[]>;
  readonly currentPokemonId: WritableSignal<Pokemon> = signal(Pokemon.Rowlet);
  readonly currentPokemon: Signal<SignalizedPokemon> = computed(() => this.pokedex().find((pokemon) => pokemon.id === this.currentPokemonId())!);
  readonly currentSegment: WritableSignal<Segment> = signal(Segment.Village1);
  readonly pointsBySegment: Signal<PointsBySegment> = computed(() => {
    const points = {} as PointsBySegment;
    for (const pokemon of this.pokedex()) {
      const pt = pokemon.pointsBySegment();
      for (const p of Object.keys(pt)) {
        const segment = parseInt(p) as Segment;
        if (!Object.hasOwn(points, segment)) {
          points[segment] = { increased: 0, total: 0 };
        }
        points[segment].increased += pt[segment].increased;
        points[segment].total += pt[segment].total;
      }
    }
    return points;
  });
  readonly points: Signal<number> = computed(() => {
    return this.segments().reduce((acc, segment) => {
      const increased = this.pointsBySegment()[segment.id]?.increased ?? 0;
      return acc + increased;
    }, 0);
  });
  private readonly pd: Pokedex = inject(SERVICE_POKEDEX_TOKEN);
  private readonly lang: Language = inject(SERVICE_LANG_TOKEN);
  private readonly language = signal<Language>(this.lang);
  readonly dictionary: Signal<Dictionary> = computed(() => getDictionary(this.language()));
  readonly segments: Signal<{ id: Segment; name: string }[]> = computed(() =>
    closedRangeSegments().map((id) => ({
      id,
      name: this.dictionary().segment(id),
    })),
  );

  constructor() {
    this.pokedex = signal(this.generateNewPokedex());
  }

  reset(): void {
    this.pokedex.set(this.generateNewPokedex());
  }

  doCurrentPokemonTask(taskNo: number, progress: number): void {
    if (taskNo < 0 || taskNo >= this.currentPokemon().normalTasks.length) {
      return;
    }
    this.currentPokemon().doTask(taskNo, progress, this.currentSegment());
  }

  resetCurrentPokemonTask(taskNo: number): void {
    this.currentPokemon().resetTask(taskNo);
  }

  resetCurrentPokemonTasks(): void {
    this.currentPokemon().resetTasks();
  }

  private generateNewPokedex(): SignalizedPokemon[] {
    return closedRangePokemons().map((id) => new SignalizedPokemon(this.dictionary, this.pd, id));
  }
}
