// Main component
export { TasksSimulator, default as DefaultTasksSimulator } from './components/TasksSimulator';

// Individual components (if they need to be used separately)
export * from './components/TaskCard';
export * from './components/PokemonDetail';
export * from './components/TasksBoard';
export * from './components/SimulatorControls';

// Hooks (for advanced usage or custom UI)
export * from './hooks/usePokemonTasks';
export * from './hooks/useSimulatorLogic';

// Atoms (for very advanced usage, direct manipulation, or custom derivations)
// Generally, it's better to interact via hooks or higher-level components.
// Exporting atoms can be powerful but also makes refactoring harder if atoms change.
export * from './atoms/simulatorAtoms';
export * from './atoms/pokemonAtoms';
export * from './atoms/taskAtoms';

// Types
// Export all enums and types from taskTypes.ts
export * from './taskTypes';
// Export Pokedex data if it's intended to be directly accessible
export { pokedex } from './pokedex';

// It's good practice to also export specific key types if not covered by '*'
// For example:
// export type { Pokemon, Segment, Task, Language, PokedexData, PokedexTask } from './taskTypes';
// However, `export * from './taskTypes'` should cover these.
