import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { PROFILE, STACK } from '../../data/profile';
import { AimGameComponent } from './components/aim-game/aim-game.component';

@Component({
  selector: 'app-inicio',
  imports: [AimGameComponent, RouterLink],
  templateUrl: './inicio.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    :host {
      display: flex;
      flex: 1;
      flex-direction: column;
    }
  `,
})
export class InicioComponent {
  protected readonly profile = PROFILE;
  protected readonly stack = STACK;

  constructor() {
    inject(SeoService).set(
      'Diego — Desarrollador full-stack',
      'Portfolio de Diego, desarrollador full-stack en Bogotá. Proyectos de software, videojuegos y diseño de interfaces.',
    );
  }
}
