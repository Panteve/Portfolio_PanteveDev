import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PROFILE, SOCIAL_LINKS } from '../../../data/profile';

@Component({
  selector: 'app-contact-card',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <article class="overflow-hidden rounded-md border border-line bg-surface">
      <header
        class="flex items-center justify-between gap-2 border-b border-line bg-white/[0.02] px-3 py-2"
      >
        <div class="flex min-w-0 items-center gap-2">
          <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true"></span>
          <p class="truncate text-[11px] text-ink">contacto.sh</p>
        </div>
        <span class="shrink-0 text-[10px] text-muted">bash</span>
      </header>

      <div class="space-y-0.5 px-2 py-2 text-[11px] leading-5">
        <p class="px-1.5 text-muted"><span class="text-accent">$</span> ./contacto.sh</p>

        @for (link of contactLinks; track link.command) {
          <a
            [href]="link.href"
            [attr.target]="link.external ? '_blank' : null"
            [attr.rel]="link.external ? 'noreferrer' : null"
            class="group flex items-center gap-2 rounded px-1.5 py-0.5 transition-colors duration-150 hover:bg-white/5"
          >
            <span class="shrink-0 text-accent/70" aria-hidden="true">›</span>
            <span class="w-14 shrink-0 text-[10px] text-muted">{{ link.command }}</span>
            <span class="truncate text-ink transition-colors group-hover:text-accent">
              {{ link.value }}
            </span>
          </a>
        }
      </div>

      <footer
        class="flex items-center justify-between gap-2 border-t border-line px-3 py-2 text-[10px] text-muted"
      >
        <span class="truncate">// {{ profile.city }}</span>
        <span class="shrink-0">bash · UTF-8</span>
      </footer>
    </article>
  `,
})
export class ContactCardComponent {
  protected readonly profile = PROFILE;

  protected readonly contactLinks = SOCIAL_LINKS.map((link) => ({
    ...link,
    command: link.icon,
    href: link.url,
    value: link.icon === 'mail' ? PROFILE.email : link.url.replace(/^https?:\/\//, ''),
  }));
}
