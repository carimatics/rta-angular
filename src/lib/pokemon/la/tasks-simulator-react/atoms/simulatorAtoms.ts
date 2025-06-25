import { atom } from 'jotai';
import {
  LanguageEnum,
  PokemonEnum,
  SegmentEnum,
  type PokedexData,
  type Language,
  type Pokemon,
  type Segment,
  type AllPokemonTasksProgress,
  type Dictionary,
  MoveEnum,
  MoveTypeEnum,
  TaskEnum,
  PokedexTask,
} from '../taskTypes';

// --- Data Import ---
// Assuming pokedex data is directly importable.
// In a real scenario, this might be fetched or loaded differently.
// For now, we directly use the structure from the Angular project.

// This is a placeholder for the actual pokedex data.
// We will need to create a 'pokedex.ts' file in the react structure
// similar to 'src/lib/pokemon/la/fixtures/pokedex.ts'
// For now, let's define a minimal structure.
// const pokedexData: PokedexData = {
//   // Example:
//   [PokemonEnum.Pikachu]: {
//     tasks: [
//       { id: TaskEnum.Caught, reward: 10, requirements: [1, 2, 3] },
//       { id: TaskEnum.SeenUseMove, option: MoveEnum.ThunderShock, reward: 5, requirements: [1, 5, 10] },
//     ],
//   },
//   // ... other Pokemon data
// };
import { pokedex } from '../pokedex'; // Actual import

// --- Base Atoms ---

/**
 * Holds the raw pokedex data.
 * This atom is read-only from the perspective of most of the app,
 * typically initialized once.
 */
export const pokedexDataAtom = atom<PokedexData>(pokedex);

/**
 * Stores the current language setting for the UI.
 * Defaults to English.
 */
export const languageAtom = atom<Language>(LanguageEnum.En);

/**
 * Stores the currently selected Pokemon ID.
 * Defaults to the first Pokemon in the enum as an example.
 */
export const currentPokemonIdAtom = atom<Pokemon | null>(null);

/**
 * Stores the currently selected Segment.
 * Defaults to Village1.
 */
export const currentSegmentAtom = atom<Segment>(SegmentEnum.Village1);

/**
 * The core atom for storing all task progresses.
 * Structure: Map<PokemonId, Map<TaskIdString, Record<Segment, number>>>
 * PokemonId (number) -> TaskIdString (string) -> Segment (number) -> progress (number)
 * Initialized as an empty Map.
 */
export const allPokemonTasksProgressAtom = atom<AllPokemonTasksProgress>(new Map());


// --- Derived Atoms (for Dictionaries and UI Lists) ---

// Placeholder for dictionary functions. These would need to be implemented
// similar to the Angular dictionaries (e.g., in a utils/dictionaries.ts file).
const dictionaries = {
  [LanguageEnum.En]: {
    pokemon: (id: Pokemon) => `Pokemon ${id}`,
    task: (id: TaskEnum, option?: MoveEnum | MoveTypeEnum) => `Task ${id}${option ? ` (${option})` : ''}`,
    segment: (id: Segment) => `Segment ${id}`,
    move: (id: MoveEnum) => `Move ${id}`,
    moveType: (id: MoveTypeEnum) => `Move Type ${id}`,
  },
  [LanguageEnum.Ja]: {
    pokemon: (id: Pokemon) => `ポケモン ${id}`,
    task: (id: TaskEnum, option?: MoveEnum | MoveTypeEnum) => `タスク ${id}${option ? ` (${option})` : ''}`,
    segment: (id: Segment) => `セグメント ${id}`,
    move: (id: MoveEnum) => `わざ ${id}`,
    moveType: (id: MoveTypeEnum) => `タイプ ${id}`,
  },
};

/**
 * Provides the dictionary object based on the current language.
 * This is a read-only atom.
 */
export const dictionaryAtom = atom<Dictionary['en']>(get => {
  const lang = get(languageAtom);
  return dictionaries[lang] || dictionaries[LanguageEnum.En];
});


/**
 * Provides a list of segments with their names for UI display.
 * This is a read-only atom derived from SegmentEnum and dictionaryAtom.
 */
