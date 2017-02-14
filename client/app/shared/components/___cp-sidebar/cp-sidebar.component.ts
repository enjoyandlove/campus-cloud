import { Component, OnInit, Input } from '@angular/core';

interface IPrivilege {
  index: number;
  privilege: number;
}

@Component({
  selector: 'cp-sidebar',
  templateUrl: './cp-sidebar.component.html',
  styleUrls: ['./cp-sidebar.component.scss']
})
export class CPSideBarComponent implements OnInit {
  @Input() privileges: IPrivilege[] = [];
  menuItems;

  constructor() { }


  ngOnInit() {
    const menu = require('./sidebar.items.json');

    this.menuItems = menu.map(group => {
      let children = [];

      group.children.map(child => {
        if (this.privileges.includes(child.type)) {
          children.push(child);
        }
      });

      return Object.assign({}, group, { children });
    });

  }
}


