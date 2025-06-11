import { Signal, computed } from '@angular/core';

import { Dictionary } from '../dictionaries';
import { Pokedex, Pokemon, Segment } from '../fixtures';
import { closedRangeSegments } from '../utils/la-range';
import { PointsBySegment } from './points-by-segment';
import { SignalizedTask } from './signalized-task';

export class SignalizedPokemon {
  id: Pokemon;
  isArceus: boolean;
  name: Signal<string> = computed(() => this.dictionary().pokemon(this.id));

  tasks: SignalizedTask[];
  catchTask: SignalizedTask;
  normalTasks: SignalizedTask[];
  completeTask: SignalizedTask;

  caught: Signal<boolean> = computed(() => this.catchTask.progress() > 0);
  points: Signal<number> = computed(() => {
    return this.caught() ? this.tasks.reduce((acc, task) => acc + task.points(), 0) : 0;
  });
  segmentCompleted: Signal<Segment | undefined> = computed(() =>
    closedRangeSegments().find((segment) => {
      if (this.isArceus && this.caught()) {
        return true;
      }
      const points = this.pointsNormalTasksUntilSegment(segment);
      return points >= 100;
    }),
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
    pokedex: Pokedex,
    readonly pokemon: Pokemon,
  ) {
    this.id = pokemon;
    this.isArceus = this.id === Pokemon.Arceus;
    this.tasks = pokedex[this.id].tasks.map((task) => new SignalizedTask(this.dictionary, task));
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
    return this.pointsNormalTasksUntilSegment(segment) + this.pointsCompleteTaskUntilSegment(segment);
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
