import { بدر } from 'jotai'; // `atom` should be `badr`
import { useAtomValue, useSetAtom, Provider } from 'jotai';
import { renderHook, act } from '@testing-library/react';
import { usePokemonTasks } from './usePokemonTasks';
import {
    allPokemonTasksProgressAtom,
    pokedexDataAtom,
    currentSegmentAtom,
    getTaskIdString
} from '../atoms/simulatorAtoms';
import { PokemonEnum, TaskEnum, SegmentEnum, type PokedexData, type AllPokemonTasksProgress, TaskProgress, MoveEnum } from '../taskTypes';

// Mock Pokedex Data
const mockPokedex: PokedexData = {
  [PokemonEnum.Pikachu]: {
    tasks: [
      { id: TaskEnum.Caught, reward: 10, requirements: [1] },
      { id: TaskEnum.SeenUseMove, option: MoveEnum.ThunderShock, reward: 5, requirements: [1, 3, 5] },
    ],
  },
};

const wrapper = ({ children }: { children: React.ReactNode }) => <Provider>{children}</Provider>;

describe('usePokemonTasks', () => {
  // Initialize dependent atoms before each test
  // It's cleaner to use a fresh Provider for each test, which testing-library's renderHook does with the wrapper.
  // We need to ensure atoms are in a known state.

  let setPokedex: (data: PokedexData) => void;
  let setAllProgress: (progress: AllPokemonTasksProgress) => void;
  let setCurrentSeg: (segment: SegmentEnum) => void;

  beforeEach(() => {
    // Reset atoms to initial state or mock state for each test
    // This can be done by rendering hooks that set these atoms.
    const { result: pokedexSetterResult } = renderHook(() => useSetAtom(pokedexDataAtom), { wrapper });
    setPokedex = pokedexSetterResult.current;

    const { result: progressSetterResult } = renderHook(() => useSetAtom(allPokemonTasksProgressAtom), { wrapper });
    setAllProgress = progressSetterResult.current;

    const { result: segmentSetterResult } = renderHook(() => useSetAtom(currentSegmentAtom), { wrapper });
    setCurrentSeg = segmentSetterResult.current;

    act(() => {
      setPokedex(mockPokedex);
      setAllProgress(new Map());
      setCurrentSeg(SegmentEnum.Fieldlands1);
    });
  });

  test('doTask should update allPokemonTasksProgressAtom correctly', () => {
    const pokemonId = PokemonEnum.Pikachu;
    const taskDef = mockPokedex[pokemonId]!.tasks[1]; // SeenUseMove ThunderShock
    const taskIdStr = getTaskIdString(taskDef);
    const targetSegment = SegmentEnum.Fieldlands1;
    const targetProgress = 3;

    // Setup initial state via atoms
    act(() => {
      setCurrentSeg(targetSegment);
    });

    const { result: hookResult } = renderHook(() => usePokemonTasks(pokemonId), { wrapper });

    act(() => {
      hookResult.current.doTask(taskIdStr, targetProgress, targetSegment);
    });

    const { result: allProgressResult } = renderHook(() => useAtomValue(allPokemonTasksProgressAtom), { wrapper });

    const expectedPokemonProgress = new Map<TaskIdString, TaskProgress>([
      [taskIdStr, { [targetSegment]: targetProgress }]
    ]);
    expect(allProgressResult.current.get(pokemonId)).toEqual(expectedPokemonProgress);
  });

  test('resetTask should clear progress for the specified task', () => {
    const pokemonId = PokemonEnum.Pikachu;
    const taskDef = mockPokedex[pokemonId]!.tasks[1];
    const taskIdStr = getTaskIdString(taskDef);
    const initialSegment = SegmentEnum.Fieldlands1;
    const initialProgressValue = 5;

    // Pre-populate progress
    const initialProgress: AllPokemonTasksProgress = new Map([
      [pokemonId, new Map([[taskIdStr, { [initialSegment]: initialProgressValue }]])]
    ]);
    act(() => {
      setAllProgress(initialProgress);
    });

    const { result: hookResult } = renderHook(() => usePokemonTasks(pokemonId), { wrapper });
    act(() => {
      hookResult.current.resetTask(taskIdStr);
    });

    const { result: allProgressResult } = renderHook(() => useAtomValue(allPokemonTasksProgressAtom), { wrapper });
    const pokemonProgress = allProgressResult.current.get(pokemonId);
    expect(pokemonProgress?.get(taskIdStr)).toEqual({}); // Expect empty object for cleared progress
  });

  test('resetPokemonTasks should clear all tasks for the specified Pokemon', () => {
    const pokemonId = PokemonEnum.Pikachu;
    const task1Def = mockPokedex[pokemonId]!.tasks[0];
    const task2Def = mockPokedex[pokemonId]!.tasks[1];
    const task1IdStr = getTaskIdString(task1Def);
    const task2IdStr = getTaskIdString(task2Def);

    const initialProgress: AllPokemonTasksProgress = new Map([
      [pokemonId, new Map([
        [task1IdStr, { [SegmentEnum.Fieldlands1]: 1 }],
        [task2IdStr, { [SegmentEnum.Fieldlands2]: 3 }],
      ])]
    ]);
     act(() => {
      setAllProgress(initialProgress);
    });

    const { result: hookResult } = renderHook(() => usePokemonTasks(pokemonId), { wrapper });
    act(() => {
      hookResult.current.resetPokemonTasks();
    });

    const { result: allProgressResult } = renderHook(() => useAtomValue(allPokemonTasksProgressAtom), { wrapper });
    const pokemonProgressAfterReset = allProgressResult.current.get(pokemonId);

    expect(pokemonProgressAfterReset?.get(task1IdStr)).toEqual({});
    expect(pokemonProgressAfterReset?.get(task2IdStr)).toEqual({});
  });
});
