import { Component, computed, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { ProjectType, ProjectTypeOption, TechnologyFilter } from '../../../../data/projects';
import { TechIconComponent } from '../../../../shared/components/tech-icon/tech-icon.component';

@Component({
  selector: 'app-tech-filters',
  imports: [TechIconComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './tech-filters.component.html',
})
export class TechFiltersComponent {
  readonly types = input.required<ProjectTypeOption[]>();
  readonly activeTypes = input.required<ProjectType[]>();
  readonly technologies = input.required<TechnologyFilter[]>();
  readonly active = input.required<string[]>();

  readonly toggleType = output<ProjectType>();
  readonly toggle = output<string>();
  readonly clear = output<void>();

  protected readonly query = signal('');

  protected readonly filteredTechnologies = computed(() => {
    const query = this.query().trim().toLowerCase();
    const technologies = this.technologies();

    if (!query) {
      return technologies;
    }

    return technologies.filter((technology) => technology.name.toLowerCase().includes(query));
  });

  protected isTypeActive(type: ProjectType): boolean {
    return this.activeTypes().includes(type);
  }

  protected isActive(name: string): boolean {
    return this.active().includes(name);
  }

  protected typeFilterClass(type: ProjectType): string {
    const base =
      'flex cursor-pointer items-center gap-2 rounded px-1.5 py-1.5 text-[13px] text-muted transition-colors duration-150 hover:bg-ink/5 hover:text-ink';

    return this.isTypeActive(type)
      ? `${base} bg-accent/10 text-ink ring-1 ring-inset ring-accent/20 shadow-[0_0_16px_-10px_rgba(122,162,247,0.55)]`
      : base;
  }

  protected filterClass(name: string): string {
    const base =
      'flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-[13px] text-muted transition-colors duration-150 hover:bg-ink/5 hover:text-ink';

    return this.isActive(name)
      ? `${base} bg-accent/10 text-ink ring-1 ring-inset ring-accent/20 shadow-[0_0_16px_-10px_rgba(122,162,247,0.55)]`
      : base;
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
