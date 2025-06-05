import { NgClass } from '@angular/common';
import { Component, InputSignal, Signal, computed, input, output } from '@angular/core';

import { BaseComponent } from '../../../../lib/components/base.component';
import { SignalizedTask } from '../../../../lib/pokemon/la/tasks-simulator/pokemon-la-tasks-simulator.service';
import { RequirementsIndicatorButtonComponent } from './requirements-indicator-button.component';

@Component({
  selector: 'app-requirements-indicator',
  imports: [NgClass, RequirementsIndicatorButtonComponent],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <ul class="flex items-center justify-center">
      @for (requirement of task().requirements; track $index) {
        <li class="flex items-center justify-center font-bold">
          @let achieved = progress() >= requirement;
          @if (requirement === task().first) {
            <app-requirements-indicator-button
              [requirement]="requirement"
              [achieved]="achieved"
              (updateProgress)="updateProgress.emit(requirement)" />
          } @else {
            <div
              [ngClass]="{
                'bg-secondary h-1 w-2': true,
                'brightness-75': !achieved,
              }"></div>
            <app-requirements-indicator-button
              [requirement]="requirement"
              [achieved]="achieved"
              (updateProgress)="updateProgress.emit(requirement)" />
          }
        </li>
      }
    </ul>
  `,
})
export class RequirementsIndicatorComponent extends BaseComponent {
  task = input.required<SignalizedTask>();
  progress = computed(() => this.task().progress());
  updateProgress = output<number>();

  override class: InputSignal<string | undefined> = input<string>();
  override defaultClasses: Signal<string> = computed<string>(() => 'flex items-center justify-center');
}
