import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_TABS } from '../../../data/navigation';

@Component({
  selector: 'app-mobile-nav',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <nav
      class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur lg:hidden"
      aria-label="Navegación principal"
    >
      <div class="grid grid-cols-4">
        @for (tab of tabs; track tab.path) {
          <a
            [routerLink]="tab.path"
            routerLinkActive="text-accent bg-ink/[0.03]"
            #rla="routerLinkActive"
            [routerLinkActiveOptions]="{ exact: !!tab.exact }"
            [attr.aria-current]="rla.isActive ? 'page' : null"
            class="flex flex-col items-center gap-1.5 py-2.5 text-[10px] text-muted transition-colors duration-150"
          >
            <span class="h-1 w-4 rounded-full bg-current opacity-40" aria-hidden="true"></span>
            {{ tab.label }}
          </a>
        }
      </div>
      <div class="pb-[env(safe-area-inset-bottom)]"></div>
    </nav>
  `,
})
export class MobileNavComponent {
  protected readonly tabs = NAV_TABS;
}
