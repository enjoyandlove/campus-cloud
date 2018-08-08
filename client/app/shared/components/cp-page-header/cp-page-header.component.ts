import { Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { get as _get } from 'lodash';
import { CPSession } from './../../../session';
import { isProd } from '../../../config/env';

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
  readyFeatures = [];
  extraChildren = [];

  constructor(public router: Router, public route: ActivatedRoute, public session: CPSession) {}

  getProductionReadyFeatures() {
    const hidden = (child) => _get(child, 'hidden', false);
    const internalDemo = (child) => _get(child, 'allow_internal', false);
    const isInternal = this.session.isInternal;

    return this.data.children.filter(
      (c) => (hidden(c) && internalDemo(c) && isInternal ? c : !hidden(c))
    );
  }

  ngOnChanges() {
    this.readyFeatures = isProd ? this.getProductionReadyFeatures() : this.data.children;

    if (this.readyFeatures.length > this.maxChildren) {
      this.extraChildren = this.readyFeatures.filter((_, index) => index + 1 > this.maxChildren);

      this.extraMenu =
        this.extraChildren.filter((child) => child.url === this.router.url)[0] || null;

      if (this.readyFeatures.length === this.maxChildren + 1 && this.extraMenu) {
        this.extraChildren = [];
      }
    } else {
      this.extraMenu = null;
      this.extraChildren = [];
    }
  }
}
