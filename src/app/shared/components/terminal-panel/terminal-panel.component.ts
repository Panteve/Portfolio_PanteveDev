import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

export type TerminalTone = 'command' | 'muted' | 'info' | 'success' | 'link';

export interface TerminalLine {
  text: string;
  tone?: TerminalTone;
}

@Component({
  selector: 'app-terminal-panel',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section
      class="terminal-panel flex flex-col overflow-hidden border-t border-line bg-surface-0"
      [class.terminal-panel-collapsed]="!open()"
      aria-label="Panel inferior: terminal"
    >
      <div class="flex shrink-0 items-stretch border-b border-line bg-surface-2">
        <div class="flex min-w-0 flex-1 items-end gap-1 px-2 pt-1.5">
          <button
            type="button"
            class="flex shrink-0 items-center gap-1.5 rounded-t border border-b-0 border-line bg-surface-0 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-ink ring-1 ring-inset ring-accent/20 shadow-[0_0_18px_-10px_rgba(122,162,247,0.5)]"
            [attr.aria-expanded]="open()"
            aria-controls="terminal-output"
            (click)="toggle()"
          >
            <span class="text-accent" aria-hidden="true">&gt;_</span>
            <span>Terminal</span>
          </button>
        </div>

        <span class="flex shrink-0 items-center px-3 text-[10px] text-muted">bash</span>

        <button
          type="button"
          class="flex w-8 shrink-0 items-center justify-center text-muted transition-colors duration-150 hover:text-ink"
          [attr.aria-expanded]="open()"
          aria-controls="terminal-output"
          [attr.aria-label]="open() ? 'Contraer terminal' : 'Expandir terminal'"
          (click)="toggle()"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="transition-transform duration-200"
            aria-hidden="true"
            [class.rotate-180]="!open()"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      <div
        id="terminal-output"
        role="log"
        aria-live="polite"
        class="min-h-0 flex-1 select-text overflow-auto px-3 py-2 transition-opacity duration-200"
        [attr.aria-hidden]="!open()"
        [class.opacity-0]="!open()"
      >
        @for (line of lines(); track $index) {
          <div [class]="lineClass(line)">
            @if (line.tone === 'command') {
              <span class="text-accent" aria-hidden="true">$</span>
              <span class="ml-1 text-ink">{{ line.text }}</span>
            } @else {
              {{ line.text }}
            }
          </div>
        }

        <div class="flex min-h-4 items-center gap-2">
          <span class="text-accent" aria-hidden="true">$</span>
          <span class="code-caret" aria-hidden="true"></span>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
      flex-shrink: 0;
    }

    .terminal-panel {
      /* El terminal conserva la paleta oscura en ambos temas. */
      --surface-0: 22 22 30;
      --surface: 26 27 38;
      --surface-2: 36 40 59;
      --border: 59 66 82;
      --line-alpha: 0.85;
      --text: 192 202 245;
      --text-muted: 169 177 214;
      --accent: 122 162 247;
      --accent-2: 187 154 247;
      --warm: 255 158 100;
      --green: 158 206 106;
      --error: 255 158 100;
      color-scheme: dark;
      height: 184px;
      max-height: 184px;
      transition: max-height 220ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .terminal-panel-collapsed {
      max-height: 37px;
    }
  `,
})
export class TerminalPanelComponent {
  readonly lines = input.required<TerminalLine[]>();

  protected readonly open = signal(false);

  protected toggle(): void {
    this.open.update((open) => !open);
  }

  protected lineClass(line: TerminalLine): string {
    const base = 'min-h-4 whitespace-pre-wrap break-words text-[11px] leading-4';

    switch (line.tone) {
      case 'command':
        return `${base} text-ink`;
      case 'muted':
        return `${base} text-muted/70`;
      case 'info':
        return `${base} text-muted`;
      case 'success':
        return `${base} text-accent-2`;
      case 'link':
        return `${base} text-accent`;
      default:
        return `${base} text-muted`;
    }
  }
}
