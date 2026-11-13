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
      --project-rgb: var(--accent);
    }

    .project-card {
      box-shadow: 0 18px 40px -30px rgb(0 0 0 / 0.85);
      transition:
        transform 150ms ease,
        border-color 150ms ease,
        box-shadow 150ms ease;
    }

    .project-card:hover,
    .project-card:focus-within {
      border-color: rgb(var(--project-rgb) / 0.35);
      box-shadow:
        0 22px 50px -28px rgb(0 0 0 / 0.95),
        0 0 34px -12px rgb(var(--project-rgb) / 0.25);
    }

    .project-card-topline {
      background: rgb(var(--project-rgb));
    }

    .project-accent {
      color: rgb(var(--project-rgb));
    }

    .project-card:hover .project-card-cta,
    .project-card:focus-within .project-card-cta {
      border-color: rgb(var(--project-rgb) / 0.4);
      color: rgb(var(--project-rgb));
    }

    .project-card-link:focus-visible {
      outline: 2px solid rgb(var(--project-rgb));
      outline-offset: -2px;
      border-radius: 0.5rem;
    }

    @media (prefers-reduced-motion: no-preference) {
      .project-card:hover,
      .project-card:focus-within {
        transform: translateY(-2px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .project-card {
        transition: none;
      }
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
  protected readonly colorVar = computed(() => `var(--${this.project().color})`);
  protected readonly indexLabel = computed(() => String(this.index()).padStart(2, '0'));
}
