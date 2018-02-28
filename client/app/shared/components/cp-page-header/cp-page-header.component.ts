import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

interface IData {
  heading: string;
  subheading?: string;
  em?: string;
  children: [
    {
      label: string;
      url: string;
    }
  ];
}

@Component({
  selector: 'cp-page-header',
  templateUrl: './cp-page-header.component.html',
  styleUrls: ['./cp-page-header.component.scss']
})
export class CPPageHeaderComponent implements OnChanges {
  @Input() data: IData;

  extraMenu = null;
  maxChildren = 6;
  extraChildren = [];

  constructor(public router: Router) {}

  isExtraMenuRoute() {
    return this.router.url === this.extraMenu.url;
  }

  ngOnChanges() {
    if (this.data.children.length > this.maxChildren) {
      this.extraChildren = this.data.children.filter(
        (_, index) => index + 1 > this.maxChildren
      );

      this.extraMenu =
        this.extraChildren.filter(
          (child) => child.url === this.router.url
        )[0] || null;

      if (
        this.data.children.length === this.maxChildren + 1 &&
        this.extraMenu
      ) {
        this.extraChildren = [];
      }
    } else {
      this.extraMenu = null;
      this.extraChildren = [];
    }
  }
}
