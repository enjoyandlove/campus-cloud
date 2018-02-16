import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

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
  styleUrls: ['./cp-page-header.component.scss'],
})
export class CPPageHeaderComponent implements OnInit {
  @Input() data: IData;

  extraMenu = null;
  maxChildren = 5;
  extraChildren = [];

  constructor(public router: Router) {}

  isExtraMenuRoute() {
    return this.router.url === this.extraMenu.url;
  }

  ngOnInit() {
    if (this.data.children.length > this.maxChildren) {
      this.extraChildren = this.data.children.filter(
        (_, index) => index + 1 > this.maxChildren,
      );

      this.extraMenu =
        this.extraChildren.filter(
          (child) => child.url === this.router.url,
        )[0] || null;
    }
  }
}
