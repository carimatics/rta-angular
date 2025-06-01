import { Language, Move, MoveType, pokedex, Pokemon, Segment, Task } from '../fixtures';
import { closedRangePokemons, closedRangeSegments, rangeSegments } from '../utils/la-range';
import { clamp } from '../../../utils/range';
import { computed, signal, Signal, WritableSignal } from '@angular/core';
import { Dictionary, getDictionary } from '../dictionaries';

type PointsBySegment = Record<Segment, { increased: number; total: number }>;

type PokedexPokemonTask = {
  id: Task;
  option?: Move | MoveType;
  reward: number;
  requirements: number[];
};

class SignalizedTask {
  id: Task;
  option: number | undefined;
  reward: number;
  requirements: number[];
  min: number;
  max: number;
  first: number;
  last: number;

  name: Signal<string> = computed(() => this.dictionary().task(this.id, this.option));
  progresses: WritableSignal<Record<Segment, number>> = signal({} as Record<Segment, number>);
  progress: Signal<number> = computed(() => {
    const progresses = this.progresses();
    return Object.keys(progresses)
      .map((key) => parseInt(key) as Segment)
      .reduce(
        (max, segment) =>
          progresses[segment] > max ? progresses[segment] : max,
        0,
      );
  });
  achievedCount: Signal<number> = computed(() => {
    const progress = this.progress();
    return this.requirements.findLastIndex((req) => req <= progress) + 1;
  });
  points: Signal<number> = computed(() => this.reward * this.achievedCount());

  constructor(
    readonly dictionary: Signal<Dictionary>,
    readonly task: PokedexPokemonTask,
  ) {
    this.id = task.id;
    this.option = task.option;
    this.reward = task.reward;
    this.requirements = task.requirements;
    this.min = 0;
    this.max = this.requirements[this.requirements.length - 1];
    this.first = this.requirements[0];
    this.last = this.requirements[this.requirements.length - 1];
  }

  reset() {
    this.progresses.set({} as Record<Segment, number>);
  }

  pointsUntilSegment(segment: Segment) {
    const progress = closedRangeSegments(Segment.Village1, segment).reduce(
      (max, seg) => {
        const progress = this.progresses()[seg] ?? 0;
        return progress > max ? progress : max;
      },
      0,
    );
    const achievedCount =
      this.requirements.findLastIndex((req) => req <= progress) + 1;
    return this.reward * achievedCount;
  }

  do(progress: number, segment: Segment) {
    const _progress = clamp(progress, this.min, this.max);

    // update progresses
    const progresses = { ...this.progresses() };
    if (_progress > 0) {
      progresses[segment] = _progress;
    } else {
      delete progresses[segment];
    }

    // fix progresses before the current segment
    for (const seg of rangeSegments(Segment.Village1, segment)) {
      const before = progresses[seg] ?? 0;
      if (before >= _progress) {
        delete progresses[seg];
      }
    }
    this.progresses.set(progresses)
  }
}

class SignalizedPokemon {
  id: Pokemon;
  isArceus: boolean;
  name: Signal<string> = computed(() => this.dictionary().pokemon(this.id));

  tasks: SignalizedTask[];
  catchTask: SignalizedTask;
  normalTasks: SignalizedTask[];
  completeTask: SignalizedTask;

  caught: Signal<boolean> = computed(() => this.catchTask.progress() > 0);
  points: Signal<number> = computed(() => {
    return this.caught()
      ? this.tasks.reduce((acc, task) => acc + task.points(), 0)
      : 0;
  });
  segmentCompleted: Signal<Segment | undefined> = computed(() =>
    closedRangeSegments().find((segment) => {
      if (this.isArceus && this.caught()) {
        return true;
      }
      const points = this.pointsNormalTasksUntilSegment(segment);
      return points >= 100;
    })
  );
  completed: Signal<boolean> = computed(() => {
    return this.segmentCompleted() !== undefined;
  });
  pointsBySegment: Signal<PointsBySegment> = computed(() => {
    let previous: Segment = Segment.Village1;

    const initial = this.pointsUntilSegment(previous);
    const points = {
      ...(initial > 0
        ? {
          [previous]: {
            increased: initial,
            total: initial,
          },
        }
        : {}),
    } as PointsBySegment;

    for (const segment of closedRangeSegments(Segment.Fieldlands1, Segment.Highlands3)) {
      const total = this.pointsUntilSegment(segment);
      const increased = total - (points[previous]?.total ?? 0);
      if (increased > 0) {
        points[segment] = {
          increased,
          total,
        };
        previous = segment;
      }
    }
    return points;
  });

