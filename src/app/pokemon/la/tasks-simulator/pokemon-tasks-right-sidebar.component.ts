import { Component, Input } from '@angular/core';
import { Pokemon évolutionChain, TasksService } from '../../../services/tasks.service';
import { CommonModule } from '@angular/common';

interface TimelineSegment {
  id: number;
  name: string;
  points: {
    total: number;
    increased: number;
  };
}

@Component({
  selector: 'app-pokemon-tasks-right-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="flex h-[calc(100vh-56px)] w-60 flex-col">
      <div class="flex h-16 flex-shrink-0 items-center justify-center border-b border-l border-outline px-4">
        <h2 class="text-lg font-semibold text-on-surface">Tasks Timeline</h2>
      </div>
      <div class="h-full overflow-y-auto border-l border-outline p-4">
        <div class="mb-4">
          <h3 class="text-md mb-2 font-semibold text-on-surface-variant">Total Points: {{ totalPoints }}</h3>
        </div>
        @for (segment of timelineSegments; track segment.id) {
          <div class="mb-3 rounded-lg border border-outline bg-surface-container-low p-3 shadow-sm">
            <h4 class="mb-1 text-sm font-medium text-on-surface">{{ segment.name }}</h4>
            <p class="text-xs text-on-surface-variant">Points: {{ segment.points.total }}</p>
            @if (segment.points.increased > 0) {
              <p class="text-xs text-green-500">+{{ segment.points.increased }}</p> <!-- Assuming text-green-500 is acceptable or will be themed separately if needed -->
            }
          </div>
        } @empty {
          <p class="text-sm text-on-surface-variant">No timeline segments available.</p>
        }
      </div>
    </aside>
  `,
})
export class PokemonTasksRightSidebarComponent {
  @Input({ required: true }) timelineSegments!: TimelineSegment[];
  @Input({ required: true }) totalPoints!: number;
}
