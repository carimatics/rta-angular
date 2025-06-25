# RTA

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

## Pokemon Legends: Arceus - Research Tasks Simulator (React + Jotai Version)

This project also includes a React and Jotai based simulator for tracking research tasks in Pokemon Legends: Arceus, located in `src/lib/pokemon/la/tasks-simulator-react/`. This version was created as an alternative implementation to the original Angular-based one.

The primary goal of this React version is to provide a clear and maintainable way to manage and calculate research task progress and points, leveraging the capabilities of React for UI and Jotai for state management.

### Features (React Version)

*   View and track progress for each Pokemon's research tasks.
*   Calculate research points per task, per Pokemon, and overall.
*   View points accumulated by segment.
*   Select current Pokemon and segment to focus on specific tasks.
*   Switch display language (English/Japanese - basic dictionary provided).
*   Reset progress for individual tasks, all tasks for a Pokemon, or the entire simulator.

### Project Structure (React Version)

The core simulator logic and components are located in `src/lib/pokemon/la/tasks-simulator-react/`.

*   **`atoms/`**: Contains Jotai atoms for state management.
    *   `simulatorAtoms.ts`: Global state like current selections, overall progress, dictionary.
    *   `pokemonAtoms.ts`: `atomFamily` for Pokemon-specific derived states (name, points, completion).
    *   `taskAtoms.ts`: `atomFamily` for individual task states and actions.
*   **`components/`**: React components for the UI.
    *   `TasksSimulator.tsx`: The main application component, including Jotai Provider.
    *   `SimulatorControls.tsx`: UI for global controls (Pokemon/segment/language selection, reset).
    *   `TasksBoard.tsx`: Displays the tasks for the currently selected Pokemon.
    *   `PokemonDetail.tsx`: Shows details and tasks for a single Pokemon.
    *   `TaskCard.tsx`: UI for an individual research task.
*   **`hooks/`**: Custom React hooks to encapsulate complex logic.
    *   `useSimulatorLogic.ts`: For global simulator actions.
    *   `usePokemonTasks.ts`: For actions related to a specific Pokemon's tasks.
*   **`taskTypes.ts`**: TypeScript type definitions for the simulator.
*   **`pokedex.ts`**: Contains the static data for Pokemon and their research tasks (based on the original game data).
*   **`index.ts`**: Entry point for the library, exporting key components, hooks, and types.

### Getting Started (React Version)

This part of the project is set up as a self-contained library. To use or test it independently (e.g., with Storybook or a minimal React host):

1.  **Dependencies**: Ensure you have React and Jotai installed in your development environment if you are trying to run this part separately.
    ```bash
    npm install react react-dom jotai
    # or
    yarn add react react-dom jotai
    ```

2.  **Usage Example**:
    Import the main `TasksSimulator` component and render it:

    ```tsx
    // Example in a new main.tsx or App.tsx for the React part
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    // Adjust the path depending on how you integrate it:
    import TasksSimulator from './lib/pokemon/la/tasks-simulator-react';

    const rootElement = document.getElementById('react-root'); // Ensure this element exists in your HTML
    if (rootElement) {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <TasksSimulator />
        </React.StrictMode>
      );
    }
    ```
    Note: This React part is not currently integrated into the main Angular application's build or serving process. It would need a separate setup to be viewed in a browser (e.g., using Vite, Create React App, or Storybook).

### Development & Testing (React Version)

*   **Data**: Pokemon task data is in `src/lib/pokemon/la/tasks-simulator-react/pokedex.ts`. Dictionary data for i18n is currently within `src/lib/pokemon/la/tasks-simulator-react/atoms/simulatorAtoms.ts`.
*   **Testing**: Basic unit and component tests are written using Jest and React Testing Library. Configuration for running these tests (e.g., `jest.config.js`, `package.json` scripts) would need to be set up for the React part of the codebase. Example test files:
    *   `src/lib/pokemon/la/tasks-simulator-react/atoms/simulatorAtoms.test.ts`
    *   `src/lib/pokemon/la/tasks-simulator-react/hooks/usePokemonTasks.test.ts`
    *   `src/lib/pokemon/la/tasks-simulator-react/components/TaskCard.test.tsx`

### Notes on Migration from Angular Signals (for the React version)

*   **State Management**: Angular Signals (`signal`, `computed`, `effect`) are replaced by Jotai atoms (`atom`, `atomFamily`).
*   **Component Structure**: Angular components (`.ts` + `.html`) are converted to React functional components (`.tsx` with JSX).
*   **Data Flow**: Unidirectional data flow is maintained, with Jotai managing state updates and React re-rendering components as needed.
