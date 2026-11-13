import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';
import {
  PROJECTS,
  PROJECT_TYPES,
  PROJECT_TYPE_LABELS,
  Project,
  ProjectType,
  TECHNOLOGIES,
} from '../../data/projects';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { CursorGlowDirective } from '../../shared/directives/cursor-glow.directive';
import { TechFiltersComponent } from './components/tech-filters/tech-filters.component';

@Component({
  selector: 'app-proyectos',
  imports: [ProjectCardComponent, CursorGlowDirective, TechFiltersComponent],
  host: { class: 'flex flex-1 flex-col' },
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './proyectos.component.html',
  styles: `
    .projects-stage {
      background-image:
        linear-gradient(to right, rgb(var(--text) / 0.035) 1px, transparent 1px),
        linear-gradient(to bottom, rgb(var(--text) / 0.035) 1px, transparent 1px);
      background-size: 28px 28px;
    }

    .projects-stage > * {
      position: relative;
      z-index: 1;
    }

    .projects-stage::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: radial-gradient(
        320px circle at var(--cursor-x, 50%) var(--cursor-y, 42%),
        rgb(var(--accent) / 0.08),
        transparent 72%
      );
      opacity: var(--cursor-glow-opacity, 0);
      transition: opacity 300ms ease;
    }

    @media (pointer: coarse), (prefers-reduced-motion: reduce) {
      .projects-stage::before {
        display: none;
      }
    }
  `,
})
export class ProyectosComponent {
  protected readonly projects = PROJECTS;
  protected readonly technologies = TECHNOLOGIES;
  protected readonly types = PROJECT_TYPES;
  protected readonly activeFilters = signal<Set<string>>(new Set());
  protected readonly activeTypes = signal<Set<ProjectType>>(new Set());

  protected readonly activeNames = computed(() => Array.from(this.activeFilters()));
  protected readonly activeTypeValues = computed(() => Array.from(this.activeTypes()));
  protected readonly filterLabel = computed(() => {
    const types = this.activeTypeValues().map((type) => PROJECT_TYPE_LABELS[type]);
    const technologies = this.activeNames();
    const active = [...types, ...technologies];

    return active.length === 0 ? 'todos' : active.join('; ');
  });

  protected readonly filteredProjects = computed(() => {
    const technologies = this.activeFilters();
    const types = this.activeTypes();

    if (technologies.size === 0 && types.size === 0) {
      return this.projects;
    }

    return this.projects.filter((project) => {
      const matchesType = types.size === 0 || types.has(project.tipo);
      const matchesTechnology =
        technologies.size === 0 ||
        project.technologies.some((technology) => technologies.has(technology));

      return matchesType && matchesTechnology;
    });
  });

  protected readonly resultsLabel = computed(
    () => `${this.filteredProjects().length} de ${this.projects.length} proyectos`,
  );

  constructor() {
    inject(SeoService).set(
      'Proyectos · Diego',
      'Proyectos de Diego: POS multisucursal, juego de puntería en Godot, app de gimnasio y más.',
    );
  }

  protected toggleTechnology(name: string): void {
    this.activeFilters.update((current) => {
      const next = new Set(current);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  protected toggleType(type: ProjectType): void {
    this.activeTypes.update((current) => {
      const next = new Set(current);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  protected clearFilters(): void {
    this.activeFilters.set(new Set());
    this.activeTypes.set(new Set());
  }

  protected projectIndex(project: Project): number {
    return this.projects.indexOf(project) + 1;
  }
}
