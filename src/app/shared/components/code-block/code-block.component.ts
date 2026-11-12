import { Component, computed, input, output, ChangeDetectionStrategy } from '@angular/core';
import { highlightCode, tokenClass } from '../../utils/highlight';

@Component({
  selector: 'app-code-block',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="overflow-x-auto font-mono text-[12px] leading-6">
      <div class="w-max min-w-full py-1">
        @for (line of lines(); track $index) {
          <div
            class="code-line flex"
            [class.code-line-active]="$index === activeLine()"
            (click)="lineClick.emit($index)"
          >
            @if (showLineNumbers()) {
              <span
                class="w-10 shrink-0 select-none pr-3 text-right text-[11px] text-muted"
                aria-hidden="true"
                >{{ $index + 1 }}</span
              >
            }
            @if (line.indent > 0) {
              <span
                class="indent-guides shrink-0"
                [style.width]="line.indent + 'ch'"
                aria-hidden="true"
              ></span>
            }
            <span class="whitespace-pre pr-4">
              @for (token of line.tokens; track $index) {
                <span [class]="tokenClass(token)">{{ token.text }}</span>
              }
              @if (line.tokens.length === 0 && !(showCursor() && $last)) {
                <span class="tok-plain">&nbsp;</span>
              }
              @if (showCursor() && $last) {
                <span class="code-caret" aria-hidden="true"></span>
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
  readonly showCursor = input(false);
  readonly activeLine = input(-1);

  readonly lineClick = output<number>();

  protected readonly lines = computed(() => highlightCode(this.code()));
  protected readonly tokenClass = tokenClass;
}
