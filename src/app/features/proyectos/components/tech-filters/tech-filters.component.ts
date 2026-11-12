import { Component, computed, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { TechnologyFilter } from '../../../../data/projects';
import { TechIconComponent } from '../../../../shared/components/tech-icon/tech-icon.component';

@Component({
  selector: 'app-tech-filters',
  imports: [TechIconComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './tech-filters.component.html',
})
export class TechFiltersComponent {
  readonly technologies = input.required<TechnologyFilter[]>();
  readonly active = input.required<string[]>();

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

  protected isActive(name: string): boolean {
    return this.active().includes(name);
  }

  protected filterClass(name: string): string {
    const base =
      'flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-[11px] text-muted transition-colors duration-150 hover:bg-white/5 hover:text-ink';

    return this.isActive(name)
      ? `${base} bg-accent/10 text-ink ring-1 ring-inset ring-accent/20 shadow-[0_0_16px_-10px_rgba(45,212,191,0.55)]`
      : base;
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
