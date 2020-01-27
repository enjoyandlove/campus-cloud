import { OnInit, Component, QueryList, ContentChildren, AfterContentInit } from '@angular/core';

import { TabComponent } from './../tab/tab.component';

@Component({
  selector: 'ready-ui-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  host: { role: 'tabpanel' }
})
export class TabsComponent implements OnInit, AfterContentInit {
  @ContentChildren(TabComponent) public tabs: QueryList<TabComponent>;

  constructor() {}

  ngOnInit() {}

  showTabById(id: string) {
    this.tabs.forEach((t) => (t.visible = t.id === id));
  }

  ngAfterContentInit() {
    const selected = this.tabs.find((t: TabComponent) => Boolean(t.visible));

    if (!selected) {
      this.tabs.first.visible = true;
    }
  }
}
