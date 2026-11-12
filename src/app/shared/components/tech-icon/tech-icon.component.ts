import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Iconos monocromáticos por tecnología. Son trazos simples (no logos oficiales)
 * para mantener el explorador legible a 15-16 px y sin dependencias externas.
 */
@Component({
  selector: 'app-tech-icon',
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @switch (key()) {
        @case ('angular') {
          <path d="M12 2.5 3.2 5.6l1.4 12.1L12 21.5l7.4-3.8 1.4-12.1L12 2.5Z" />
          <path d="M12 7.2 8.3 16h1.9l.7-1.8h3.9l.7 1.8h1.9L12 7.2Z" />
        }
        @case ('ngrxsignalstore') {
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="m3 12 9 5 9-5" />
          <path d="m3 16 9 5 9-5" />
        }
        @case ('nestjs') {
          <path d="M12 2.5 20 7v10l-8 4.5L4 17V7l8-4.5Z" />
          <path d="M8.7 15.5v-7l6.6 7v-7" />
        }
        @case ('prisma') {
          <path d="M12 3 4 20h16L12 3Z" />
          <path d="M12 3v10" />
        }
        @case ('postgresql') {
          <ellipse cx="12" cy="6" rx="7.5" ry="3" />
          <path d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
          <path d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" />
        }
        @case ('electron') {
          <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
          <ellipse cx="12" cy="12" rx="9" ry="3.8" />
          <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" />
        }
        @case ('figma') {
          <path d="M9 3h3v6H9a3 3 0 1 1 0-6Z" />
          <path d="M12 3h3a3 3 0 1 1 0 6h-3V3Z" />
          <path d="M9 9h3v6H9a3 3 0 1 1 0-6Z" />
          <path d="M9 15h3v3a3 3 0 1 1-3-3Z" />
          <circle cx="15" cy="12" r="3" />
        }
        @case ('gdscript') {
          <path d="M6 3h7l4 4v14H6V3Z" />
          <path d="M13 3v4h4" />
          <path d="m10.5 12-2 2 2 2" />
          <path d="m13.5 12 2 2-2 2" />
        }
        @case ('godot') {
          <path d="M8 8h8a3 3 0 0 1 3 3v7H5v-7a3 3 0 0 1 3-3Z" />
          <path d="M12 4v4" />
          <circle cx="9.5" cy="12.5" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="12.5" r="0.7" fill="currentColor" stroke="none" />
          <path d="M9.5 16h5" />
        }
        @case ('java') {
          <path d="M5 9h10v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Z" />
          <path d="M15 10h1.5a2.5 2.5 0 0 1 0 5H15" />
          <path d="M8 6c0-1 1-1 1-2M11 6c0-1 1-1 1-2" />
        }
        @case ('android') {
          <path d="M6 15a6 6 0 0 1 12 0v3H6v-3Z" />
          <path d="M12 6v3M8 9 6.5 7M16 9l1.5-2" />
          <circle cx="9.5" cy="13" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="13" r="0.7" fill="currentColor" stroke="none" />
        }
        @case ('uxui') {
          <path d="m4 20 4-1 9-9-3-3-9 9-1 4Z" />
          <path d="m14 7 3 3" />
          <path d="M4 20h16" />
        }
        @default {
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
        }
      }
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    :host {
      display: inline-flex;
      flex-shrink: 0;
    }
  `,
})
export class TechIconComponent {
  readonly name = input.required<string>();
  readonly size = input(16);

  protected readonly key = computed(() => this.name().toLowerCase().replace(/[^a-z]/g, ''));
}
