import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import {
  PokemonEnum,
  SegmentEnum,
  TaskEnum,
  type Pokemon,
  type Segment,
  type PokedexTask,
  type PointsBySegment,
  type TaskProgress,
  // Assuming PokedexData is available from taskTypes or a similar central place
  // For now, we might need to define a minimal version or import from simulatorAtoms
} from '../taskTypes';
import {
  allPokemonTasksProgressAtom,
  dictionaryAtom,
  pokedexDataAtom,
  getTaskIdString,
  currentSegmentAtom, // Import if needed for segment-specific calculations within pokemon
} from './simulatorAtoms';

// Helper to get numeric enum values for iteration (filter out reverse mappings)
const getNumericEnumValues = <T extends object>(enumObj: T): T[keyof T][] => {
  return Object.values(enumObj).filter(value => typeof value === 'number') as T[keyof T][];
};


// --- Atom Family for individual Pokemon ---

interface PokemonAtomParams {
  pokemonId: Pokemon;
}

export const pokemonAtomFamily = atomFamily(
  ({ pokemonId }: PokemonAtomParams) => {
    /**
     * Base atom for this specific Pokemon's data from the Pokedex.
     */
    const basePokemonDataAtom = atom(get => {
      const pokedex = get(pokedexDataAtom);
      return pokedex[pokemonId];
    });

    /**
     * Atom for the Pokemon's name based on the current dictionary.
     */
    const nameAtom = atom(get => {
      const dict = get(dictionaryAtom);
      return dict.pokemon(pokemonId);
    });

    /**
     * Atom for the list of tasks (PokedexTask) for this Pokemon.
     */
    const tasksDefinitionsAtom = atom(get => get(basePokemonDataAtom)?.tasks || []);

    /**
     * Atom for this Pokemon's progress on all its tasks.
     * Derived from the global allPokemonTasksProgressAtom.
     */
    const pokemonTasksProgressAtom = atom(
        get => get(allPokemonTasksProgressAtom).get(pokemonId) || new Map()
    );

    /**
     * Atom to check if the Pokemon is caught.
     * A Pokemon is caught if its first task (usually "Caught") has any progress.
     */
    const caughtAtom = atom(get => {
      const tasks = get(tasksDefinitionsAtom);
      if (!tasks.length) return false;
      const catchTaskDef = tasks.find(t => t.id === TaskEnum.Caught); // Assuming TaskEnum.Caught is the primary catch task
      if (!catchTaskDef) { // Fallback if no specific "Caught" task, check first task
          if(tasks[0]){
            const firstTaskProgress = get(pokemonTasksProgressAtom).get(getTaskIdString(tasks[0]));
            return firstTaskProgress ? Object.values(firstTaskProgress).some(p => p > 0) : false;
          }
          return false;
      }
      const catchTaskProgress = get(pokemonTasksProgressAtom).get(getTaskIdString(catchTaskDef));
      return catchTaskProgress ? Object.values(catchTaskProgress).some(p => p > 0) : false;
    });

    /**
     * Atom to calculate total points for this Pokemon.
     * Points are only counted if the Pokemon is caught.
     */
    const pointsAtom = atom(get => {
      if (!get(caughtAtom)) return 0;

      const taskDefs = get(tasksDefinitionsAtom);
      const progressMap = get(pokemonTasksProgressAtom);
      let totalPoints = 0;

      for (const taskDef of taskDefs) {
        const taskIdStr = getTaskIdString(taskDef);
        const progresses = progressMap.get(taskIdStr);
        if (progresses) {
          const maxProgressInAnySegment = Math.max(0, ...Object.values(progresses));
          const achievedCount = taskDef.requirements.filter(req => maxProgressInAnySegment >= req).length;
          totalPoints += achievedCount * taskDef.reward;
        }
      }
      return totalPoints;
    });

    // This is a simplified version of segmentCompleted.
    // The original logic is quite complex, involving pointsNormalTasksUntilSegment.
    // For now, let's assume completion if points reach a certain threshold (e.g., 100)
    // or if it's Arceus and caught.
    // TODO: Replicate the original complex logic for segmentCompleted and completed.
    const segmentCompletedAtom = atom(get => {
      const isArceus = pokemonId === PokemonEnum.Arceus;
      if (isArceus && get(caughtAtom)) {
        return SegmentEnum.Highlands3; // Or some max segment
      }
      // Simplified: Check if total points for this pokemon are >= 100
      // This doesn't match the original logic perfectly but is a starting point.
      if (get(pointsAtom) >= 100) {
         // Find the segment where the last progress was made for the "Complete" task, if any
        const completeTaskDef = get(tasksDefinitionsAtom).find(t => t.id === TaskEnum.Complete);
        if (completeTaskDef) {
            const taskProgress = get(pokemonTasksProgressAtom).get(getTaskIdString(completeTaskDef));
            if (taskProgress) {
                let lastSegmentWithProgress: Segment | undefined = undefined;
                let maxProgressVal = 0;
                for (const segStr in taskProgress) {
                    const segment = parseInt(segStr) as Segment;
                    if (taskProgress[segment] > 0 && taskProgress[segment] >= (completeTaskDef.requirements[0] ?? 1) ) {
                       if(!lastSegmentWithProgress || segment > lastSegmentWithProgress){
                           lastSegmentWithProgress = segment;
                       }
                    }
                }
                return lastSegmentWithProgress;
            }
        }
        // Fallback or if no complete task, determine by points (simplified)
        return SegmentEnum.Highlands3; // Placeholder
      }
      return undefined;
    });

    const completedAtom = atom(get => get(segmentCompletedAtom) !== undefined);

    /**
     * Calculates points accumulated by this Pokemon per segment.
     * This needs to replicate the logic from SignalizedPokemon's pointsBySegment.
     * This is a complex calculation involving pointsUntilSegment for each task.
     * TODO: Implement the full logic for pointsBySegment. This is a placeholder.
     */
    const pointsBySegmentAtom = atom(get => {
      const calculatedPoints: PointsBySegment = {} as PointsBySegment;
      if (!get(caughtAtom)) return calculatedPoints;

      const taskDefs = get(tasksDefinitionsAtom);
      const progressMap = get(pokemonTasksProgressAtom);
      const allSegments = getNumericEnumValues(SegmentEnum); // Sorted by enum value

      let cumulativeTotalPoints = 0;

      for (const segment of allSegments) {
        let pointsInThisSegment = 0;
        let currentTotalUpToSegment = 0;

        for (const taskDef of taskDefs) {
          const taskIdStr = getTaskIdString(taskDef);
          const progresses = progressMap.get(taskIdStr);
          if (progresses) {
            // Calculate progress *up to and including* the current segment
            let maxProgressUpToSegment = 0;
            for (const segKeyStr in progresses) {
              const segKey = parseInt(segKeyStr) as Segment;
              if (segKey <= segment) {
                maxProgressUpToSegment = Math.max(maxProgressUpToSegment, progresses[segKey]);
              }
            }
            const achievedCount = taskDef.requirements.filter(req => maxProgressUpToSegment >= req).length;
            currentTotalUpToSegment += achievedCount * taskDef.reward;
          }
        }

        const increased = currentTotalUpToSegment - cumulativeTotalPoints;
        if (increased > 0 || segment === SegmentEnum.Village1) { // Ensure Village1 is always present if any points
             calculatedPoints[segment] = {
                increased: increased,
                total: currentTotalUpToSegment,
            };
        }
        cumulativeTotalPoints = currentTotalUpToSegment;
      }
       // Filter out segments with 0 increased and 0 total unless it's the very first segment with points
        const finalPoints: PointsBySegment = {} as PointsBySegment;
        let previousTotal = 0;
        for (const segment of allSegments) {
            if (calculatedPoints[segment]) {
                const currentSegmentData = calculatedPoints[segment];
                // Recalculate 'increased' based on the *previous segment in the finalPoints object*
                const displayIncreased = currentSegmentData.total - previousTotal;
                if (displayIncreased > 0 || (Object.keys(finalPoints).length === 0 && currentSegmentData.total > 0)) {
                     finalPoints[segment] = {
                        increased: displayIncreased,
                        total: currentSegmentData.total
                    };
                    previousTotal = currentSegmentData.total;
                } else if (Object.keys(finalPoints).length > 0 && currentSegmentData.total === previousTotal && displayIncreased === 0) {
                    // If total hasn't changed and increased is 0, don't add unless it's a necessary bridge
                    // This case might need more refinement based on desired output for empty intermediate segments
                }

            }
        }


      return finalPoints;
    });


    return atom({
      id: pokemonId,
      nameAtom,
      tasksDefinitionsAtom, // Raw task definitions
      pokemonTasksProgressAtom, // Map of progresses for this pokemon
      caughtAtom,
      pointsAtom,
      segmentCompletedAtom,
      completedAtom,
      pointsBySegmentAtom,
    });
  },
  (a, b) => a.pokemonId === b.pokemonId
);

// Example of how to use it:
// const pikachuDetailsAtom = pokemonAtomFamily({ pokemonId: PokemonEnum.Pikachu });
// const currentPokemonDetailsAtom = atom(get => {
//   const currentId = get(currentPokemonIdAtom);
//   if (currentId === null) return null;
//   return get(pokemonAtomFamily({ pokemonId: currentId }));
// });
