import { Signal, WritableSignal, computed, signal } from '@angular/core';

import { clamp } from '../../../utils/range';
import { Dictionary } from '../dictionaries';
import { Move, MoveType, Pokedex, Pokemon, Segment, Task } from '../fixtures';
import { closedRangeSegments, rangeSegments } from '../utils/la-range';

export class SignalizedTask {
  readonly id: Task;
  readonly option?: Move | MoveType;
  readonly reward: number;
  readonly requirements: number[];
  readonly min: number;
  readonly max: number;
  readonly first: number;
  readonly last: number;

  name: Signal<string> = computed(() => this.dictionary().task(this.id, this.option));
  progresses: WritableSignal<Record<Segment, number>> = signal({} as Record<Segment, number>);
  progress: Signal<number> = computed(() => {
    const progresses = this.progresses();
    return Object.keys(progresses)
      .map((key) => parseInt(key) as Segment)
      .reduce((max, segment) => (progresses[segment] > max ? progresses[segment] : max), 0);
  });
  achievedCount: Signal<number> = computed(() => {
    const progress = this.progress();
    return this.requirements.findLastIndex((req) => req <= progress) + 1;
  });
  points: Signal<number> = computed(() => this.reward * this.achievedCount());

  constructor(
    readonly dictionary: Signal<Dictionary>,
    readonly task: Pokedex[Pokemon]['tasks'][Task],
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
    const progress = closedRangeSegments(Segment.Village1, segment).reduce((max, seg) => {
      const progress = this.progresses()[seg] ?? 0;
      return progress > max ? progress : max;
    }, 0);
    const achievedCount = this.requirements.findLastIndex((req) => req <= progress) + 1;
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
    this.progresses.set(progresses);
  }
}
