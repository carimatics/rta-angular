import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { VariantProps, tv } from 'tailwind-variants';

import { BaseComponent } from './base.component';

const searchInput = tv({
  base: 'caret-outline-variant border border-outline placeholder-outline-variant flex-1 bg-white/10 backdrop-blur-sm p-1',
  variants: {
    color: {
      default: '',
      primary: 'bg-primary/10 text-on-primary',
      secondary: 'bg-secondary/10 text-on-secondary',
      tertiary: 'bg-tertiary/10 text-on-tertiary',
      error: 'bg-error/10 text-on-error',
    },
    size: {
      xs: 'text-xs rounded-xs',
      sm: 'text-sm rounded-sm',
      md: 'text-md rounded-md',
      lg: 'text-lg rounded-lg',
      xl: 'text-xl rounded-xl',
    },
    font: {
      default: '',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    color: 'default',
    size: 'md',
    font: 'default',
  },
});

type SearchInputVariant = VariantProps<typeof searchInput>;

@Component({
  selector: 'input[type="search"][lib-search-input]',
  imports: [],
  host: { '[class]': 'hostClass()' },
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent extends BaseComponent {
  color = input<SearchInputVariant['color']>();
  size = input<SearchInputVariant['size']>();
  font = input<SearchInputVariant['font']>();

  override class = input<string>();
  override defaultClasses = computed<string>(() =>
    searchInput({
      color: this.color(),
      size: this.size(),
      font: this.font(),
    }),
  );
}
