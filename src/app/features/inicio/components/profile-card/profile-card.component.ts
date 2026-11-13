import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROFILE } from '../../../../data/profile';

@Component({
  selector: 'app-profile-card',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <article
      class="overflow-hidden rounded-lg border border-line bg-surface-2"
      aria-labelledby="perfil-titulo"
    >
      <div class="flex items-center justify-between border-b border-line px-4 py-2.5">
        <h2 id="perfil-titulo" class="text-[13px] uppercase tracking-[0.16em] text-muted">
          perfil_scan
        </h2>
        <span class="flex items-center gap-1.5 text-[13px] text-green">
          <span class="h-1.5 w-1.5 rounded-full bg-green" aria-hidden="true"></span>
          en línea
        </span>
      </div>

      <div class="p-3 sm:p-4">
        <figure class="relative overflow-hidden rounded-md border border-line bg-surface-0">
          <div class="aspect-[4/5] overflow-hidden">
            @if (profile.photoUrl) {
              <img
                class="h-full w-full object-cover"
                [src]="profile.photoUrl"
                [alt]="'Retrato de ' + profile.firstName + ' ' + profile.lastName"
              />
            } @else {
              <!-- TODO(diego): añadir una foto vertical en /assets y rellenar photoUrl. -->
              <div
                class="profile-photo-grid flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center"
                role="img"
                aria-label="Foto de perfil pendiente"
              >
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-muted/40"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-3.3 3.6-6 8-6s8 2.7 8 6" />
                </svg>
                <p class="text-[13px] uppercase tracking-[0.16em] text-muted">// foto</p>
                <p class="max-w-[190px] text-[13px] leading-5 text-muted">
                  Retrato vertical pendiente
                </p>
              </div>
            }
          </div>

          <figcaption
            class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-0 via-surface-0/80 to-transparent px-4 pb-4 pt-12"
          >
            <p class="text-lg font-semibold leading-tight text-ink">
              {{ profile.firstName }} {{ profile.lastName }}
            </p>
            <p class="mt-1 text-[13px] text-muted">{{ profile.role }}</p>
          </figcaption>
        </figure>
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      max-width: 380px;
    }

    .profile-photo-grid {
      background-image:
        linear-gradient(rgb(var(--text) / 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgb(var(--text) / 0.04) 1px, transparent 1px);
      background-size: 28px 28px;
    }
  `,
})
export class ProfileCardComponent {
  protected readonly profile = PROFILE;
}
