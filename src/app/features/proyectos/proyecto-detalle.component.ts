import { Component, computed, effect, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { STATUS_LABELS, getProjectById } from '../../data/projects';
import { ProjectVisualComponent } from '../../shared/components/project-visual/project-visual.component';
import { statusBadgeClass } from '../../shared/utils/project-status';

@Component({
  selector: 'app-proyecto-detalle',
  imports: [RouterLink, ProjectVisualComponent],
  host: { class: 'flex flex-1 flex-col' },
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './proyecto-detalle.component.html',
})
export class ProyectoDetalleComponent {
  // El router entrega el parámetro :id como input (withComponentInputBinding).
  readonly id = input.required<string>();

  protected readonly project = computed(() => getProjectById(this.id()));
  protected readonly statusLabel = computed(() => {
    const project = this.project();
    return project ? STATUS_LABELS[project.status] : '';
  });
  protected readonly badgeClass = computed(() => {
    const project = this.project();
    return project ? statusBadgeClass(project.status) : 'chip';
  });

  constructor() {
    const seo = inject(SeoService);

    effect(() => {
      const project = this.project();
      seo.set(
        project ? `${project.name} · Proyecto · Diego` : 'Proyecto no encontrado · Diego',
        project?.summary ?? 'El proyecto solicitado no existe en el portfolio.',
      );
    });
  }
}
