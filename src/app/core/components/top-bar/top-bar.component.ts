import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_TABS } from '../../../data/navigation';
import { PROFILE } from '../../../data/profile';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-top-bar',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './top-bar.component.html',
})
export class TopBarComponent {
  protected readonly tabs = NAV_TABS;
  protected readonly profile = PROFILE;
  protected readonly theme = inject(ThemeService);
}
