import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeSnippet } from '../../../data/snippets';
import { CodeBlockComponent } from '../code-block/code-block.component';

@Component({
  selector: 'app-snippet-card',
  imports: [RouterLink, CodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <article class="flex h-full flex-col overflow-hidden rounded-md border border-line bg-surface">
      <header
        class="flex items-start justify-between gap-2 border-b border-line bg-white/[0.02] px-3 py-2"
      >
        <div class="min-w-0">
          <p class="truncate text-[11px] text-ink">{{ snippet().projectName }}</p>
          <p class="truncate text-[10px] text-muted">{{ snippet().description }}</p>
        </div>
        <span class="shrink-0 text-[10px] text-muted">{{ snippet().language }}</span>
      </header>

      <div class="snippet-fade max-h-36 overflow-hidden px-3 py-1 text-[11px]">
        <app-code-block [code]="snippet().code" [showLineNumbers]="false" />
      </div>

      <footer class="mt-auto flex items-center justify-between gap-2 border-t border-line px-3 py-2">
        <span class="truncate text-[10px] text-muted">// TODO(diego): código real</span>
        <a
          [routerLink]="['/proyectos', snippet().projectId]"
          class="shrink-0 text-[11px] text-accent hover:underline"
        >
          detalles →
        </a>
      </footer>
    </article>
  `,
})
export class SnippetCardComponent {
  readonly snippet = input.required<CodeSnippet>();
}
