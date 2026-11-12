import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PROFILE, SOCIAL_LINKS } from '../../../data/profile';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-status-bar',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './status-bar.component.html',
})
export class StatusBarComponent {
  protected readonly socialLinks = SOCIAL_LINKS;
  protected readonly profile = PROFILE;
}
