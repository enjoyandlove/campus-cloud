import { Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CPSession } from '@app/session';

interface IChildren {
  url: string;
  label: string;
  hidden?: boolean;
  amplitude?: string;
  allow_internal?: boolean;
}

interface IData {
  heading: string;
  subheading?: string;
  em?: string;
  crumbs?: {
    url: string;
    label: string;
  };
  children: IChildren[];
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

  constructor(public router: Router, public route: ActivatedRoute, public session: CPSession) {}

  ngOnChanges() {
    if (this.data.children.length > this.maxChildren) {
      this.extraChildren = this.data.children.filter((_, index) => index + 1 > this.maxChildren);

      this.extraMenu =
        this.extraChildren.filter((child) => child.url === this.router.url)[0] || null;

      if (this.data.children.length === this.maxChildren + 1 && this.extraMenu) {
        this.extraChildren = [];
      }
    } else {
      this.extraMenu = null;
      this.extraChildren = [];
    }
  }
}
