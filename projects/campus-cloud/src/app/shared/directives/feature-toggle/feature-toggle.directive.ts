import { Directive, OnInit, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { get as _get } from 'lodash';

import { CPSession } from '@campus-cloud/session';
import { environment } from '@projects/campus-cloud/src/environments/environment';

@Directive({
  selector: '[cpFeatureToggle]'
})
export class CPFeatureToggleDirective implements OnInit {
  _feature: string;

  @Input()
  set cpFeatureToggle(cpFeatureToggle) {
    this._feature = cpFeatureToggle;
  }

  constructor(
    private session: CPSession,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit() {
    if (this.isEnabled()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  isEnabled() {
    const { flags } = environment;

    if (flags['*'] || !this._feature) {
      return true;
    }

    const feature = _get(flags, this._feature, null);

    if (!feature) {
      return false;
    }

    const { id } = this.session.g.get('school');

    return this.session.isInternal || feature.whitelist.includes(id);
  }
}
