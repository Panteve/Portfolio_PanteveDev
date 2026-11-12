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

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
