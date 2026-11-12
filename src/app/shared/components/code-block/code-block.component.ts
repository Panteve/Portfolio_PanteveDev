import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { highlightCode } from '../../utils/highlight';

@Component({
  selector: 'app-code-block',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="overflow-x-auto font-mono text-[12px] leading-6">
      <div class="min-w-max py-1">
        @for (line of lines(); track $index) {
          <div class="flex">
            @if (showLineNumbers()) {
              <span
                class="w-10 shrink-0 select-none pr-3 text-right text-[11px] text-muted"
                aria-hidden="true"
                >{{ $index + 1 }}</span
              >
            }
            <span class="whitespace-pre pr-4">
              @for (token of line; track $index) {
                <span [class]="'tok-' + token.kind">{{ token.text }}</span>
              } @empty {
                <span class="tok-plain">&nbsp;</span>
              }
            </span>
          </div>
        }
      </div>
    </div>
  `,
})
export class CodeBlockComponent {
  readonly code = input.required<string>();
  readonly showLineNumbers = input(true);

  protected readonly lines = computed(() => highlightCode(this.code()));
}
