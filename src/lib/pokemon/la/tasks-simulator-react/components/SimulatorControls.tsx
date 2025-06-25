import React from 'react';
import { useAtomValue, useAtom } from 'jotai';
import {
  pokemonListAtom,
  segmentsAtom,
  currentPokemonIdAtom,
  currentSegmentAtom,
  languageAtom,
  totalPointsAtom,
  totalPointsBySegmentAtom,
} from '../atoms/simulatorAtoms';
import { useSimulatorLogic } from '../hooks/useSimulatorLogic';
import { LanguageEnum, Pokemon, Segment } from '../taskTypes';

export const SimulatorControls: React.FC = () => {
  const pokemonList = useAtomValue(pokemonListAtom);
  const segments = useAtomValue(segmentsAtom);

  const [currentPokemonId, setCurrentPokemonId] = useAtom(currentPokemonIdAtom);
  const [currentSegment, setCurrentSegment] = useAtom(currentSegmentAtom);
  const [language, setLanguage] = useAtom(languageAtom);

  const { resetAllTasks } = useSimulatorLogic();
  const totalOverallPoints = useAtomValue(totalPointsAtom);
  const totalPointsBySegment = useAtomValue(totalPointsBySegmentAtom);

  const handlePokemonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const pokemonId = parseInt(event.target.value, 10) as Pokemon | typeof NaN_Value;
    if (!isNaN(pokemonId)) {
        setCurrentPokemonId(pokemonId as Pokemon);
    } else {
        setCurrentPokemonId(null); // Handle "None" or invalid selection
    }
  };
  const NaN_Value = "NaN"; // Helper for select option

  const handleSegmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const segmentId = parseInt(event.target.value, 10) as Segment;
    setCurrentSegment(segmentId);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const langId = parseInt(event.target.value, 10) as Language;
    setLanguage(langId);
  };

  return (
    <div style={{ padding: '10px', border: '1px solid #eee', marginBottom: '20px' }}>
      <h4>Simulator Controls</h4>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center'}}>
        <div>
          <label htmlFor="pokemon-select">Select Pokemon: </label>
          <select
            id="pokemon-select"
            value={currentPokemonId ?? NaN_Value}
            onChange={handlePokemonChange}
          >
            <option value={NaN_Value}>-- Select Pokemon --</option>
            {pokemonList.map(pokemon => (
              <option key={pokemon.id} value={pokemon.id}>
                {pokemon.name} (ID: {pokemon.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="segment-select">Select Segment: </label>
          <select
            id="segment-select"
            value={currentSegment}
            onChange={handleSegmentChange}
          >
            {segments.map(segment => (
              <option key={segment.id} value={segment.id}>
                {segment.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="language-select">Select Language: </label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value={LanguageEnum.En}>English</option>
            <option value={LanguageEnum.Ja}>日本語 (Japanese)</option>
          </select>
        </div>
         <button onClick={resetAllTasks} style={{ marginLeft: 'auto' }}>Reset All Simulator Data</button>
      </div>

      <div style={{marginTop: '15px', borderTop: '1px solid #ddd', paddingTop: '15px'}}>
        <h4>Overall Summary</h4>
        <p><strong>Total Overall Points: {totalOverallPoints}</strong></p>
        <h5>Total Points by Segment (Cumulative):</h5>
        {Object.keys(totalPointsBySegment).length > 0 ? (
          <ul style={{listStyleType: 'none', paddingLeft: 0, columns: 2}}>
            {Object.entries(totalPointsBySegment).map(([segmentId, data]) => (
              <li key={segmentId}>
                <strong>{segments.find(s => s.id === parseInt(segmentId))?.name || `Segment ${segmentId}`}</strong>:
                Increased: {data.increased}, Total: {data.total}
              </li>
            ))}
          </ul>
        ) : (
          <p>No points recorded yet.</p>
        )}
      </div>
    </div>
  );
};
