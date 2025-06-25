import React from 'react';
import { useAtomValue } from 'jotai';
import { pokemonAtomFamily } from '../atoms/pokemonAtoms';
import { Pokemon, PokemonEnum } from '../taskTypes';
import { TaskCard } from './TaskCard';
import { usePokemonTasks } from '../hooks/usePokemonTasks';
import { getTaskIdString } from '../atoms/simulatorAtoms'; // Assuming TaskIdString generation is needed

interface PokemonDetailProps {
  pokemonId: Pokemon | null;
}

export const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemonId }) => {
  // Handle the case where pokemonId might be null (e.g., no Pokemon selected)
  const pokemonDataAtom = pokemonId !== null ? pokemonAtomFamily({ pokemonId }) : null;
  const pokemonDetails = useAtomValue(pokemonDataAtom ? pokemonAtomFamily({pokemonId}) : atom(null));


  const { resetPokemonTasks } = usePokemonTasks(pokemonId);

  if (pokemonId === null || !pokemonDetails) {
    return <div>Select a Pokemon to see details.</div>;
  }

  // Access derived atoms from pokemonDetails
  const name = useAtomValue(pokemonDetails.nameAtom);
  const tasks = useAtomValue(pokemonDetails.tasksDefinitionsAtom); // Raw task definitions
  const caught = useAtomValue(pokemonDetails.caughtAtom);
  const totalPoints = useAtomValue(pokemonDetails.pointsAtom);
  const isCompleted = useAtomValue(pokemonDetails.completedAtom);
  const segmentCompleted = useAtomValue(pokemonDetails.segmentCompletedAtom);
  const pointsBySegment = useAtomValue(pokemonDetails.pointsBySegmentAtom);


  return (
    <div style={{ border: '2px solid green', padding: '10px', margin: '10px' }}>
      <h3>{name} (ID: {pokemonId})</h3>
      <p>Caught: {caught ? 'Yes' : 'No'}</p>
      <p>Total Points: {totalPoints}</p>
      <p>Research Completed: {isCompleted ? `Yes (at Segment ${segmentCompleted})` : 'No'}</p>

      <h4>Points by Segment:</h4>
      <ul>
        {Object.entries(pointsBySegment).map(([segment, data]) => (
          <li key={segment}>
            Segment {segment}: Increased {data.increased}, Total {data.total}
          </li>
        ))}
      </ul>

      <button onClick={resetPokemonTasks} style={{ marginBottom: '10px' }}>
        Reset All Tasks for {name}
      </button>

      <h4>Tasks:</h4>
      {tasks.length > 0 ? (
        tasks.map((taskDef, index) => (
          <TaskCard
            key={`${pokemonId}-${getTaskIdString(taskDef)}`}
            pokemonId={pokemonId}
            taskIdString={getTaskIdString(taskDef)}
            // taskDefinition={taskDef} // Optionally pass taskDef if TaskCard is refactored
          />
        ))
      ) : (
        <p>No tasks defined for this Pokemon.</p>
      )}
    </div>
  );
};
