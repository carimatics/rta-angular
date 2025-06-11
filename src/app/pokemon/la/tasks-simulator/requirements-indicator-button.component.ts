import { NgClass } from '@angular/common';
import { Component, InputSignal, Signal, computed, input, output } from '@angular/core';

import { BaseComponent } from '../../../../lib/components/base.component';

@Component({
  selector: 'app-requirements-indicator-button',
  imports: [NgClass],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <button
      [ngClass]="{
        'flex items-center justify-center size-7 bg-secondary text-on-secondary cursor-pointer rounded-full': true,
        'hover:brightness-125': achieved(),
        'brightness-75 hover:brightness-100': !achieved(),
      }"
      (click)="updateProgress.emit()">
      {{ requirement() }}
    </button>
  `,
})
export class RequirementsIndicatorButtonComponent extends BaseComponent {
  requirement = input.required<number>();
  achieved = input.required<boolean>();
  updateProgress = output<void>();

  override class: InputSignal<string | undefined> = input<string>();
  override defaultClasses: Signal<string> = computed<string>(() => '');
}
