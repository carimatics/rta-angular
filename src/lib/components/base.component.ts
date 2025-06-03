import { InputSignal, Signal } from '@angular/core';
import { twMerge } from 'tailwind-merge';

export abstract class BaseComponent {
  abstract class: InputSignal<string | undefined>;
  abstract defaultClasses: Signal<string>;

  hostClass(): string {
    return this.mergeClasses(this.defaultClasses(), this.class());
  }

  private mergeClasses(defaultClasses: string, customClasses: string | undefined): string {
    return customClasses ? twMerge(defaultClasses, customClasses) : defaultClasses;
  }
}
