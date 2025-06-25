import React from 'react';
import { useAtomValue } from 'jotai';
import { taskAtomFamily } from '../atoms/taskAtoms';
import { usePokemonTasks } from '../hooks/usePokemonTasks';
import { Pokemon, Segment, TaskIdString, PokedexTask } from '../taskTypes';
import { currentSegmentAtom } from '../atoms/simulatorAtoms';

interface TaskCardProps {
  pokemonId: Pokemon;
  taskIdString: TaskIdString;
  // We could pass the taskDefinition directly to avoid re-fetching in taskAtomFamily,
  // but for now, taskAtomFamily handles fetching its own definition.
  // taskDefinition: PokedexTask;
}

export const TaskCard: React.FC<TaskCardProps> = ({ pokemonId, taskIdString }) => {
  const taskAtoms = useAtomValue(taskAtomFamily({ pokemonId, taskIdString }));

  // Correctly access atoms within the object returned by taskAtomFamily
  const name = useAtomValue(taskAtoms.nameAtom);
  const taskDefinition = useAtomValue(taskAtoms.definitionAtom);
  const progress = useAtomValue(taskAtoms.progressAtom);
  const achievedCount = useAtomValue(taskAtoms.achievedCountAtom);
  const points = useAtomValue(taskAtoms.pointsAtom);
  // progressesAtom is writable, so if we need to set it directly (not typical for this component)
  // we'd use useAtom(taskAtoms.progressesAtom)
  const progresses = useAtomValue(taskAtoms.progressesAtom);


  const { doTask, resetTask } = usePokemonTasks(pokemonId);
  const currentSegment = useAtomValue(currentSegmentAtom);

  if (!taskDefinition) {
    return <div>Loading task data...</div>;
  }

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(event.target.value, 10);
    if (!isNaN(newProgress)) {
      doTask(taskIdString, newProgress, currentSegment);
    }
  };

  const handleIncrement = (increment: number) => {
    const currentMaxProgressInSegment = progresses[currentSegment] ?? 0;
    const requirementIndex = taskDefinition.requirements.findIndex(r => r > currentMaxProgressInSegment);

    let targetProgress;
    if (increment > 0) {
        if (requirementIndex !== -1) { // Found a next requirement
            targetProgress = taskDefinition.requirements[requirementIndex];
        } else { // Already at or past the last requirement, or no requirements
            targetProgress = currentMaxProgressInSegment + increment; // Or simply cap at max
            if (taskDefinition.requirements.length > 0) {
                 targetProgress = Math.min(targetProgress, taskDefinition.requirements[taskDefinition.requirements.length -1]);
            } else {
                 targetProgress = Math.min(targetProgress, 1); // Default max for simple tasks
            }
        }
    } else { // Decrementing
        // Find the requirement just below the current progress in this segment
        const reversedRequirements = [...taskDefinition.requirements].reverse();
        const prevRequirementIndex = reversedRequirements.findIndex(r => r <= currentMaxProgressInSegment);

        if (currentMaxProgressInSegment === 0) targetProgress = 0;
        else if (prevRequirementIndex !== -1) {
            // Target the one before the current one, or 0 if at the first requirement
            const currentReqLevelIndex = taskDefinition.requirements.indexOf(reversedRequirements[prevRequirementIndex]);
             if (currentReqLevelIndex > 0 && reversedRequirements[prevRequirementIndex] === currentMaxProgressInSegment) {
                targetProgress = taskDefinition.requirements[currentReqLevelIndex-1];
             } else if (currentReqLevelIndex === 0 && reversedRequirements[prevRequirementIndex] === currentMaxProgressInSegment) {
                targetProgress = 0;
             }
             else { // currently between requirement levels
                 targetProgress = reversedRequirements[prevRequirementIndex];
             }
        } else { // No requirement is less than or equal, so target 0
            targetProgress = 0;
        }
    }
    // Clamp progress to min/max defined by requirements
    const minPossibleProgress = 0;
    const maxPossibleProgress = taskDefinition.requirements.length > 0 ? taskDefinition.requirements[taskDefinition.requirements.length - 1] : 1; // Default max for simple tasks

    targetProgress = Math.max(minPossibleProgress, Math.min(targetProgress, maxPossibleProgress));

    doTask(taskIdString, targetProgress, currentSegment);
  };

  const handleReset = () => {
    resetTask(taskIdString);
  };

  const maxSliderProgress = taskDefinition.requirements.length > 0
                            ? taskDefinition.requirements[taskDefinition.requirements.length - 1]
                            : 1; // Default for tasks like "Caught" which might have [1]

  return (
    <div style={{ border: '1px solid #ccc', margin: '8px', padding: '8px' }}>
      <h4>{name}</h4>
      <p>ID: {taskIdString}</p>
      <p>Description: Reward: {taskDefinition.reward}, Requirements: {taskDefinition.requirements.join(', ')}</p>
      <p>Current Progress (in selected segment {currentSegment}): {progresses[currentSegment] ?? 0} / {maxSliderProgress}</p>
      <p>Overall Max Progress: {progress}</p>
      <p>Achieved Levels: {achievedCount} / {taskDefinition.requirements.length}</p>
      <p>Points: {points}</p>

      <div>
        <label htmlFor={`progress-${taskIdString}`}>Set Progress in Segment {currentSegment}: </label>
        <input
          type="number"
          id={`progress-${taskIdString}`}
          value={progresses[currentSegment] ?? 0}
          onChange={handleProgressChange}
          min="0"
          max={maxSliderProgress} // Max based on task requirements
        />
      </div>
      <div>
        <button onClick={() => handleIncrement(1)} disabled={progress >= maxSliderProgress && taskDefinition.requirements.length > 0}>Increment Step</button>
        <button onClick={() => handleIncrement(-1)} disabled={progress === 0 && (progresses[currentSegment]??0) === 0}>Decrement Step</button>
        <button onClick={handleReset}>Reset Task</button>
      </div>
      <div style={{marginTop: '5px'}}>
        <label>Quick Set by Requirement Level (for current segment):</label>
        <br/>
        <button onClick={() => doTask(taskIdString, 0, currentSegment)}>0</button>
        {taskDefinition.requirements.map((reqLvl, index) => (
          <button key={index} onClick={() => doTask(taskIdString, reqLvl, currentSegment)}>
            {reqLvl}
          </button>
        ))}
      </div>
    </div>
  );
};
