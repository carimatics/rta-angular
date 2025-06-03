import { Component, computed, input, InputSignal, output, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../../../lib/components/base.component';
import { SignalizedPokemon } from '../../../../lib/pokemon/la/tasks-simulator/pokemon-la-tasks-simulator.service';

@Component({
  selector: 'app-task-table',
  imports: [
    FormsModule,
  ],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
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
        @for (task of pokemon().tasks; track $index; let taskNo = $index) {
          <tr>
            <td class="pb-2 text-center font-bold">
              {{ task.reward }}
            </td>
            <td class="pb-2 pl-4 font-bold">
              {{ task.name() }}
            </td>
            <td class="flex justify-center p-2 pt-0">
              @if (taskNo < pokemon().normalTasks.length) {
                <div class="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    class="bg-error hover:bg-error-bright flex size-6 cursor-pointer items-center justify-center rounded-md"
                    (click)="updateProgress.emit({ taskNo, progress: 0 })"
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
                      (change)="updateProgress.emit({ taskNo, progress: targetValue($event ) })"
                    />
                    <div
                      class="h-full border-l-primary/10 flex items-center justify-center gap-1 rounded-r-lg border-l-2 px-1">
                      <button
                        type="button"
                        class="bg-surface-container hover:bg-surface-container-low text-on-surface-container size-6 cursor-pointer rounded-md"
                        (click)="updateProgress.emit({ taskNo, progress: task.progress() - 1 })"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        class="bg-surface-container hover:bg-surface-container-low text-on-surface-container size-6 cursor-pointer rounded-md"
                        (click)="updateProgress.emit({ taskNo, progress: task.progress() + 1 })"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              } @else {
                <div class="flex w-full justify-center gap-2 font-bold">
                  {{ pokemon().completed() ? '完成' : '未完成' }}
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
                          (click)="updateProgress.emit({ taskNo, progress: requirement })"
                        >
                          {{ requirement }}
                        </div>
                      } @else {
                        <div
                          class="bg-secondary hover:bg-secondary-fixed h-1 w-2 cursor-pointer"
                        ></div>
                        <div
                          class="flex items-center justify-center bg-secondary hover:bg-secondary-fixed text-on-secondary size-7 cursor-pointer rounded-full text-center"
                          (click)="updateProgress.emit({ taskNo, progress: requirement })"
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
  `,
})
export class TaskTableComponent extends BaseComponent {
  pokemon = input.required<SignalizedPokemon>();
  updateProgress = output<{ taskNo: number, progress: number }>();

  override class: InputSignal<string | undefined> = input<string>();
  override defaultClasses: Signal<string> = computed<string>(() => 'flex items-center gap-2');

  targetValue(event: Event): number {
    const target = event.target as HTMLInputElement;
    return parseInt(target.value);
  }
}
