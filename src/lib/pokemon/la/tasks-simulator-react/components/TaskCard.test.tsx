import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider, useSetAtom } from 'jotai';
import { TaskCard } from './TaskCard';
import {
    pokedexDataAtom,
    allPokemonTasksProgressAtom,
    currentSegmentAtom,
    getTaskIdString,
    dictionaryAtom // TaskCard uses nameAtom which depends on dictionaryAtom
} from '../atoms/simulatorAtoms';
import {
    PokemonEnum,
    TaskEnum,
    SegmentEnum,
    type PokedexData,
    type AllPokemonTasksProgress,
    type Language,
    LanguageEnum,
    MoveEnum
} from '../taskTypes';

// Mock Pokedex Data for the specific task
const mockPikachuTaskDef = { id: TaskEnum.Caught, reward: 10, requirements: [1, 2, 3] };
const mockPikachuData: PokedexData = {
  [PokemonEnum.Pikachu]: {
    tasks: [mockPikachuTaskDef],
  },
};
const pikachuTaskIdString = getTaskIdString(mockPikachuTaskDef);

// Mock dictionary
const mockDictionary = {
    pokemon: (id: PokemonEnum) => `Mock Pokemon ${id}`,
    task: (id: TaskEnum, option?: any) => `Mock Task ${id}${option ? ` (${option})` : ''}`,
    segment: (id: SegmentEnum) => `Mock Segment ${id}`,
    move: (id: MoveEnum) => `Mock Move ${id}`,
    moveType: (id: any) => `Mock MoveType ${id}`,
};


// Helper to wrap component with Jotai Provider and initialize necessary atoms
const renderWithProvider = (
    ui: React.ReactElement,
    {
        pokedex = mockPikachuData,
        progress = new Map(),
        segment = SegmentEnum.Fieldlands1,
        dictionary = mockDictionary
    }: {
        pokedex?: PokedexData;
        progress?: AllPokemonTasksProgress;
        segment?: SegmentEnum;
        dictionary?: typeof mockDictionary;
    } = {}
) => {
  const TestWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const setPokedex = useSetAtom(pokedexDataAtom);
    const setAllProgress = useSetAtom(allPokemonTasksProgressAtom);
    const setCurrentSeg = useSetAtom(currentSegmentAtom);
    const setDict = useSetAtom(dictionaryAtom);

    React.useEffect(() => {
      setPokedex(pokedex);
      setAllProgress(progress);
      setCurrentSeg(segment);
      setDict(dictionary);
    }, [pokedex, progress, segment, dictionary, setPokedex, setAllProgress, setCurrentSeg, setDict]);

    return <>{children}</>;
  };

  return render(ui, { wrapper: ({ children }) => <Provider><TestWrapper>{children}</TestWrapper></Provider> });
};


describe('TaskCard', () => {
  test('should display task name, progress, and points correctly', () => {
    renderWithProvider(
      <TaskCard pokemonId={PokemonEnum.Pikachu} taskIdString={pikachuTaskIdString} />
    );

    // Check if task name is displayed (derived from dictionary)
    expect(screen.getByText(`Mock Task ${TaskEnum.Caught}`)).toBeInTheDocument();

    // Check for initial progress (0 if not set)
    expect(screen.getByText(/Current Progress \(in selected segment .*\): 0 \/ 3/)).toBeInTheDocument(); // Max is 3 from requirements
    expect(screen.getByText(/Overall Max Progress: 0/)).toBeInTheDocument();
    expect(screen.getByText(/Achieved Levels: 0 \/ 3/)).toBeInTheDocument(); // 3 requirements
    expect(screen.getByText(/Points: 0/)).toBeInTheDocument();
  });

  test('should display updated progress and points', () => {
    const progressWithPikachuCaught: AllPokemonTasksProgress = new Map([
      [PokemonEnum.Pikachu, new Map([
        [pikachuTaskIdString, { [SegmentEnum.Fieldlands1]: 2 }] // Progress '2' in current segment
      ])]
    ]);

    renderWithProvider(
      <TaskCard pokemonId={PokemonEnum.Pikachu} taskIdString={pikachuTaskIdString} />,
      { progress: progressWithPikachuCaught, segment: SegmentEnum.Fieldlands1 }
    );

    expect(screen.getByText(`Mock Task ${TaskEnum.Caught}`)).toBeInTheDocument();
    // Progress in current segment is 2, overall max is 2
    expect(screen.getByText(/Current Progress \(in selected segment .*\): 2 \/ 3/)).toBeInTheDocument();
    expect(screen.getByText(/Overall Max Progress: 2/)).toBeInTheDocument();
    // Achieved levels for progress 2 with reqs [1, 2, 3] is 2 levels (1 and 2)
    expect(screen.getByText(/Achieved Levels: 2 \/ 3/)).toBeInTheDocument();
    // Points: 10 (reward) * 2 (levels) = 20
    expect(screen.getByText(/Points: 20/)).toBeInTheDocument();
  });

  // Note: Testing button interactions (doTask, resetTask) would require more setup
  // with user-event and potentially mocking the usePokemonTasks hook or its effects
  // on the atoms if we want to isolate the TaskCard component logic itself.
  // For this step, rendering and displaying derived state is the primary focus.
});
