import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { isProd } from '../../../config/env';

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
  readyFeatures = [];
  extraChildren = [];

  constructor(public router: Router) {}

  isExtraMenuRoute() {
    return this.router.url === this.extraMenu.url;
  }

  getProductionReadyFeatures() {
    return this.data.children.filter((child) => !child.hasOwnProperty('hiddenInProd'));
  }

  ngOnChanges() {
    this.readyFeatures = isProd ? this.getProductionReadyFeatures() : this.data.children;

    if (this.readyFeatures.length > this.maxChildren) {
      this.extraChildren = this.readyFeatures.filter(
        (_, index) => index + 1 > this.maxChildren
      );

      this.extraMenu =
        this.extraChildren.filter(
          (child) => child.url === this.router.url
        )[0] || null;

      if (
        this.readyFeatures.length === this.maxChildren + 1 &&
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
