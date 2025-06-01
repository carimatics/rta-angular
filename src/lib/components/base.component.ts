import { InputSignal, Signal } from '@angular/core';
import { twMerge } from 'tailwind-merge';

export abstract class BaseComponent {
  abstract class: InputSignal<string | undefined>;
  abstract defaultClasses: Signal<string>;

  hostClass(): string {
    const customClasses = this.class();
    return this.mergeClasses(this.defaultClasses(), customClasses);
  }

  private mergeClasses(defaultClasses: string, customClasses: string | undefined): string {
    return customClasses ? twMerge(defaultClasses, customClasses) : defaultClasses;
  }
}
