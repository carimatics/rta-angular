import React, { useEffect } from 'react';
import { Provider, useSetAtom } from 'jotai';
import { TasksBoard } from './TasksBoard';
import { SimulatorControls } from './SimulatorControls';
import { pokedexDataAtom, currentPokemonIdAtom, pokemonListAtom } from '../atoms/simulatorAtoms';
// Import the actual pokedex data if direct initialization is needed,
// but it's better if pokedexDataAtom handles its own initialization or is set by a root component.
// For this example, we'll assume pokedexDataAtom is already initialized by its definition.
// import { pokedex } from '../pokedex'; // Data source
import { PokemonEnum } from '../taskTypes';


// Main application component
const AppContent: React.FC = () => {
  const setPokedexData = useSetAtom(pokedexDataAtom);
  const setCurrentPokemonId = useSetAtom(currentPokemonIdAtom);
  const pokemonList = useSetAtom(pokemonListAtom); // To ensure it's computed if needed early

  useEffect(() => {
    // In a real app, pokedex data might be fetched here and then set.
    // Since pokedexDataAtom is now directly initialized with imported 'pokedex',
    // this explicit setData might not be strictly necessary unless the data needs to be loaded async.
    // setPokedexData(pokedex); // If pokedexDataAtom was initialized as empty/null

    // Set initial Pokemon (e.g., the first one in the list or a default)
    // pokemonListAtom will derive from pokedexDataAtom.
    // We should ensure pokemonListAtom is evaluated before trying to get the first Pokemon.
    // A common pattern is to have a derived atom for the "initial/default Pokemon ID".

    // For simplicity, setting a default Pokemon ID directly.
    // Make sure PokemonEnum.Rowlet (or any default) exists in your pokedex data.
    // A safer approach would be to take the first from the derived pokemonListAtom,
    // but that requires careful handling of atom initialization order or async loading.
    setCurrentPokemonId(PokemonEnum.Rowlet);

  }, [setPokedexData, setCurrentPokemonId, pokemonList]);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <header>
        <h1>Pokemon Legends: Arceus - Research Tasks Simulator (React + Jotai)</h1>
      </header>
      <main>
        <SimulatorControls />
        <TasksBoard />
      </main>
      <footer style={{marginTop: '30px', fontSize: '0.8em', color: '#777'}}>
        <p>Migrated from Angular Signals version.</p>
      </footer>
    </div>
  );
};

// Wrapper component that includes the Jotai Provider
export const TasksSimulator: React.FC = () => {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
};

// Default export for easy integration, e.g. in storybook or a host app
export default TasksSimulator;
