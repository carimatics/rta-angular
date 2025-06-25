import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import {
  type Pokemon,
  type Segment,
  type PokedexTask,
  type TaskProgress,
  type TaskIdString,
  type Move,
  type MoveType,
  TaskEnum,
  SegmentEnum,
} from '../taskTypes';
import {
  allPokemonTasksProgressAtom,
  dictionaryAtom,
  pokedexDataAtom,
  getTaskIdString as globalGetTaskIdString, // Renamed to avoid conflict
} from './simulatorAtoms';
import { pokemonAtomFamily } from './pokemonAtoms'; // To access pokemon specific details if necessary

interface TaskAtomParams {
  pokemonId: Pokemon;
  taskIdString: TaskIdString; // Format: `${TaskEnum[task.id]}-${task.option || 'none'}`
}

export const taskAtomFamily = atomFamily(
  ({ pokemonId, taskIdString }: TaskAtomParams) => {
    /**
     * Atom to get the definition of this specific task from Pokedex data.
     */
    const taskDefinitionAtom = atom<PokedexTask | undefined>(get => {
      const pokedex = get(pokedexDataAtom);
      const pokemonData = pokedex[pokemonId];
      if (!pokemonData) return undefined;
      // Need to parse taskIdString back to find the task, or pass taskDef directly
      // For simplicity, assuming taskIdString is unique and can be used to find task.
      // This requires a robust way to map taskIdString back to a PokedexTask.
      // A better approach might be to pass the task index or the PokedexTask object itself
      // if atomFamily parameters allow complex objects (they do with a custom key).
      // Here, we'll find it by iterating, which is less efficient but works for now.
      return pokemonData.tasks.find(t => globalGetTaskIdString(t) === taskIdString);
    });

    /**
     * Atom for the task's name based on the current dictionary.
     */
    const nameAtom = atom(get => {
      const dict = get(dictionaryAtom);
      const taskDef = get(taskDefinitionAtom);
      if (!taskDef) return 'Unknown Task';
      return dict.task(taskDef.id, taskDef.option as Move | MoveType | undefined);
    });

    /**
     * Atom representing the progress of this specific task across all segments.
     * Getter: Reads from allPokemonTasksProgressAtom.
     * Setter: Updates allPokemonTasksProgressAtom for this task.
     */
    const progressesAtom = atom(
      get => {
        const allProgress = get(allPokemonTasksProgressAtom);
        const pokemonProgress = allProgress.get(pokemonId);
        return pokemonProgress?.get(taskIdString) || ({} as TaskProgress);
      },
      (get, set, newProgresses: TaskProgress) => {
        const allProgress = get(allPokemonTasksProgressAtom);
        const newAllProgress = new Map(allProgress); // Clone the outer map

        const pokemonProgress = new Map(newAllProgress.get(pokemonId) || []); // Clone or create the pokemon's progress map
        pokemonProgress.set(taskIdString, newProgresses);
        newAllProgress.set(pokemonId, pokemonProgress);

        set(allPokemonTasksProgressAtom, newAllProgress);
      }
    );

    /**
     * Atom for the overall progress of the task (max progress across all segments).
     */
    const progressAtom = atom(get => {
      const taskProgresses = get(progressesAtom);
      if (Object.keys(taskProgresses).length === 0) return 0;
      return Math.max(0, ...Object.values(taskProgresses));
    });

    /**
     * Atom for the number of achieved requirement levels for this task.
     */
    const achievedCountAtom = atom(get => {
      const taskDef = get(taskDefinitionAtom);
      const currentProgress = get(progressAtom);
      if (!taskDef) return 0;
      return taskDef.requirements.filter(req => currentProgress >= req).length;
    });

    /**
     * Atom for the points awarded by this task based on its achieved count.
     */
    const pointsAtom = atom(get => {
      const taskDef = get(taskDefinitionAtom);
      const count = get(achievedCountAtom);
      if (!taskDef) return 0;
      return taskDef.reward * count;
    });

    /**
     * Atom to get the task's progress up to a specific segment.
     * This is a read-only derived atom that takes a segment as a parameter.
     * Note: Jotai atoms don't directly take parameters in the getter like this.
     * Instead, you'd typically use this logic within another atom or component
     * that has access to both this task's progressesAtom and the target segment.
     * For now, this function can be part of the returned object.
     */
    const getPointsUntilSegment = (segment: Segment, taskDef: PokedexTask, taskProgs: TaskProgress): number => {
        let progressUpToSegment = 0;
        for (const segKeyStr in taskProgs) {
            const segKey = parseInt(segKeyStr) as Segment;
            if (segKey <= segment) {
                progressUpToSegment = Math.max(progressUpToSegment, taskProgs[segKey]);
            }
        }
        const achievedCount = taskDef.requirements.filter(req => progressUpToSegment >= req).length;
        return taskDef.reward * achievedCount;
    };


    // --- Actions specific to this task ---
    /**
     * Action to update the progress of this task for a specific segment.
     * This replicates the logic from SignalizedTask.do()
     */
    const doTaskAtom = atom(null, (get, set, { progress, segment }: { progress: number; segment: Segment }) => {
      const taskDef = get(taskDefinitionAtom);
      if (!taskDef) return;

      const clampedProgress = Math.max(taskDef.requirements[0] ? 0 : -1, Math.min(progress, taskDef.requirements[taskDef.requirements.length - 1]));
      // Allow 0 for tasks that are not "caught" type for reset, but clamp to min requirement if > 0
      const finalProgress = clampedProgress < (taskDef.requirements[0] || 0) && clampedProgress !==0 ? 0 : clampedProgress;


      const currentProgresses = get(progressesAtom);
      const newProgresses: TaskProgress = { ...currentProgresses };

      if (finalProgress > 0) {
        newProgresses[segment] = finalProgress;
      } else {
        delete newProgresses[segment]; // Remove if progress is reset to 0
      }

      // Fix progresses before the current segment (from SignalizedTask)
      // Ensure segments are numerically compared
      Object.keys(SegmentEnum)
        .map(Number)
        .filter(s => typeof s === 'number' && s < segment)
        .forEach(segKey => {
          const before = newProgresses[segKey as Segment] ?? 0;
          if (before >= finalProgress && finalProgress > 0) { // Only delete if new progress isn't a reset
            delete newProgresses[segKey as Segment];
          } else if (finalProgress === 0 && before > 0) {
            // If resetting current segment, and a previous segment has progress,
            // this logic might need adjustment based on desired behavior.
            // Original logic: if _progress > 0, progresses[segment] = _progress else delete progresses[segment]
            // Then loop before segments: if (before >= _progress) delete progresses[seg]
            // If finalProgress is 0, this means we are "undoing" progress in this segment.
            // The original logic would delete prior segments if their progress was >= current progress *being set*.
            // If current progress is being set to 0, it implies prior segments should remain unless explicitly cleared.
            // The original logic seems to handle reset by deleting the entry for the segment.
          }
        });

      // If this is the "Caught" task and it's being marked as caught (progress > 0),
      // ensure no prior segment has a higher "Caught" progress if that's a game rule.
      // (The provided Angular code doesn't seem to have special logic for this beyond the general segment fixing)

      set(progressesAtom, newProgresses);

      // --- Complex: Update "Complete" task status for the Pokemon ---
      // This logic was in SignalizedPokemon.doTask, affecting its own "Complete" task.
      const pokemonData = get(pokemonAtomFamily({pokemonId}));
      const pokemonTaskDefs = get(pokemonData.tasksDefinitionsAtom);
      const completeTaskDef = pokemonTaskDefs.find(t => t.id === TaskEnum.Complete);

      if (completeTaskDef) {
          // Recalculate segmentCompleted for the parent Pokemon
          // This is a bit tricky as segmentCompleted depends on multiple task points.
          // For now, we trigger a read/re-evaluation of dependent atoms by updating the base progress.
          // A more direct way would be to have a specific atom for the "Complete" task's logic.
          // Let's simulate the logic here:
          const isArceus = pokemonId === PokemonEnum.Arceus;
          let calculatedSegmentCompleted: Segment | undefined = undefined;

          if (isArceus && get(pokemonData.caughtAtom)) {
              calculatedSegmentCompleted = SegmentEnum.Highlands3; // Max segment or specific Arceus completion segment
          } else {
              // Simplified: check if points for normal tasks up to a segment >= 100
              // This requires iterating through segments and summing points from *other* tasks.
              // This is a heavy operation to do here.
              // The original `this.pointsNormalTasksUntilSegment(segment)` needs to be replicated.
              // For now, we'll defer this complex update. The `completedAtom` in `pokemonAtoms`
              // should ideally react to changes in any of its dependent task points.
              // One way to ensure re-calc is to make `allPokemonTasksProgressAtom` a direct dependency
              // of `segmentCompletedAtom` if it isn't already implicitly.
          }

          // Update the "Complete" task for the Pokemon
          const completeTaskProgresses = get(allPokemonTasksProgressAtom).get(pokemonId)?.get(globalGetTaskIdString(completeTaskDef)) || {};
          const newCompleteTaskProgresses: TaskProgress = { ...completeTaskProgresses };

          const currentPokemonSegmentCompleted = get(pokemonData.segmentCompletedAtom); // Re-evaluate based on current state

          if (currentPokemonSegmentCompleted) {
              newCompleteTaskProgresses[currentPokemonSegmentCompleted] = completeTaskDef.requirements[0] || 1;
          } else {
              // If not completed, effectively reset the "Complete" task progress or set to 0 for all segments
              // This means iterating and deleting, or setting to a new empty map for this specific task.
              // For simplicity, if it's not completed, we ensure no segment has progress for the "Complete" task.
              // This might need refinement: should it clear all segments or just the one previously marked?
              // The original logic sets `completeTask.do(0, Segment.Highlands3)`
              // This implies setting progress to 0 for the max segment, or clearing all.
              // Let's clear all for now if not completed.
              const clearedProgresses: TaskProgress = {};
               set(allPokemonTasksProgressAtom, prev => {
                  const all = new Map(prev);
                  const pkmn = new Map(all.get(pokemonId)!);
                  pkmn.set(globalGetTaskIdString(completeTaskDef), clearedProgresses);
                  all.set(pokemonId, pkmn);
                  return all;
              });
          }
           if (currentPokemonSegmentCompleted) { // Only set if actually completed
              set(allPokemonTasksProgressAtom, prev => {
                  const all = new Map(prev);
                  const pkmn = new Map(all.get(pokemonId)!);
                  const existing = pkmn.get(globalGetTaskIdString(completeTaskDef)) || {};
                  const updated = {...existing, [currentPokemonSegmentCompleted]: completeTaskDef.requirements[0] || 1 }
                  pkmn.set(globalGetTaskIdString(completeTaskDef), updated);
                  all.set(pokemonId, pkmn);
                  return all;
              });
          }

      }

    });

    /**
     * Action to reset the progress of this task.
     */
    const resetTaskAtom = atom(null, (get, set) => {
      set(progressesAtom, {} as TaskProgress); // Set to empty object
       // Also need to handle the "Complete" task update if this reset affects overall completion
      const pokemonData = get(pokemonAtomFamily({pokemonId}));
      const pokemonTaskDefs = get(pokemonData.tasksDefinitionsAtom);
      const completeTaskDef = pokemonTaskDefs.find(t => t.id === TaskEnum.Complete);
      if (completeTaskDef) {
          const currentPokemonSegmentCompleted = get(pokemonData.segmentCompletedAtom); // Re-evaluate
          if (!currentPokemonSegmentCompleted) {
               set(allPokemonTasksProgressAtom, prev => {
                  const all = new Map(prev);
                  const pkmn = new Map(all.get(pokemonId)!);
                  pkmn.set(globalGetTaskIdString(completeTaskDef), {} as TaskProgress);
                  all.set(pokemonId, pkmn);
                  return all;
              });
          } else {
              // If still completed by other tasks, ensure complete task reflects that segment
               set(allPokemonTasksProgressAtom, prev => {
                  const all = new Map(prev);
                  const pkmn = new Map(all.get(pokemonId)!);
                  const existing = pkmn.get(globalGetTaskIdString(completeTaskDef)) || {};
                  const updated = {...existing, [currentPokemonSegmentCompleted]: completeTaskDef.requirements[0] || 1 }
                  pkmn.set(globalGetTaskIdString(completeTaskDef), updated);
                  all.set(pokemonId, pkmn);
                  return all;
              });
          }
      }
    });

    return atom({
      definitionAtom: taskDefinitionAtom,
      nameAtom,
      progressesAtom, // Writable atom for task's segment progresses
      progressAtom,   // Read-only derived overall progress
      achievedCountAtom,
      pointsAtom,
      doTaskAtom,     // Action to update progress
      resetTaskAtom,  // Action to reset progress
      // Expose the parameterized function if needed, though direct use in components is more common
      // getPointsUntilSegment: (segment: Segment) => getPointsUntilSegment(segment, get(taskDefinitionAtom)!, get(progressesAtom)),
    });
  },
  (a, b) => a.pokemonId === b.pokemonId && a.taskIdString === b.taskIdString
);

// Example usage:
// const someTaskAtom = taskAtomFamily({ pokemonId: PokemonEnum.Pikachu, taskIdString: "1-none" });
// const taskProgress = useAtomValue(get(someTaskAtom).progressesAtom);
// const [, doTheTask] = useAtom(get(someTaskAtom).doTaskAtom);
// doTheTask({ progress: 5, segment: SegmentEnum.Fieldlands1 });
