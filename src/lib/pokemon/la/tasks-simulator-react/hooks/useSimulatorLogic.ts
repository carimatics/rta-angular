import { useAtom, useSetAtom } from 'jotai';
import {
  languageAtom,
  currentPokemonIdAtom,
  currentSegmentAtom,
  allPokemonTasksProgressAtom,
  // Import other necessary atoms or types
} from '../atoms/simulatorAtoms';
import { Language, Pokemon, Segment, PokemonEnum, SegmentEnum, AllPokemonTasksProgress } from '../taskTypes';

export const useSimulatorLogic = () => {
  const [language, setLanguage] = useAtom(languageAtom);
  const [currentPokemonId, setCurrentPokemonId] = useAtom(currentPokemonIdAtom);
  const [currentSegment, setCurrentSegment] = useAtom(currentSegmentAtom);
  const setAllPokemonTasksProgress = useSetAtom(allPokemonTasksProgressAtom);

  const resetAllTasks = () => {
    // Reset all task progress to an empty map
    setAllPokemonTasksProgress(new Map() as AllPokemonTasksProgress);
    // Optionally, reset current Pokemon and segment to defaults
    // setCurrentPokemonId(PokemonEnum.Rowlet); // Or null, or first from a list
    // setCurrentSegment(SegmentEnum.Village1);
  };

  const selectPokemon = (pokemonId: Pokemon | null) => {
    setCurrentPokemonId(pokemonId);
  };

  const selectSegment = (segment: Segment) => {
    setCurrentSegment(segment);
  };

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return {
    // State values (if components need to read them directly via the hook)
    language,
    currentPokemonId,
    currentSegment,

    // Setter functions / actions
    resetAllTasks,
    selectPokemon,
    selectSegment,
    changeLanguage,
    setLanguage, // Expose direct setters if needed
    setCurrentPokemonId,
    setCurrentSegment,
  };
};
