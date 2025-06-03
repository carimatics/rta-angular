import { Component, computed, input, InputSignal, output, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../../../lib/components/base.component';
import { SignalizedPokemon } from '../../../../lib/pokemon/la/tasks-simulator/pokemon-la-tasks-simulator.service';
import { ProgressInputComponent } from './progress-input.component';

@Component({
  selector: 'app-task-table',
  imports: [
    FormsModule,
    ProgressInputComponent,
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
                <app-progress-input
                  [task]="task"
                  (updateProgress)="updateProgress.emit({ taskNo, progress: $event })"
                />
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
}
