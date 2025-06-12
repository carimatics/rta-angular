import { ChangeDetectionStrategy, Component, InputSignal, Signal, computed, input, output } from '@angular/core';

import { BaseComponent } from '../../../../lib/components/base.component';
import { SignalizedPokemon } from '../../../../lib/pokemon/la/tasks-simulator';
import { ProgressInputComponent } from './progress-input.component';
import { RequirementsIndicatorComponent } from './requirements-indicator.component';

@Component({
  selector: 'app-task-table',
  imports: [ProgressInputComponent, RequirementsIndicatorComponent],
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
              @if (!$last) {
                <app-progress-input [task]="task" (updateProgress)="updateProgress.emit({ taskNo, progress: $event })" />
              } @else {
                <div class="flex w-full justify-center gap-2 font-bold">
                  {{ pokemon().completed() ? '完成' : '未完成' }}
                </div>
              }
            </td>
            <td class="pb-2">
              @if (!$last) {
                <app-requirements-indicator [task]="task" (updateProgress)="updateProgress.emit({ taskNo, progress: $event })" />
              }
            </td>
            <td class="w-16 pb-2 text-center font-bold">
              {{ task.points() }}
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTableComponent extends BaseComponent {
  pokemon = input.required<SignalizedPokemon>();
  updateProgress = output<{ taskNo: number; progress: number }>();

  override class: InputSignal<string | undefined> = input<string>();
  override defaultClasses: Signal<string> = computed<string>(() => 'flex items-center gap-2');
}