export const segmentsAtom = atom(get => {
  const dict = get(dictionaryAtom);
  return Object.values(SegmentEnum)
    .filter((value): value is Segment => typeof value === 'number') // Ensure we only get numeric enum values
    .map(id => ({
      id: id as Segment,
      name: dict.segment(id as Segment),
    }));
});

/**
 * Provides a list of all Pokemons with their names for UI display (e.g., dropdowns).
 * This is a read-only atom.
 */
export const pokemonListAtom = atom(get => {
  const dict = get(dictionaryAtom);
  const pd = get(pokedexDataAtom);
  return Object.keys(pd)
    .map(Number) // Convert string keys back to numbers
    .filter((id): id is Pokemon => PokemonEnum[id as Pokemon] !== undefined) // Type guard
    .map(id => ({
      id: id as Pokemon,
      name: dict.pokemon(id as Pokemon),
    }));
});

// --- Utility functions related to Atoms (can be expanded or moved) ---

/**
 * Helper to generate TaskIdString for use as map keys.
 */
export const getTaskIdString = (task: PokedexTask | { id: TaskEnum; option?: MoveEnum | MoveTypeEnum }): string => {
  return `${task.id}-${task.option || 'none'}`;
};

/**
 * Atom to calculate the total points across all Pokemon.
 */
export const totalPointsAtom = atom(get => {
  const allProgress = get(allPokemonTasksProgressAtom);
  const pokedex = get(pokedexDataAtom);
  let total = 0;

  allProgress.forEach((pokemonProgressMap, pokemonId) => {
    const pokemonData = pokedex[pokemonId];
    if (!pokemonData) return;

    // Check if Pokemon is caught (simplified check, assumes first task is catch task)
    // A more robust way would be to use the `caughtAtom` from `pokemonAtomFamily`
    // but that would create a circular dependency or require a more complex setup.
    // For now, let's do a simplified catch check here.
    const catchTaskDef = pokemonData.tasks.find(t => t.id === TaskEnum.Caught) || pokemonData.tasks[0];
    let isCaught = false;
    if (catchTaskDef) {
      const catchTaskProgress = pokemonProgressMap.get(getTaskIdString(catchTaskDef));
      if (catchTaskProgress && Object.values(catchTaskProgress).some(p => p > 0)) {
        isCaught = true;
      }
    }
    if (!isCaught && pokemonData.tasks.length > 0 && pokemonId !== PokemonEnum.Arceus) return; // Arceus points count even if not "caught" by main task

    pokemonProgressMap.forEach((taskProgress, taskIdStr) => {
      const taskDef = pokemonData.tasks.find(t => getTaskIdString(t) === taskIdStr);
      if (taskDef) {
        const maxProgressInAnySegment = Math.max(0, ...Object.values(taskProgress));
        const achievedCount = taskDef.requirements.filter(req => maxProgressInAnySegment >= req).length;
        total += achievedCount * taskDef.reward;
      }
    });
  });
  return total;
});

/**
 * Atom to calculate total points by segment across all Pokemon.
 */
