import { Directive, OnInit, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { get as _get } from 'lodash';

import { CPSession } from '@app/session';
import { environment } from '@client/environments/environment';

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

    const isInternalButNotPublic = feature.internal && !feature.active;

    return isInternalButNotPublic ? this.session.isInternal : feature.active;
  }
}
