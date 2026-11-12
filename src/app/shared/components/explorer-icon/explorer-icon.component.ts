import { Component, input, ChangeDetectionStrategy } from '@angular/core';

export type ExplorerIconName = 'folder' | 'folder-open' | 'typescript' | 'chevron';

/**
 * Iconos del explorador con la estética de Material Icon Theme de VS Code.
 * Van inline para no sumar dependencias ni fuentes extra.
 */
@Component({
  selector: 'app-explorer-icon',
  template: `
    @switch (name()) {
      @case ('chevron') {
        <svg
          [attr.width]="size()"
          [attr.height]="size()"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          class="transition-transform duration-150"
          [class.rotate-90]="open()"
        >
          <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      }
      @case ('typescript') {
        <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 16 16" aria-hidden="true">
          <rect width="16" height="16" rx="2.5" fill="#3178c6" />
          <text
            x="8"
            y="11.7"
            text-anchor="middle"
            font-family="JetBrains Mono, ui-monospace, monospace"
            font-size="8.5"
            font-weight="800"
            fill="#ffffff"
          >
            TS
          </text>
        </svg>
      }
      @case ('folder-open') {
        <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M3 7.5C3 6.67 3.67 6 4.5 6h4.1c.4 0 .78.16 1.06.44L11 8h7.5c.83 0 1.5.67 1.5 1.5V11H8.3c-.66 0-1.25.43-1.44 1.06L5 18V7.5z"
            [attr.fill]="color()"
            opacity="0.72"
          />
          <path
            d="M8.3 10h12.7c.95 0 1.64.9 1.39 1.82l-1.62 6.11c-.17.63-.74 1.07-1.39 1.07H3.5A1.5 1.5 0 0 1 2 17.5v-1.03L6.86 10.9c.31-.55.9-.9 1.44-.9z"
            [attr.fill]="color()"
          />
        </svg>
      }
      @default {
        <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
            [attr.fill]="color()"
          />
        </svg>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    :host {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
    }
  `,
})
export class ExplorerIconComponent {
  readonly name = input<ExplorerIconName>('folder');
  readonly color = input('#8a9ab5');
  readonly size = input(16);
  readonly open = input(false);
}
