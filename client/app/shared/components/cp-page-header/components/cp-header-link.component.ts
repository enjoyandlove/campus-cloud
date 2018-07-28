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

  constructor(public router: Router, public cpTracking: CPTrackingService) {}

  isExtraMenuRoute() {
    return this.router.url === this.extraMenu.url;
  }

  setQueryParams(page) {
    return page.clearParams ? null : 'merge';
  }

  trackSubMenu(subMenu, isSubMenuItem) {
    const eventName = isSubMenuItem
      ? amplitudeEvents.CLICKED_PAGE_ITEM
      : amplitudeEvents.CLICKED_SUB_MENU;

    return {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName,
      eventProperties : this.setEventProperties(subMenu, isSubMenuItem)
    };
  }

  setEventProperties(subMenu, isSubMenuItem) {
    const subMenuProperties = {
      menu_name: this.cpTracking.activatedRoute(RouteLevel.first),
      sub_menu_name: subMenu
    };

    const subMenuItemProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: subMenu
    };

    return isSubMenuItem ? subMenuItemProperties : subMenuProperties;
  }
}
