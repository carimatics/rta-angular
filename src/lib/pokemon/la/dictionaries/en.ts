import { Dictionary } from './base';
import { Move, MoveType, Place, Pokemon, Segment, Task } from '../fixtures';
import { moves, moveTypes, places, pokemons, segments, tasks } from '../fixtures/locales/en';

export class EnDictionary implements Dictionary {
  move(id: Move): string {
    return moves[id];
  }

  moveType(id: MoveType): string {
    return moveTypes[id];
  }

  place(id: Place): string {
    return places[id];
  }

  pokemon(id: Pokemon): string {
    return pokemons[id];
  }

  segment(id: Segment): string {
    return segments[id];
  }

  task(id: Task, option: number): string {
    return tasks[id](option);
  }
}
