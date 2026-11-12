import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';
import { PROJECTS, Project, TECHNOLOGIES } from '../../data/projects';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { TechFiltersComponent } from './components/tech-filters/tech-filters.component';

@Component({
  selector: 'app-proyectos',
  imports: [ProjectCardComponent, TechFiltersComponent],
  host: { class: 'flex flex-1 flex-col' },
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './proyectos.component.html',
})
export class ProyectosComponent {
  protected readonly projects = PROJECTS;
  protected readonly technologies = TECHNOLOGIES;
  protected readonly activeFilters = signal<Set<string>>(new Set());

  protected readonly activeNames = computed(() => Array.from(this.activeFilters()));
  protected readonly filterLabel = computed(() =>
    this.activeFilters().size === 0 ? 'todos' : this.activeNames().join('; '),
  );

  protected readonly filteredProjects = computed(() => {
    const filters = this.activeFilters();

    if (filters.size === 0) {
      return this.projects;
    }

    return this.projects.filter((project) =>
      project.technologies.some((technology) => filters.has(technology)),
    );
  });

  protected readonly resultsLabel = computed(
    () => `${this.filteredProjects().length} de ${this.projects.length} proyectos`,
  );

  constructor() {
    inject(SeoService).set(
      'Proyectos · Diego',
      'Proyectos de Diego: POS multisucursal, juego de puntería en Godot, análisis UX y más.',
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

  protected clearFilters(): void {
    this.activeFilters.set(new Set());
  }

  protected projectIndex(project: Project): number {
    return this.projects.indexOf(project) + 1;
  }
}
