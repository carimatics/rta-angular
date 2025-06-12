import { ChangeDetectionStrategy, Component, InputSignal, Signal, computed, input } from '@angular/core';

import { BaseComponent } from '../../../../lib/components/base.component';

@Component({
  selector: 'app-primary-container',
  imports: [],
  host: {
    '[class]': 'hostClass()',
  },
  template: `<ng-content></ng-content> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimaryContainerComponent extends BaseComponent {
  override class: InputSignal<string | undefined> = input<string>();
  override defaultClasses: Signal<string> = computed<string>(() => 'bg-surface rounded-xl p-4 shadow-lg text-on-surface');
}
