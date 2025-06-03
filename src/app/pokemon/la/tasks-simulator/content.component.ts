import { Component, computed, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createSignalizedPokedex } from '../../../../lib/pokemon/la/tasks-simulator/pokemon-la-tasks-simulator.service';
import { NgOptimizedImage } from '@angular/common';
import { PrimaryContainerComponent } from './primary-container.component';
import { PokemonListComponent } from './pokemon-list.component';
import { HeaderComponent } from '../header.component';

@Component({
  selector: 'app-pokemon-la-tasks-simulator',
  imports: [
    FormsModule,
    NgOptimizedImage,
    PrimaryContainerComponent,
    PokemonListComponent,
    HeaderComponent,
  ],
  template: `
    <div data-theme="pokemon-la" class="flex flex-col bg-surface-container">
      <app-header class="fixed top-0" />
      <div class="mt-14">
        <div class="flex">
          <aside class="flex h-[calc(100vh-60px)] w-80 flex-col">
            <app-pokemon-list
              [pokedex]="service.pokedex()"
              (clickPokemon)="service.currentPokemonId.set($event.id)"
            />
          </aside>
          <main class="mx-2 flex flex-1 flex-col">
            <section class="mx-2 mb-4 flex items-center gap-4">
              <app-primary-container
                class="flex max-h-16 items-center gap-2">
                <div class="font-bold">現在区間</div>
                <select
                  class="border-outlet rounded-md border-1 px-1 py-2 shadow-md"
                  [(ngModel)]="service.currentSegment"
                >
                  @for (segment of service.segments(); track segment.id) {
                    <option [value]="segment.id">{{ segment.name }}</option>
                  }
                </select>
              </app-primary-container>
              <app-primary-container
                class="flex max-h-16 items-center gap-2">
                <div class="font-bold">目標点数</div>
                <input
                  type="number"
                  placeholder="Target Points"
                  [(ngModel)]="targetPoints"
                  min="0"
                  class="caret-surface-container border-on-surface/40 placeholder-on-surface/40 w-20 flex-1 rounded-md border bg-white/10 p-1 px-2 py-1 shadow-md backdrop-blur-sm"
                />
              </app-primary-container>
            </section>
            <section class="bg-surface-bright mx-2 mb-4 flex flex-col rounded-4xl p-4 shadow-lg">
              <div class="m-2 flex w-full">
                <div class="flex flex-1 gap-2">
                  <img
                    ngSrc="/pokemon/la/images/pokemon/{{service.currentPokemonId()}}.png"
                    width="80"
                    height="80"
                    [alt]="service.currentPokemon().name()"
                  />
                  <div class="flex flex-col font-bold">
                    <div>No. {{ service.currentPokemon().id }}</div>
                    <div>{{ service.currentPokemon().name() }}</div>
                    <div>{{ service.currentPokemon().points() }}</div>
                  </div>
                </div>
                <div>
                  <button
                    type="reset"
                    class="bg-error hover:bg-error-bright mr-8 cursor-pointer rounded-lg p-2 shadow-md hover:shadow-sm"
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
              </div>
              <div class="m-2 flex-1 overflow-x-scroll">
                <table class="w-full">
                  <thead>
                    <tr>
                      <th class="w-20">Reward</th>
                      <th>Task</th>
                      <th class="w-36">Progress</th>
                      <th class="w-60">Requirements</th>
                      <th class="w-20">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (task of service.currentPokemon().tasks; track $index; let taskNo = $index) {
                      <tr>
                        <td class="pb-2 text-center font-bold">
                          {{ task.reward }}
                        </td>
                        <td class="pb-2 pl-4 font-bold">
                          {{ task.name() }}
                        </td>
                        <td class="flex justify-center p-2 pt-0">
                          @if (taskNo < service.currentPokemon().normalTasks.length) {
                            <div class="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                class="bg-error hover:bg-error-bright flex size-6 cursor-pointer items-center justify-center rounded-md"
                                (click)="updateProgress(taskNo, 0)"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="20px"
                                  viewBox="0 -960 960 960"
                                  width="20px"
                                  fill="#ffff"
                                >
                                  <path
                                    d="M480-192q-120 0-204-84t-84-204q0-120 84-204t204-84q65 0 120.5 27t95.5 72v-99h72v240H528v-72h131q-29-44-76-70t-103-26q-90 0-153 63t-63 153q0 90 63 153t153 63q84 0 144-55.5T693-456h74q-9 112-91 188t-196 76Z" />
                                </svg>
                              </button>
                              <div
                                class="bg-primary/20 focus-within:outline-blue flex items-center justify-center rounded-lg shadow-sm focus-within:outline-1">
                                <input
                                  type="number"
                                  class="focus:outline-blue w-10 rounded-l-lg px-2 py-1 focus:ring-0 focus:outline-0"
                                  [min]="task.min"
                                  [max]="task.max"
                                  [value]="task.progress()"
                                  (change)="updateProgress(taskNo, targetValue($event))"
                                />
                                <div
                                  class="h-full border-l-primary/10 flex items-center justify-center gap-1 rounded-r-lg border-l-2 px-1">
                                  <button
                                    type="button"
                                    class="bg-surface-container hover:bg-surface-container-low text-on-surface-container size-6 cursor-pointer rounded-md"
                                    (click)="updateProgress(taskNo, task.progress() - 1)"
                                  >
                                    -
                                  </button>
                                  <button
                                    type="button"
                                    class="bg-surface-container hover:bg-surface-container-low text-on-surface-container size-6 cursor-pointer rounded-md"
                                    (click)="updateProgress(taskNo, task.progress() + 1)"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          } @else {
                            <div class="flex w-full justify-center gap-2 font-bold">
                              {{ service.currentPokemon().completed() ? '完成' : '未完成' }}
                            </div>
                          }
                        </td>
                        <td class="pb-2">
                          <div class="flex flex-col">
                            <ul class="flex items-center justify-center">
                              @for (requirement of task.requirements; track $index) {
                                <li class="flex items-center justify-center font-bold">
                                  @if (requirement === task.requirements[0]) {
                                    <div
                                      class="flex items-center justify-center
                                  bg-secondary hover:bg-secondary-fixed
                                  text-on-secondary size-7 cursor-pointer rounded-full text-center"
                                      (click)="updateProgress(taskNo, requirement)"
                                    >
                                      {{ requirement }}
                                    </div>
                                  } @else {
                                    <div
                                      class="bg-secondary hover:bg-secondary-fixed h-1 w-2 cursor-pointer"
                                    ></div>
                                    <div
                                      class="flex items-center justify-center bg-secondary hover:bg-secondary-fixed text-on-secondary size-7 cursor-pointer rounded-full text-center"
                                      (click)="updateProgress(taskNo, requirement)"
                                    >
                                      {{ requirement }}
                                    </div>
                                  }
                                </li>
                              }
                            </ul>
                          </div>
                        </td>
                        <td class="w-16 pb-2 text-center font-bold">
                          {{ task.points() }}
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          </main>
          <aside class="bg-surface flex h-[calc(100vh-60px)] w-60 flex-col text-black">
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#75FB4C"
                      >
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
    </div>
  `,
})
export class PokemonLATasksSimulatorComponent {
  targetPoints = model(8500);

  service = createSignalizedPokedex();

  timelineSegments = computed(() =>
    this.service.segments()
      .filter((segment) => Object.hasOwn(this.service.pointsBySegment(), segment.id))
  );

  updateProgress(taskNo: number, progress: number) {
    this.service.doCurrentPokemonTask(taskNo, progress);
  }

  targetValue(event: Event): number {
    const target = event.target as HTMLInputElement;
    return parseInt(target.value);
  }
}

export default PokemonLATasksSimulatorComponent;
