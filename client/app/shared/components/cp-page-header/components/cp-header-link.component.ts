import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { CP_TRACK_TO } from '../../../directives/tracking';
import { amplitudeEvents } from '../../../constants/analytics';
import { CPTrackingService, RouteLevel } from '../../../services';

@Component({
  selector: 'cp-header-link',
  templateUrl: './cp-header-link.component.html',
  styleUrls: ['./cp-header-link.component.scss']
})
export class CPHeaderLinkComponent {
  @Input() extraMenu;
  @Input() maxChildren;
  @Input() readyFeatures;
  @Input() extraChildren;

  constructor(
    public router: Router,
    public cpTracking: CPTrackingService) {}

  isExtraMenuRoute() {
    return this.router.url === this.extraMenu.url;
  }

  trackSubMenu(subMenu) {
    const eventName = amplitudeEvents.CLICKED_SUB_MENU;
    const menuName = this.cpTracking.activatedRoute(this.router, RouteLevel.first);
    const eventProperties = {
      menu_name: menuName,
      sub_menu_name: subMenu
    };

    return {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: eventName,
      eventProperties: eventProperties
    };
  }
}
