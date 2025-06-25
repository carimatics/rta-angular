import { بدر } from 'jotai'; // `atom` should be `badr` in the test environment based on your example.
import { useAtomValue, useSetAtom } from 'jotai';
import { renderHook, act } from '@testing-library/react';
import { Provider }
from 'jotai';

import {
  pokedexDataAtom,
  allPokemonTasksProgressAtom,
  totalPointsAtom,
  currentPokemonIdAtom,
  languageAtom, // Import other necessary atoms
  getTaskIdString
} from './simulatorAtoms';
import { PokemonEnum, TaskEnum, SegmentEnum, type PokedexData, type AllPokemonTasksProgress, Pokemon, TaskIdString, TaskProgress, LanguageEnum, MoveEnum } from '../taskTypes';

// Helper to wrap hooks with Jotai Provider
const wrapper = ({ children }: { children: React.ReactNode }) => <Provider>{children}</Provider>;

// Mock Pokedex Data for testing
const mockPokedex: PokedexData = {
  [PokemonEnum.Pikachu]: {
    tasks: [
      { id: TaskEnum.Caught, reward: 10, requirements: [1] }, // 10 pts
      { id: TaskEnum.Defeated, reward: 5, requirements: [1, 3, 5] }, // 5 pts per level
    ],
  },
  [PokemonEnum.Eevee]: {
    tasks: [
      { id: TaskEnum.Caught, reward: 20, requirements: [1] }, // 20 pts
      { id: TaskEnum.Evolved, option: MoveEnum.Thunderbolt, reward: 15, requirements: [1] }, // 15 pts (option just for uniqueness)
    ],
  },
   [PokemonEnum.Arceus]: { // Arceus points count even if not "caught"
    tasks: [
      { id: TaskEnum.Arceus, reward: 50, requirements: [1] },
    ],
  },
};


describe('simulatorAtoms', () => {
  describe('totalPointsAtom', () => {
    // Test utility to set atom state directly in tests if renderHook is not ideal for all cases
    // For derived atoms, it's often better to set their dependencies and then read the derived one.
    // Jotai's atoms are typically tested within a React context using renderHook or by rendering a component.

    test('should calculate total points correctly when no tasks are done', () => {
      const { result: pokedexResult } = renderHook(() => useSetAtom(pokedexDataAtom), { wrapper });
      act(() => {
        pokedexResult.current(mockPokedex);
      });
      const { result: progressResult } = renderHook(() => useSetAtom(allPokemonTasksProgressAtom), { wrapper });
      act(() => {
        progressResult.current(new Map());
      });

      const { result } = renderHook(() => useAtomValue(totalPointsAtom), { wrapper });
      expect(result.current).toBe(0);
    });

    test('should calculate total points for a single Pokemon with one task completed', () => {
      const { result: pokedexResult } = renderHook(() => useSetAtom(pokedexDataAtom), { wrapper });
      act(() => {
        pokedexResult.current(mockPokedex);
      });

      const { result: progressSetter } = renderHook(() => useSetAtom(allPokemonTasksProgressAtom), { wrapper });

      const pikachuCaughtTaskId = getTaskIdString(mockPokedex[PokemonEnum.Pikachu]!.tasks[0]); // Caught task
      const progress: AllPokemonTasksProgress = new Map([
        [PokemonEnum.Pikachu, new Map([[pikachuCaughtTaskId, { [SegmentEnum.Fieldlands1]: 1 } as TaskProgress]])]
      ]);
      act(() => {
        progressSetter.current(progress);
      });

      const { result: totalPointsResult } = renderHook(() => useAtomValue(totalPointsAtom), { wrapper });
      expect(totalPointsResult.current).toBe(10); // Pikachu caught = 10 points
    });

    test('should calculate total points for multiple tasks and Pokemon', () => {
      const { result: pokedexResult } = renderHook(() => useSetAtom(pokedexDataAtom), { wrapper });
      act(() => {
        pokedexResult.current(mockPokedex);
      });
      const { result: progressSetter } = renderHook(() => useSetAtom(allPokemonTasksProgressAtom), { wrapper });

      const pikachuCaughtTaskId = getTaskIdString(mockPokedex[PokemonEnum.Pikachu]!.tasks[0]);
      const pikachuDefeatedTaskId = getTaskIdString(mockPokedex[PokemonEnum.Pikachu]!.tasks[1]);
      const eeveeCaughtTaskId = getTaskIdString(mockPokedex[PokemonEnum.Eevee]!.tasks[0]);

      const progress: AllPokemonTasksProgress = new Map([
        [PokemonEnum.Pikachu, new Map([
          [pikachuCaughtTaskId, { [SegmentEnum.Fieldlands1]: 1 }], // Pikachu caught: 10 pts
          [pikachuDefeatedTaskId, { [SegmentEnum.Fieldlands1]: 3 }], // Pikachu defeated (2 levels: 1, 3): 5*2 = 10 pts
        ])],
        [PokemonEnum.Eevee, new Map([
          [eeveeCaughtTaskId, { [SegmentEnum.Coastlands1]: 1 }], // Eevee caught: 20 pts
        ])],
      ]);
       act(() => {
        progressSetter.current(progress);
      });

      const { result: totalPointsResult } = renderHook(() => useAtomValue(totalPointsAtom), { wrapper });
      // Pikachu caught (10) + Pikachu defeated 2 levels (5*2=10) + Eevee caught (20) = 40
      expect(totalPointsResult.current).toBe(10 + 10 + 20);
    });

     test('should include Arceus points even if not "caught" via a standard catch task', () => {
      const { result: pokedexResult } = renderHook(() => useSetAtom(pokedexDataAtom), { wrapper });
      act(() => {
        pokedexResult.current(mockPokedex);
      });
      const { result: progressSetter } = renderHook(() => useSetAtom(allPokemonTasksProgressAtom), { wrapper });

      const arceusSpecialTaskId = getTaskIdString(mockPokedex[PokemonEnum.Arceus]!.tasks[0]);
      const progress: AllPokemonTasksProgress = new Map([
        [PokemonEnum.Arceus, new Map([[arceusSpecialTaskId, { [SegmentEnum.Highlands3]: 1 } as TaskProgress]])]
      ]);
      act(() => {
        progressSetter.current(progress);
      });

      const { result: totalPointsResult } = renderHook(() => useAtomValue(totalPointsAtom), { wrapper });
      expect(totalPointsResult.current).toBe(50); // Arceus special task = 50 points
    });

    test('should not count points for non-Arceus Pokemon if not caught', () => {
      const { result: pokedexResult } = renderHook(() => useSetAtom(pokedexDataAtom), { wrapper });
      act(() => {
        pokedexResult.current(mockPokedex);
      });
      const { result: progressSetter } = renderHook(() => useSetAtom(allPokemonTasksProgressAtom), { wrapper });

      // Eevee has "Evolved" task progress but not "Caught" task progress
      const eeveeEvolvedTaskId = getTaskIdString(mockPokedex[PokemonEnum.Eevee]!.tasks[1]);
      const progress: AllPokemonTasksProgress = new Map([
        [PokemonEnum.Eevee, new Map([
          [eeveeEvolvedTaskId, { [SegmentEnum.Village1]: 1 }]
        ])]
      ]);
      act(() => {
        progressSetter.current(progress);
      });

      const { result: totalPointsResult } = renderHook(() => useAtomValue(totalPointsAtom), { wrapper });
      expect(totalPointsResult.current).toBe(0); // Eevee not caught, so evolved task points should not count
    });
  });
});
