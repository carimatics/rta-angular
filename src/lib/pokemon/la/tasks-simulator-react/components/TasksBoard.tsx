import React from 'react';
import { useAtomValue } from 'jotai';
import { currentPokemonIdAtom } from '../atoms/simulatorAtoms';
import { PokemonDetail } from './PokemonDetail';

export const TasksBoard: React.FC = () => {
  const currentPokemonId = useAtomValue(currentPokemonIdAtom);

  return (
    <div style={{ padding: '10px', border: '1px dashed blue' }}>
      <h3>Task Board</h3>
      {currentPokemonId !== null ? (
        <PokemonDetail pokemonId={currentPokemonId} />
      ) : (
        <p>No Pokemon selected. Please select a Pokemon from the controls.</p>
      )}
    </div>
  );
};
