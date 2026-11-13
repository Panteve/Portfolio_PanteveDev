import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { Project } from '../../../data/projects';

@Component({
  selector: 'app-project-visual',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (project().imageUrl) {
      <img
        [src]="project().imageUrl"
        [alt]="'Captura del proyecto ' + project().name"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover"
      />
    } @else {
      <div
        class="relative flex h-full w-full flex-col overflow-hidden bg-editor"
        [style.--project-rgb]="colorVar()"
      >
        <div class="project-visual-tint absolute inset-0" aria-hidden="true"></div>
        <div
          class="absolute inset-0 opacity-[0.18]"
          style="background-image: linear-gradient(to right, rgb(var(--text) / 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--text) / 0.3) 1px, transparent 1px); background-size: 22px 22px"
          aria-hidden="true"
        ></div>

        <div class="relative flex items-center gap-1.5 border-b border-line px-3 py-1.5">
          <span class="h-1.5 w-1.5 rounded-full bg-ink/20"></span>
          <span class="h-1.5 w-1.5 rounded-full bg-ink/20"></span>
          <span class="h-1.5 w-1.5 rounded-full bg-ink/20"></span>
          <span class="ml-2 text-[13px] text-muted">{{ project().code }}.proj</span>
        </div>

        <div class="relative flex flex-1 items-center justify-center p-3">
          <span
            class="select-none text-3xl font-bold tracking-tight text-ink/85 drop-shadow-[0_0_18px_rgba(122,162,247,0.25)]"
            aria-hidden="true"
            >{{ project().code }}</span
          >
          <span class="absolute bottom-1.5 right-2.5 text-[13px] text-muted"
            >// captura pendiente</span
          >
        </div>
      </div>
    }
  `,
  styles: `
    .project-visual-tint {
      background:
        radial-gradient(circle at 24% 14%, rgb(var(--project-rgb) / 0.28), transparent 58%),
        linear-gradient(135deg, rgb(var(--project-rgb) / 0.1), transparent 62%);
    }
  `,
})
export class ProjectVisualComponent {
  readonly project = input.required<Project>();

  protected readonly colorVar = computed(() => `var(--${this.project().color})`);
}
