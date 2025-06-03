import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../../../lib/components/base.component';

@Component({
  selector: 'app-pokemon-la-tasks-simulator-primary-container',
  imports: [
    FormsModule,
  ],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <ng-content></ng-content>
  `,
})
export class PrimaryContainerComponent extends BaseComponent {
  override class: InputSignal<string | undefined> = input<string>();
  override defaultClasses: Signal<string> = computed<string>(() => 'bg-surface rounded-xl p-4 shadow-lg text-on-surface');
}
