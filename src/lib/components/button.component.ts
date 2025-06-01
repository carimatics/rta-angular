import { Component, computed, input } from '@angular/core';
import { tv, VariantProps } from 'tailwind-variants';
import { BaseComponent } from './base.component';

const button = tv({
  base: 'py-1 px-2 w-fit hover:brightness-125 transition-all shadow-shadow shadow-xs hover:shadow-sm text-center border-outline cursor-pointer',
  variants: {
    color: {
      primary: 'bg-primary text-on-primary',
      secondary: 'bg-secondary text-on-secondary',
      tertiary: 'bg-tertiary text-on-tertiary',
      error: 'bg-error text-on-error',
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
    color: 'primary',
    size: 'md',
    font: 'default',
  },
});

type ButtonVariants = VariantProps<typeof button>;

@Component({
  selector: 'button[libButton]',
  imports: [],
  host: { '[class]': 'hostClass()' },
  template: `
    <ng-content />`
})
export class ButtonComponent extends BaseComponent {
  color = input<ButtonVariants['color']>();
  size = input<ButtonVariants['size']>();
  font = input<ButtonVariants['font']>();

  override class = input<string>();
  override defaultClasses = computed<string>(() => button({
    color: this.color(),
    size: this.size(),
    font: this.font()
  }));
}