export const totalPointsBySegmentAtom = atom(get => {
  const allProgress = get(allPokemonTasksProgressAtom);
  const pokedex = get(pokedexDataAtom);
  const pointsBySeg: Record<Segment, { increased: number; total: number }> = {} as Record<Segment, { increased: number; total: number }>;

  const allSegments = Object.values(SegmentEnum).filter(v => typeof v === 'number') as Segment[];

  for (const pokemonId_str in pokedex) {
    const pokemonId = Number(pokemonId_str) as Pokemon;
    const pokemonData = pokedex[pokemonId];
    if (!pokemonData) continue;

    const pokemonProgressMap = allProgress.get(pokemonId);
    if (!pokemonProgressMap) continue;

    // Simplified catch check
    const catchTaskDef = pokemonData.tasks.find(t => t.id === TaskEnum.Caught) || pokemonData.tasks[0];
    let isCaught = false;
    if (catchTaskDef) {
      const catchTaskProgress = pokemonProgressMap.get(getTaskIdString(catchTaskDef));
      if (catchTaskProgress && Object.values(catchTaskProgress).some(p => p > 0)) {
        isCaught = true;
      }
    }
    if (!isCaught && pokemonData.tasks.length > 0 && pokemonId !== PokemonEnum.Arceus) continue;


    let pokemonCumulativeTotalPoints = 0;
    const pokemonPointsBySegmentForCurrentPokemon: typeof pointsBySeg = {} as typeof pointsBySeg;

    for (const segment of allSegments) {
        let currentTotalUpToSegmentForPokemon = 0;
        pokemonData.tasks.forEach(taskDef => {
            const taskProgs = pokemonProgressMap.get(getTaskIdString(taskDef));
            if (taskProgs) {
                let maxProgressUpToSegment = 0;
                for (const segKeyStr in taskProgs) {
                    const segKey = parseInt(segKeyStr) as Segment;
                    if (segKey <= segment) {
                        maxProgressUpToSegment = Math.max(maxProgressUpToSegment, taskProgs[segKey]);
                    }
                }
                const achievedCount = taskDef.requirements.filter(req => maxProgressUpToSegment >= req).length;
                currentTotalUpToSegmentForPokemon += achievedCount * taskDef.reward;
            }
        });

        const increasedForPokemon = currentTotalUpToSegmentForPokemon - pokemonCumulativeTotalPoints;
        if (increasedForPokemon > 0 || (segment === SegmentEnum.Village1 && currentTotalUpToSegmentForPokemon > 0) ) {
             pokemonPointsBySegmentForCurrentPokemon[segment] = {
                increased: increasedForPokemon,
                total: currentTotalUpToSegmentForPokemon,
            };
        }
        pokemonCumulativeTotalPoints = currentTotalUpToSegmentForPokemon;
    }

    // Aggregate into global pointsBySeg
    let lastAggregatedTotalForPokemon = 0;
    for(const segment of allSegments) {
        const pkmnSegData = pokemonPointsBySegmentForCurrentPokemon[segment];
        if (pkmnSegData) {
            if (!pointsBySeg[segment]) {
                pointsBySeg[segment] = { increased: 0, total: 0 };
            }
            // The 'increased' for the global sum needs to be based on the change in *total for this pokemon* from the *previous segment's total for this pokemon*
            const actualIncreaseForPokemonInThisSegment = pkmnSegData.total - lastAggregatedTotalForPokemon;
            pointsBySeg[segment].increased += actualIncreaseForPokemonInThisSegment;
            // The 'total' for pointsBySeg[segment] will be summed up at the end across all pokemons for that segment
            lastAggregatedTotalForPokemon = pkmnSegData.total;
        }
    }
  }

  // Calculate final totals for pointsBySeg by summing totals from all pokemon up to that segment
  let cumulativeTotalAllPokemon = 0;
  for (const segment of allSegments) {
      if (pointsBySeg[segment]) {
          // The 'increased' part is already summed correctly.
          // The 'total' part needs to be the cumulative sum up to this segment.
          cumulativeTotalAllPokemon += pointsBySeg[segment].increased;
          pointsBySeg[segment].total = cumulativeTotalAllPokemon;
      }
  }
    // Filter out segments that ended up with zero increase and are not the first segment with points
    const finalPointsBySeg: Record<Segment, { increased: number; total: number }> = {};
    let previousTotal = 0;
    for (const segment of allSegments) {
        if (pointsBySeg[segment] && (pointsBySeg[segment].increased > 0 || (Object.keys(finalPointsBySeg).length === 0 && pointsBySeg[segment].total > 0))) {
            finalPointsBySeg[segment] = {
                increased: pointsBySeg[segment].increased, // Already correctly calculated based on diffs
                total: pointsBySeg[segment].total // Cumulative total
            };
            previousTotal = pointsBySeg[segment].total;
        } else if (pointsBySeg[segment] && pointsBySeg[segment].increased === 0 && pointsBySeg[segment].total === previousTotal && Object.keys(finalPointsBySeg).length > 0) {
            // if increased is 0 and total hasn't changed from previous segment with points, skip
        } else if (pointsBySeg[segment] && Object.keys(finalPointsBySeg).length === 0 && pointsBySeg[segment].total === 0){
            // Skip if it's the first potential segment but has no points
        }


    }


  return finalPointsBySeg;
});
