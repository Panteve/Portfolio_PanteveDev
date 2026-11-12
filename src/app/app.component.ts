import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AmbientBackgroundComponent } from './core/components/ambient-background/ambient-background.component';
import { MobileNavComponent } from './core/components/mobile-nav/mobile-nav.component';
import { StatusBarComponent } from './core/components/status-bar/status-bar.component';
import { TopBarComponent } from './core/components/top-bar/top-bar.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TopBarComponent,
    StatusBarComponent,
    MobileNavComponent,
    AmbientBackgroundComponent,
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.css',
})
export class AppComponent {}
