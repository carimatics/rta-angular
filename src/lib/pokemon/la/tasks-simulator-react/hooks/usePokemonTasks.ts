import { useAtomValue, useSetAtom, useAtom } from 'jotai';
import { pokemonAtomFamily } from '../atoms/pokemonAtoms';
import { taskAtomFamily } from '../atoms/taskAtoms';
import { allPokemonTasksProgressAtom, currentSegmentAtom, getTaskIdString } from '../atoms/simulatorAtoms';
import { Pokemon, Segment, TaskIdString, PokedexTask, TaskProgress, AllPokemonTasksProgress, PokemonEnum, TaskEnum } from '../taskTypes';

export const usePokemonTasks = (pokemonId: Pokemon | null) => {
  // If no pokemonId is provided, operations are no-ops or disabled.
  // Components should handle the null case for UI.

  const pokemonDetails = useAtomValue(pokemonId !== null ? pokemonAtomFamily({ pokemonId }) : atom(null));
  const setAllProgress = useSetAtom(allPokemonTasksProgressAtom);
  const currentSegment = useAtomValue(currentSegmentAtom);

  const doTask = (taskId: TaskIdString, progress: number, segment: Segment) => {
    if (!pokemonId || !pokemonDetails) return;

    // Get the specific task's doTaskAtom action
    // Note: taskAtomFamily itself returns an atom containing other atoms (like doTaskAtom).
    // We need to use useSetAtom on the specific action atom.
    const taskSpecificAtoms = taskAtomFamily({ pokemonId, taskIdString: taskId });
    const executeTaskAction = useSetAtom(useAtomValue(taskSpecificAtoms).doTaskAtom);

    executeTaskAction({ progress, segment });
  };

  const resetTask = (taskId: TaskIdString) => {
    if (!pokemonId || !pokemonDetails) return;

    const taskSpecificAtoms = taskAtomFamily({ pokemonId, taskIdString: taskId });
    const executeResetAction = useSetAtom(useAtomValue(taskSpecificAtoms).resetTaskAtom);

    executeResetAction();
  };

  const resetPokemonTasks = () => {
    if (!pokemonId || !pokemonDetails) return;

    // Get all task definitions for this Pokemon
    const taskDefs = useAtomValue(pokemonDetails.tasksDefinitionsAtom);

    setAllProgress(prevAllProgress => {
      const newAllProgress = new Map(prevAllProgress);
      const newPokemonProgress = new Map<TaskIdString, TaskProgress>(); // Empty map for this Pokemon

      // Ensure "Complete" task is also reset or correctly handled
      // If there's a specific "Complete" task, its progress should be cleared.
      // The logic within taskAtomFamily's reset and doTask should eventually update the
      // "Complete" task status based on other tasks, but direct reset here is safer.
      for (const taskDef of taskDefs) {
        newPokemonProgress.set(getTaskIdString(taskDef), {} as TaskProgress);
      }

      newAllProgress.set(pokemonId, newPokemonProgress);
      return newAllProgress;
    });

    // Additionally, explicitly ensure the "Complete" task for this Pokemon is handled.
    // This might involve re-triggering calculations or directly setting its progress if needed,
    // especially if its completion depends on specific conditions beyond just points.
    // For instance, if resetting all tasks means the pokemon is no longer "segmentCompleted".
    // The derived atoms in pokemonAtomFamily should ideally handle this recalculation automatically
    // when allPokemonTasksProgressAtom changes.
  };

  return {
    doTask,
    resetTask,
    resetPokemonTasks,
    // currentSegment can be returned if actions need it and it's not passed directly
    // currentSegment,
    // pokemonDetails can also be returned if the calling component needs direct access to it
    // This hook primarily focuses on actions.
  };
};