  constructor(
    readonly dictionary: Signal<Dictionary>,
    readonly pokemon: Pokemon,
  ) {
    this.id = pokemon;
    this.isArceus = this.id === Pokemon.Arceus;
    this.tasks = pokedex[this.id].tasks
      .map((task) =>
        new SignalizedTask(
          this.dictionary,
          task,
        )
      );
    this.catchTask = this.tasks[0];
    this.normalTasks = this.tasks.slice(0, this.tasks.length - 1);
    this.completeTask = this.tasks[this.tasks.length - 1];
  }

  doTask(taskNo: number, progress: number, segment: Segment): void {
    const normalTasks = this.normalTasks;
    if (taskNo < 0 || taskNo >= normalTasks.length) {
      return;
    }

    // update task
    const task = normalTasks[taskNo];
    task.do(progress, segment);

    // update complete
    const completeTask = this.completeTask;
    const segmentCompleted = this.segmentCompleted();
    if (segmentCompleted) {
      completeTask.do(1, segmentCompleted);
    } else {
      completeTask.do(0, Segment.Highlands3);
    }
  }

  resetTask(taskNo: number): void {
    this.normalTasks?.[taskNo]?.reset();
  }

  resetTasks(): void {
    for (const task of this.normalTasks) {
      task.reset();
    }
  }

  private pointsUntilSegment(segment: Segment): number {
    return (
      this.pointsNormalTasksUntilSegment(segment) +
      this.pointsCompleteTaskUntilSegment(segment)
    );
  }

  private pointsNormalTasksUntilSegment(segment: Segment): number {
    if (!this.caughtUntilSegment(segment)) {
      return 0;
    }
    return this.normalTasks.reduce((acc, task) => {
      const points = task.pointsUntilSegment(segment);
      return acc + points;
    }, 0);
  }

  private pointsCompleteTaskUntilSegment(segment: Segment): number {
    const sc = this.segmentCompleted();
    if (sc === undefined) {
      return 0;
    }
    return segment >= sc ? this.completeTask.reward : 0;
  }

  private caughtUntilSegment(segment: Segment): boolean {
    const catchTask = this.catchTask;
    return closedRangeSegments(Segment.Village1, segment).some((seg) => Object.hasOwn(catchTask.progresses(), seg));
  }
}

class PokemonLaTasksSimulatorService {
  readonly dictionary: Signal<Dictionary> = computed(() => getDictionary(this.language()));
  readonly pokedex: WritableSignal<SignalizedPokemon[]>;

  readonly currentPokemonId: WritableSignal<Pokemon> = signal(Pokemon.Rowlet);
  readonly currentPokemon: Signal<SignalizedPokemon> = computed(
    () => this.pokedex().find((pokemon) => pokemon.id === this.currentPokemonId())!
  );

  readonly segments: Signal<{ id: Segment, name: string }[]> = computed(
    () => closedRangeSegments()
      .map((id) => ({
        id, name: this.dictionary().segment(id)
      }))
  );
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
    return this.segments()
      .reduce((acc, segment) => {
        const increased = this.pointsBySegment()[segment.id]?.increased ?? 0;
        return acc + increased;
      }, 0);
  });

  constructor(
    readonly language: WritableSignal<Language> = signal(Language.Ja),
  ) {
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
    return closedRangePokemons()
      .map((id) => new SignalizedPokemon(this.dictionary, id))
  }
}

export function createSignalizedPokedex(): PokemonLaTasksSimulatorService {
  if (/^ja\b/.test(navigator.language)) {
    return new PokemonLaTasksSimulatorService(signal(Language.Ja));
  }
  return new PokemonLaTasksSimulatorService(signal(Language.En));
}
