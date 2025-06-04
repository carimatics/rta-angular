import { Component, InputSignal, Signal, computed, input, output } from '@angular/core';

import { BaseComponent } from '../../../../lib/components/base.component';
import { SignalizedTask } from '../../../../lib/pokemon/la/tasks-simulator/pokemon-la-tasks-simulator.service';

@Component({
  selector: 'app-requirements-indicator',
  imports: [],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <ul class="flex items-center justify-center">
      @for (requirement of task().requirements; track $index) {
        <li class="flex items-center justify-center font-bold">
          @if (requirement === task().first) {
            <button
              class="flex items-center justify-center size-7
                bg-secondary text-on-secondary cursor-pointer rounded-full
                {{ progress() >= requirement ? 'hover:brightness-125' : 'brightness-75 hover:brightness-100' }}"
              (click)="updateProgress.emit(requirement)">
              {{ requirement }}
            </button>
          } @else {
            <div
              class="bg-secondary h-1 w-2
                {{ progress() >= requirement ? '' : 'brightness-75' }}"></div>
            <button
              class="flex items-center justify-center size-7
                bg-secondary text-on-secondary cursor-pointer rounded-full
                {{ progress() >= requirement ? 'hover:brightness-125' : 'brightness-75 hover:brightness-100' }}"
              (click)="updateProgress.emit(requirement)">
              {{ requirement }}
            </button>
          }
        </li>
      }
    </ul>
  `,
})
export class RequirementsIndicatorComponent extends BaseComponent {
  task = input.required<SignalizedTask>();
  progress = computed(() => this.task().progress());
  updateProgress = output<number>();

  override class: InputSignal<string | undefined> = input<string>();
  override defaultClasses: Signal<string> = computed<string>(() => 'flex items-center justify-center');
}
