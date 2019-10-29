import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';

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

    this.cpTracking.amplitudeEmitEvent(eventName, this.setEventProperties(subMenu, isSubMenuItem));
  }

  setEventProperties(subMenu, isSubMenuItem) {
    const menus = this.cpTracking.getAmplitudeMenuProperties();
    const subMenuProperties = {
      menu_name: menus['menu_name'],
      sub_menu_name: subMenu
    };

    const subMenuItemProperties = {
      ...this.cpTracking.getAmplitudeMenuProperties(),
      page_name: subMenu
    };

    return isSubMenuItem ? subMenuItemProperties : subMenuProperties;
  }
}
