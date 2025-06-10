import { Component, InputSignal, Signal, computed, input, output } from '@angular/core';

import { BaseComponent } from '../../../../lib/components/base.component';
import { ButtonComponent } from '../../../../lib/components/button.component';
import { SignalizedTask } from '../../../../lib/pokemon/la/tasks-simulator';

@Component({
  selector: 'app-progress-input',
  imports: [ButtonComponent],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <button lib-button color="error" size="sm" class="flex size-6 items-center justify-center p-0" (click)="updateProgress.emit(0)">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffff">
        <path
          d="M480-192q-120 0-204-84t-84-204q0-120 84-204t204-84q65 0 120.5 27t95.5 72v-99h72v240H528v-72h131q-29-44-76-70t-103-26q-90 0-153 63t-63 153q0 90 63 153t153 63q84 0 144-55.5T693-456h74q-9 112-91 188t-196 76Z" />
      </svg>
    </button>
    <div class="bg-secondary/20 focus-within:outline-blue flex items-center justify-center rounded-lg shadow-sm focus-within:outline-1">
      <input
        type="number"
        class="focus:outline-blue w-10 rounded-l-lg px-2 py-1 focus:ring-0 focus:outline-0"
        [min]="task().min"
        [max]="task().max"
        [value]="task().progress()"
        (change)="updateProgress.emit(targetValue($event))" />
      <div class="h-full border-l-outline-variant flex items-center justify-center gap-1 rounded-r-lg border-l-2 px-1">
        <button
          type="button"
          lib-button
          color="secondary"
          class="flex items-center justify-center size-6"
          (click)="updateProgress.emit(task().progress() - 1)">
          -
        </button>
        <button
          type="button"
          lib-button
          color="secondary"
          class="flex items-center justify-center size-6"
          (click)="updateProgress.emit(task().progress() + 1)">
          +
        </button>
      </div>
    </div>
  `,
})
export class ProgressInputComponent extends BaseComponent {
  task = input.required<SignalizedTask>();
  updateProgress = output<number>();

  override class: InputSignal<string | undefined> = input<string>();
  override defaultClasses: Signal<string> = computed<string>(() => 'flex items-center justify-center gap-1');

  targetValue(event: Event): number {
    const target = event.target as HTMLInputElement;
    return parseInt(target.value);
  }
}
