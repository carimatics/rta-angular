import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonComponent } from '../../../../lib/components/button.component';
import { PokemonLaTasksSimulatorService } from '../../../../lib/pokemon/la/tasks-simulator';
import { HeaderComponent } from '../header.component';
import { PokemonInfoComponent } from './pokemon-info.component';
import { PokemonListComponent } from './pokemon-list.component';
import { PrimaryContainerComponent } from './primary-container.component';
import { SegmentSelectComponent } from './segment-select.component';
import { TargetPointsInputComponent } from './target-points-input.component';
import { TaskTableComponent } from './task-table.component';

@Component({
  selector: 'app-pokemon-la-tasks-simulator',
  imports: [
    FormsModule,
    PrimaryContainerComponent,
    PokemonListComponent,
    HeaderComponent,
    SegmentSelectComponent,
    TargetPointsInputComponent,
    PokemonInfoComponent,
    ButtonComponent,
    TaskTableComponent,
    TargetPointsInputComponent,
  ],
  template: `
    <div data-theme="pokemon-la" class="flex flex-col h-screen overflow-hidden bg-surface-container">
      <app-header class="flex-none top-0" />
      <div class="flex">
        <aside class="flex w-80 flex-col">
          <app-pokemon-list [pokedex]="service.pokedex()" (clickPokemon)="service.currentPokemonId.set($event.id)" />
        </aside>
        <main class="mx-2 flex flex-1 flex-col">
          <section class="mx-2 mb-4 flex items-center gap-4">
            <app-primary-container class="flex max-h-16 items-center gap-2">
              <app-segment-select [currentSegment]="service.currentSegment" [segments]="service.segments()" />
            </app-primary-container>
            <app-primary-container class="max-h-16">
              <app-target-points-input [(targetPoints)]="targetPoints" />
            </app-primary-container>
          </section>
          <section class="mx-2 mb-4">
            <app-primary-container class="flex flex-col">
              <div class="m-2 flex w-full">
                <app-pokemon-info [pokemon]="service.currentPokemon()" />
                <button
                  lib-button
                  color="error"
                  class="mr-8 size-10 flex items-center justify-center"
                  (click)="service.currentPokemon().resetTasks()">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffff">
                    <path
                      d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
                  </svg>
                </button>
              </div>
              <div class="m-2 flex-1 overflow-x-scroll">
                <app-task-table [pokemon]="service.currentPokemon()" (updateProgress)="updateProgress($event.taskNo, $event.progress)" />
              </div>
            </app-primary-container>
          </section>
        </main>
        <aside class="flex w-60 flex-col">
          <div class="mt-12 overflow-y-scroll">
            <ul class="w-60 p-1">
              @for (segment of timelineSegments(); track segment.id) {
                <li class="pb-2">
                  <div class="flex items-center gap-2 font-bold">
                    <div class="bg-surface-container text-on-surface-container w-32 rounded-md p-1 text-center">
                      {{ segment.name }}
                    </div>
                    <div>
                      {{ service.pointsBySegment()[segment.id].total }}
                      (+{{ service.pointsBySegment()[segment.id].increased }})
                    </div>
                  </div>
                </li>
              }
              <li>
                <div class="flex gap-4">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#75FB4C">
                      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                    </svg>
                  </div>
                  <div class="font-bold">{{ service.points() }}</div>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  `,
})
export class PokemonLATasksSimulatorComponent {
  targetPoints = signal(8500);

  service = inject(PokemonLaTasksSimulatorService);

  timelineSegments = computed(() => this.service.segments().filter((segment) => Object.hasOwn(this.service.pointsBySegment(), segment.id)));

  updateProgress(taskNo: number, progress: number) {
    this.service.doCurrentPokemonTask(taskNo, progress);
  }
}

export default PokemonLATasksSimulatorComponent;
