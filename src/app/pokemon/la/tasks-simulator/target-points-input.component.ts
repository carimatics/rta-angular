import { Component, InputSignal, Signal, computed, input, model } from '@angular/core';

import { BaseComponent } from '../../../../lib/components/base.component';

@Component({
  selector: 'app-target-points-input',
  imports: [],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <div class="font-bold">目標点数</div>
    <input
      type="number"
      placeholder="Target Points"
      [value]="targetPoints()"
      (change)="onTargetPointsChange($event)"
      min="0"
      class="caret-outline-variant border-outline placeholder-outline-variant w-20 flex-1 rounded-md border bg-white/10 p-1 px-2 py-1 shadow-md backdrop-blur-sm" />
  `,
})
export class TargetPointsInputComponent extends BaseComponent {
  targetPoints = model.required<number>();
  override class: InputSignal<string | undefined> = input<string>();
  override defaultClasses: Signal<string> = computed<string>(() => 'flex items-center gap-2');

  onTargetPointsChange(event: Event) {
    const inputElement = event.target as HTMLSelectElement;
    const inputtedValue = inputElement.value;
    this.targetPoints.set(parseInt(inputtedValue));
  }
}
