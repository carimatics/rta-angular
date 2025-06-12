import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { BaseComponent } from '../../../lib/components/base.component';

@Component({
  selector: 'app-header',
  imports: [],
  host: { '[class]': 'hostClass()' },
  template: `
    <header>
      <div class="ml-2 font-bold">へっだ〜</div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent extends BaseComponent {
  override class = input<string>();
  override defaultClasses = computed(() => 'z-50 flex h-14 w-full items-center');
}
