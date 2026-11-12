import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { Project, STATUS_LABELS } from '../../../data/projects';
import { statusBadgeClass } from '../../../shared/utils/project-status';
import { ProjectVisualComponent } from '../project-visual/project-visual.component';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-card',
  imports: [RouterLink, NgClass, ProjectVisualComponent],
  templateUrl: './project-card.component.html',
  host: {
    '[class.is-featured]': 'project().featured',
  },
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    @media (min-width: 640px) {
      :host(.is-featured) {
        grid-column: span 2 / span 2;
      }
    }
  `,
})
export class ProjectCardComponent {
  readonly project = input.required<Project>();
  readonly index = input.required<number>();

  protected readonly statusLabel = computed(() => STATUS_LABELS[this.project().status]);
  protected readonly statusClass = computed(() => statusBadgeClass(this.project().status));
  protected readonly indexLabel = computed(() => String(this.index()).padStart(2, '0'));
}
