import { Component, computed, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createSignalizedPokedex } from '../../../../lib/pokemon/la/tasks-simulator/pokemon-la-tasks-simulator.service';
import { PrimaryContainerComponent } from './primary-container.component';
// PokemonListComponent is now used within PokemonTasksLeftSidebarComponent
import { HeaderComponent } from '../header.component';
import { SegmentSelectComponent } from './segment-select.component';
import { TargetPointsInputComponent } from './target-points-input.component';
import { PokemonInfoComponent } from './pokemon-info.component';
import { ButtonComponent } from '../../../../lib/components/button.component';
import { TaskTableComponent } from './task-table.component';
import { PokemonTasksLeftSidebarComponent } from './pokemon-tasks-left-sidebar.component';
import { PokemonTasksRightSidebarComponent } from './pokemon-tasks-right-sidebar.component';
import { CommonModule } from '@angular/common'; // For @for in right sidebar, though it should be standalone

@Component({
  selector: 'app-pokemon-la-tasks-simulator',
  imports: [
    FormsModule,
    PrimaryContainerComponent,
    // PokemonListComponent, // Removed as it's now in LeftSidebar
    HeaderComponent,
    SegmentSelectComponent,
    TargetPointsInputComponent,
    PokemonInfoComponent,
    ButtonComponent,
    TaskTableComponent,
    TargetPointsInputComponent,
    PokemonTasksLeftSidebarComponent,
    PokemonTasksRightSidebarComponent,
    CommonModule, // Added for safety, though sidebars are standalone
  ],
  template: `
    <div data-theme="pokemon-la" class="flex flex-col bg-surface-container">
      <app-header class="fixed top-0" />
      <div class="flex">
        <app-pokemon-tasks-left-sidebar
          [pokedex]="service.pokedex()"
          (pokemonClicked)="service.currentPokemonId.set($event.id)"
        />
        <main class="mx-2 flex flex-1 flex-col">
          <section class="mx-2 mb-4 flex items-center gap-4">
            <app-primary-container
              class="flex max-h-16 items-center gap-2">
              <app-segment-select
                [currentSegment]="service.currentSegment"
                [segments]="service.segments()"
              />
            </app-primary-container>
            <app-primary-container
              class="max-h-16">
              <app-target-points-input
                [targetPoints]="targetPoints"
              />
            </app-primary-container>
          </section>
          <section class="mx-2 mb-4">
            <app-primary-container class="flex flex-col">
              <div class="m-2 flex w-full">
                <app-pokemon-info [pokemon]="service.currentPokemon()" />
                <button
                  libButton
                  color="error"
                  class="mr-8 size-10 flex items-center justify-center"
                  (click)="service.currentPokemon().resetTasks()"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#ffff"
                  >
                    <path
                      d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
                  </svg>
                </button>
              </div>
              <div class="m-2 flex-1 overflow-x-scroll">
                <app-task-table
                  [pokemon]="service.currentPokemon()"
                  (updateProgress)="updateProgress($event.taskNo, $event.progress)"
                />
              </div>
            </app-primary-container>
          </section>
        </main>
        <app-pokemon-tasks-right-sidebar
          [timelineSegments]="timelineSegmentsWithPoints()"
          [totalPoints]="service.points()"
        />
      </div>
    </div>
  `,
})
export class PokemonLATasksSimulatorComponent {
  targetPoints = model(8500);

  service = createSignalizedPokedex();

  // timelineSegments = computed(() =>
  //   this.service.segments()
  //     .filter((segment) => Object.hasOwn(this.service.pointsBySegment(), segment.id))
  // );

  // Transform data for the right sidebar
  timelineSegmentsWithPoints = computed(() => {
    const pointsBySegment = this.service.pointsBySegment();
    return this.service.segments()
      .filter(segment => Object.hasOwn(pointsBySegment, segment.id))
      .map(segment => ({
        id: segment.id,
        name: segment.name,
        points: pointsBySegment[segment.id]
      }));
  });

  updateProgress(taskNo: number, progress: number) {
    this.service.doCurrentPokemonTask(taskNo, progress);
  }

  // Helper to handle pokemon click, though direct binding in template is also fine
  onPokemonClickedInSimulator(pokemon: { id: number }) {
    this.service.currentPokemonId.set(pokemon.id);
  }
}

export default PokemonLATasksSimulatorComponent;
