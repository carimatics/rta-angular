import { ChangeDetectionStrategy, Component, InputSignal, Signal, WritableSignal, computed, input } from '@angular/core';

import { BaseComponent } from '../../../../lib/components/base.component';
import { Segment } from '../../../../lib/pokemon/la/fixtures';

@Component({
  selector: 'app-segment-select',
  imports: [],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <div class="font-bold">現在区間</div>
    <select class="border-outline rounded-md border-1 px-1 py-2 shadow-md" [value]="currentSegment()()" (change)="onSegmentChange($event)">
      @for (segment of segments(); track segment.id) {
        <option [value]="segment.id">{{ segment.name }}</option>
      }
    </select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentSelectComponent extends BaseComponent {
  segments = input.required<{ id: Segment; name: string }[]>();
  currentSegment = input.required<WritableSignal<Segment>>();
  override class: InputSignal<string | undefined> = input<string>();
  override defaultClasses: Signal<string> = computed<string>(() => 'flex items-center gap-2');

  onSegmentChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.currentSegment().set(parseInt(selectedValue) as Segment);
  }
}
