import { OnInit, QueryList, Component, ContentChildren, AfterContentInit } from '@angular/core';

import { CPTabComponent } from './../cp-tab/cp-tab.component';

@Component({
  selector: 'cp-tabs',
  templateUrl: './cp-tabs.component.html',
  styleUrls: ['./cp-tabs.component.scss']
})
export class CPTabsComponent implements OnInit, AfterContentInit {
  @ContentChildren(CPTabComponent) tabs: QueryList<CPTabComponent>;

  constructor() {}

  selectTab(tab: CPTabComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach((t: CPTabComponent) => (t.active = false));

    // activate the tab the user has clicked on.
    tab.active = true;
  }

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter((t: CPTabComponent) => t.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  ngOnInit(): void {}
}
