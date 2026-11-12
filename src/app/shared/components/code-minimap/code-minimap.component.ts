import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { highlightCode, tokenClass } from '../../utils/highlight';
import type { CodeToken } from '../../utils/highlight';

@Component({
  selector: 'app-code-minimap',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="minimap" aria-hidden="true">
      @for (line of lines(); track $index) {
        <div
          class="minimap-line"
          [class.minimap-line-active]="$index === activeLine()"
          [style.paddingLeft.px]="indentWidth(line.indent)"
        >
          @for (token of line.tokens; track $index) {
            <span
              class="minimap-token"
              [class]="tokenClass(token)"
              [style.width.px]="tokenWidth(token)"
            ></span>
          }
        </div>
      }
    </div>
  `,
})
export class CodeMinimapComponent {
  readonly code = input.required<string>();
  readonly activeLine = input(-1);

  protected readonly lines = computed(() => highlightCode(this.code()));
  protected readonly tokenClass = tokenClass;

  protected indentWidth(indent: number): number {
    return indent * 0.55;
  }

  protected tokenWidth(token: CodeToken): number {
    return Math.max(1, token.text.length * 0.55);
  }
}
